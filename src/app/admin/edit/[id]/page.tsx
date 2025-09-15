
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2, Trash2, ArrowUp, ArrowDown, Upload, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useProducts } from '@/hooks/use-products';
import { generateDescription } from '@/ai/flows/generate-description-flow';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.enum(['suits', 'sarees', 'kurtis', 'dresses', 'kaftans', 'anarkali', 'indo-western', 'coord-sets']),
  fabric: z.string().min(3, 'Fabric is required.'),
  bestseller: z.boolean(),
  images: z.array(z.string().min(1, "Image path cannot be empty.")).min(1, "At least one image is required."),
  newImages: z.any()
    .refine((files) => !files || Array.from(files).every((file: any) => file?.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(
      (files) => !files || Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file?.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CATEGORIES: Product['category'][] = ['suits', 'sarees', 'kurtis', 'dresses', 'kaftans', 'anarkali', 'indo-western', 'coord-sets'];


export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { products, updateProduct, forceRerender } = useProducts();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    
    const product = products.find(p => p.id === id);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            category: 'suits',
            fabric: '',
            bestseller: false,
            images: [],
            newImages: undefined,
        },
    });

    const { fields, remove, move } = useFieldArray({
        control: form.control,
        name: "images"
    });

    useEffect(() => {
        if (product) {
            form.reset({
                 name: product.name,
                 price: product.price,
                 description: product.description,
                 category: product.category,
                 fabric: product.fabric,
                 bestseller: product.bestseller,
                 images: product.images
            });
        }
    }, [product, form]);
    
    const newImagesFiles = form.watch('newImages');
    useEffect(() => {
        if (newImagesFiles && newImagesFiles.length > 0) {
            const urls = Array.from(newImagesFiles).map((file: any) => URL.createObjectURL(file));
            setNewImagePreviews(urls);
            return () => urls.forEach(url => URL.revokeObjectURL(url));
        }
        setNewImagePreviews([]);
    }, [newImagesFiles]);


    if (!product) {
        return <div className="container mx-auto flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        try {
            const currentValues = form.getValues();
            const result = await generateDescription({
                name: currentValues.name,
                category: currentValues.category,
                fabric: currentValues.fabric,
            });
            if (result.description) {
                form.setValue('description', result.description, { shouldValidate: true });
                toast({
                    title: 'Description Generated',
                    description: 'The AI-powered description has been added.',
                });
            }
        } catch (error) {
            console.error('Failed to generate description', error);
            toast({
                title: 'Error',
                description: 'Could not generate description. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = async (data: ProductFormValues) => {
        setIsSaving(true);
        try {
            let uploadedImageUrls: string[] = [];

            // 1. Upload new images if any
            if (data.newImages && data.newImages.length > 0) {
                const formData = new FormData();
                for (const file of Array.from(data.newImages as FileList)) {
                    formData.append('files', file);
                }

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Failed to upload new images');
                }
                const { urls } = await uploadResponse.json();
                uploadedImageUrls = urls;
            }

            // 2. Combine existing and new image URLs
            const finalImages = [...data.images, ...uploadedImageUrls];
            
            if (finalImages.length === 0) {
                form.setError('images', { type: 'manual', message: 'At least one image is required.' });
                setIsSaving(false);
                return;
            }

            // 3. Update product with new data
            const productUpdateData = { ...data, images: finalImages };
            delete productUpdateData.newImages; // Don't save this to DB

            const response = await fetch(`/api/products/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productUpdateData),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            const updatedProductFromServer = await response.json();
            
            updateProduct(updatedProductFromServer);
            forceRerender();

            toast({
                title: 'Product Updated',
                description: `"${data.name}" has been successfully updated.`,
            });
            router.push('/admin/products');

        } catch (error) {
             toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Could not update the product. Please try again.',
                variant: 'destructive',
            });
            console.error('Failed to update product:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="mb-4">
                 <Button variant="outline" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>Update the details for "{product.name}".</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" {...form.register('name')} />
                                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" type="number" {...form.register('price')} />
                                {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
                            </div>
                        </div>
                        
                        {/* Description */}
                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="description">Description</Label>
                                 <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate with AI
                                </Button>
                            </div>
                            <Textarea id="description" {...form.register('description')} rows={5} />
                            {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                        </div>

                        {/* Category and Fabric */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label>Category</Label>
                                <Controller control={form.control} name="category"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => (
                                                    <SelectItem key={cat} value={cat} className="capitalize">{cat.replace('-', ' ')}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.category && <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="fabric">Fabric</Label>
                                <Input id="fabric" {...form.register('fabric')} />
                                {form.formState.errors.fabric && <p className="text-sm text-destructive">{form.formState.errors.fabric.message}</p>}
                            </div>
                        </div>

                        {/* Image Management */}
                        <div className="space-y-4">
                            <Label>Product Images</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="relative aspect-square rounded-md overflow-hidden border group">
                                        <Image src={form.watch(`images.${index}`)} alt={`Product image ${index + 1}`} fill className="object-cover"/>
                                        <div className="absolute top-0 right-0 flex flex-col bg-white/70">
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => move(index, index - 1)} disabled={index === 0}>
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                         <Button type="button" variant="ghost" size="icon" className="absolute bottom-0 right-0 h-8 w-8 shrink-0 bg-white/70 hover:bg-destructive/80 hover:text-white" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {newImagePreviews.map((previewUrl, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                                        <Image src={previewUrl} alt={`New image preview ${index + 1}`} fill className="object-cover opacity-70" />
                                         <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-foreground" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div>
                                <Label htmlFor="newImages" className="text-sm font-medium">Add New Images</Label>
                                <Input
                                    id="newImages"
                                    type="file"
                                    multiple
                                    accept="image/png, image/jpeg, image/webp"
                                    {...form.register("newImages")}
                                />
                                {form.formState.errors.newImages && <p className="text-sm text-destructive">{form.formState.errors.newImages.message as string}</p>}
                            </div>
                            
                            {form.formState.errors.images && <p className="text-sm text-destructive">{form.formState.errors.images.message}</p>}
                            {form.formState.errors.images?.root && <p className="text-sm text-destructive">{form.formState.errors.images.root.message}</p>}
                        </div>
                        
                        {/* Bestseller Checkbox */}
                        <div className="flex items-center space-x-2">
                             <Controller name="bestseller" control={form.control}
                                render={({ field }) => ( <Checkbox id="bestseller" checked={field.value} onCheckedChange={field.onChange} /> )}
                            />
                            <Label htmlFor="bestseller" className="font-normal">Mark as bestseller</Label>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
                            <Button type="submit" disabled={isSaving || isGenerating}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
