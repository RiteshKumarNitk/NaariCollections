
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, ImagePlus, X, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const homepageSchema = z.object({
  headline: z.string().min(1, 'Headline is required.'),
  subheadline: z.string().min(1, 'Sub-headline is required.'),
  heroProductIds: z.array(z.string()).min(1, 'Please select at least one hero image.'),
});

type HomepageFormValues = z.infer<typeof homepageSchema>;

export default function HomepageContentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { products } = useProducts();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<HomepageFormValues>({
        resolver: zodResolver(homepageSchema),
        defaultValues: {
            headline: '',
            subheadline: '',
            heroProductIds: [],
        },
    });

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/homepage');
                const data = await response.json();
                form.reset(data);
            } catch (error) {
                console.error("Failed to fetch homepage content", error);
                toast({
                    title: 'Error',
                    description: 'Could not load homepage content.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [form, toast]);
    
    const onSubmit = async (data: HomepageFormValues) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save content');
            }

            toast({
                title: 'Success!',
                description: 'Homepage content has been updated.',
            });
            router.push('/admin');

        } catch (error) {
            console.error("Failed to save homepage content", error);
            toast({
                title: 'Error',
                description: 'Could not save homepage content. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const toggleHeroProduct = (productId: string) => {
        const currentIds = form.getValues('heroProductIds');
        const newIds = currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId];
        form.setValue('heroProductIds', newIds, { shouldValidate: true, shouldDirty: true });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const selectedProducts = form.watch('heroProductIds').map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];

    return (
        <div className="py-8">
            <div className="mb-4">
                <Button variant="outline" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Content</CardTitle>
                    <CardDescription>Update the hero section of your homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Text Content */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="headline">Headline</Label>
                                <Input id="headline" {...form.register('headline')} />
                                {form.formState.errors.headline && <p className="text-sm text-destructive">{form.formState.errors.headline.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="subheadline">Sub-headline</Label>
                                <Textarea id="subheadline" {...form.register('subheadline')} rows={3}/>
                                {form.formState.errors.subheadline && <p className="text-sm text-destructive">{form.formState.errors.subheadline.message}</p>}
                            </div>
                        </div>

                        {/* Image Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Hero Slider Images</Label>
                                    <p className="text-sm text-muted-foreground">Select which product images to display in the homepage slider.</p>
                                </div>
                                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline"><ImagePlus className="mr-2 h-4 w-4"/> Change Images</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                        <DialogTitle>Select Hero Images</DialogTitle>
                                        <DialogDescription>
                                            Choose the products whose main images you want to feature in the homepage hero slider.
                                        </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-[60vh] my-4">
                                             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-1">
                                                {products.map(product => {
                                                    const isSelected = form.watch('heroProductIds').includes(product.id);
                                                    return (
                                                        <div key={product.id} onClick={() => toggleHeroProduct(product.id)} className={`relative aspect-square cursor-pointer rounded-md overflow-hidden ring-offset-background focus-within:ring-2 ring-ring ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover"/>
                                                            <div className={`absolute inset-0 bg-black/50 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                                                <div className="flex items-center justify-center h-full">
                                                                     <Check className="h-8 w-8 text-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                             </div>
                                        </ScrollArea>
                                         <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
                                    </DialogContent>
                                </Dialog>
                            </div>
                             {form.formState.errors.heroProductIds && <p className="text-sm text-destructive">{form.formState.errors.heroProductIds.message}</p>}
                            
                            {selectedProducts.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {selectedProducts.map(product => (
                                    <div key={product.id} className="relative aspect-square rounded-md overflow-hidden border">
                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                         <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => toggleHeroProduct(product.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-dashed border-2 rounded-md">
                                    <p className="text-muted-foreground">No images selected.</p>
                                </div>
                            )}

                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
