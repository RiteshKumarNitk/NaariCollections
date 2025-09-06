
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
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useProducts } from '@/hooks/use-products';
import { generateDescription } from '@/ai/flows/generate-description-flow';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.enum(['suits', 'sarees', 'kurtis', 'dresses', 'kaftans', 'anarkali', 'indo-western', 'coord-sets']),
  fabric: z.string().min(3, 'Fabric is required.'),
  bestseller: z.boolean(),
  images: z.array(z.string().url()).min(1, "At least one image URL is required."),
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

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            category: 'suits',
            fabric: '',
            bestseller: false,
            images: [''],
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
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            const newProduct = await response.json();
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
                description: 'Could not create the product. Please try again.',
                variant: 'destructive',
            });
            console.error('Failed to create product:', error);
        }
    };
    
    const handleSizeChange = (size: string) => {
        const currentSizes = form.getValues('sizes');
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter(s => s !== size)
            : [...currentSizes, size];
        form.setValue('sizes', newSizes, { shouldValidate: true });
    };

    return (
        <div className="py-8">
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
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" type="number" {...form.register('price')} />
                                {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
                            </div>
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label>Category</Label>
                                <Controller
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Label>Image URL</Label>
                            <Input id="images" {...form.register('images.0')} placeholder="https://example.com/image.jpg" />
                            {form.formState.errors.images && <p className="text-sm text-destructive">{form.formState.errors.images.message}</p>}
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
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Creating...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
