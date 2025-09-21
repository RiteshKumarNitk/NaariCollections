
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2, Upload } from 'lucide-react';
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
  images: z.any()
    .refine((files) => files?.length >= 1, 'At least one image is required.')
    .refine((files) => Array.from(files).every((file: any) => file?.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(
      (files) => Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file?.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  sizes: z.array(z.string()).min(1, "At least one size is required."),
  code: z.string().min(1, "Product code is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CATEGORIES: Product['category'][] = ['suits', 'sarees', 'kurtis', 'dresses', 'kaftans', 'anarkali', 'indo-western', 'coord-sets'];
const ALL_SIZES = ["38", "40", "42", "44", "46", "Free Size"];

export default function AddProductPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { addProduct, forceRerender } = useProducts();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            category: 'suits',
            fabric: '',
            bestseller: false,
            images: undefined,
            sizes: [],
            code: ''
        },
    });

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
        setIsUploading(true);
        try {
            // 1. Upload images
            const formData = new FormData();
            for (const file of Array.from(data.images as FileList)) {
                formData.append('files', file);
            }

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.message || 'Failed to upload images');
            }
            const { urls } = await uploadResponse.json();

            // 2. Create product with image URLs
            const productData = { ...data, images: urls };
            const productResponse = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (!productResponse.ok) {
                 const errorData = await productResponse.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            const newProduct = await productResponse.json();
            addProduct(newProduct);
            forceRerender();

            toast({
                title: 'Product Created',
                description: `"${data.name}" has been successfully added.`,
            });
            router.push('/admin/products');
        } catch (error) {
             toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Could not create the product. Please try again.',
                variant: 'destructive',
            });
            console.error('Failed to create product:', error);
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleSizeChange = (size: string) => {
        const currentSizes = form.getValues('sizes');
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter(s => s !== size)
            : [...currentSizes, size];
        form.setValue('sizes', newSizes, { shouldValidate: true });
    };
    
    const imageRef = form.register("images");

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
                    <CardTitle>Add New Product</CardTitle>
                    <CardDescription>Fill in the details for the new product.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" {...form.register('name')} />
                                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="price">Price (<span className="font-rupee">₹</span>)</Label>
                                <Input id="price" type="number" {...form.register('price')} />
                                {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="description">Description</Label>
                                 <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </Button>
                            </div>
                            <Textarea id="description" {...form.register('description')} rows={5} />
                            {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label>Category</Label>
                                <Controller
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => ( <SelectItem key={cat} value={cat} className="capitalize">{cat.replace('-', ' ')}</SelectItem> ))}
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
                        
                         <div className="space-y-2">
                            <Label htmlFor="code">Product Code</Label>
                            <Input id="code" {...form.register('code')} />
                            {form.formState.errors.code && <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Product Images</Label>
                            <Input
                                id="images"
                                type="file"
                                multiple
                                accept="image/png, image/jpeg, image/webp"
                                {...imageRef}
                            />
                            {form.formState.errors.images && <p className="text-sm text-destructive">{form.formState.errors.images.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Sizes</Label>
                            <div className="flex flex-wrap gap-2">
                                {ALL_SIZES.map(size => (
                                    <div key={size} className="flex items-center">
                                        <Checkbox
                                            id={`size-${size}`}
                                            onCheckedChange={() => handleSizeChange(size)}
                                            checked={form.watch('sizes').includes(size)}
                                        />
                                        <Label htmlFor={`size-${size}`} className="ml-2 font-normal">{size}</Label>
                                    </div>
                                ))}
                            </div>
                             {form.formState.errors.sizes && <p className="text-sm text-destructive">{form.formState.errors.sizes.message}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Controller name="bestseller" control={form.control} render={({ field }) => ( <Checkbox id="bestseller" checked={field.value} onCheckedChange={field.onChange} /> )}/>
                            <Label htmlFor="bestseller" className="font-normal">Mark as bestseller</Label>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
                            <Button type="submit" disabled={isUploading || isGenerating}>
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isUploading ? 'Creating...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
