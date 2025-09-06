
"use client";

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useProducts } from '@/hooks/use-products';


const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.enum(['suits', 'sarees', 'kurtis', 'dresses', 'kaftans', 'anarkali', 'indo-western', 'coord-sets']),
  fabric: z.string().min(3, 'Fabric is required.'),
  bestseller: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CATEGORIES: Product['category'][] = ['suits', 'sarees', 'kurtis', 'dresses', 'kaftans', 'anarkali', 'indo-western', 'coord-sets'];


export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { products, updateProduct, forceRerender } = useProducts();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
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
        },
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
            });
        }
    }, [product, form]);


    if (!product) {
        // This can happen briefly on load, so we show a loading state.
        return <div>Loading...</div>;
    }

    const onSubmit = async (data: ProductFormValues) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            const updatedProductFromServer = await response.json();
            
            // Update the local state for immediate feedback
            updateProduct(updatedProductFromServer);

            // Force other components to refetch data
            forceRerender();

            toast({
                title: 'Product Updated',
                description: `"${data.name}" has been successfully updated.`,
            });
            router.push('/admin/products');

        } catch (error) {
             toast({
                title: 'Error',
                description: 'Could not update the product. Please try again.',
                variant: 'destructive',
            });
            console.error('Failed to update product:', error);
        }
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
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>Update the details for "{product.name}".</CardDescription>
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
                            <Label htmlFor="description">Description</Label>
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
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
                        
                        <div className="flex items-center space-x-2">
                             <Controller
                                name="bestseller"
                                control={form.control}
                                render={({ field }) => (
                                     <Checkbox
                                        id="bestseller"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="bestseller" className="font-normal">Mark as bestseller</Label>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
