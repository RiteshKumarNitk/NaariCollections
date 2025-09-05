
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { products } from '@/lib/products';
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
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const product = products.find(p => p.id === id);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            price: product?.price || 0,
            description: product?.description || '',
            category: product?.category || 'suits',
            fabric: product?.fabric || '',
            bestseller: product?.bestseller || false,
        },
    });

    if (!product) {
        notFound();
    }

    const onSubmit = (data: ProductFormValues) => {
        // In a real application, you would send this data to your API to update the product.
        // For this prototype, we'll just show a success message.
        console.log('Updated product data:', data);
        toast({
            title: 'Product Updated',
            description: `"${data.name}" has been successfully updated.`,
        });
        router.push('/admin');
    };

    return (
        <div className="py-8">
            <div className="mb-4">
                 <Button variant="outline" asChild>
                    <Link href="/admin">
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
                            <Button type="button" variant="outline" onClick={() => router.push('/admin')}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
