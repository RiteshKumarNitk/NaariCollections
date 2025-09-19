

"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { ArrowLeft, Loader2, ImagePlus, X, Check, Upload, Trash2 } from 'lucide-react';
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
  heroProductIds: z.array(z.string()),
  heroImageUrls: z.array(z.string()),
  newImages: z.any()
    .refine((files) => !files || Array.from(files).every((file: any) => file?.size <= 5 * 1024 * 1024), `Max file size is 5MB.`)
    .refine(
      (files) => !files || Array.from(files).every((file: any) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ).optional(),
}).refine(data => data.heroProductIds.length > 0 || data.heroImageUrls.length > 0, {
    message: 'Please select at least one product image or upload a custom hero image.',
    path: ['heroProductIds'],
});

type HomepageFormValues = z.infer<typeof homepageSchema>;

export default function HomepageContentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { products } = useProducts();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    const form = useForm<HomepageFormValues>({
        resolver: zodResolver(homepageSchema),
        defaultValues: {
            headline: '',
            subheadline: '',
            heroProductIds: [],
            heroImageUrls: [],
            newImages: undefined,
        },
    });
    
    const { fields: heroImageFields, remove: removeHeroImage } = useFieldArray({
        control: form.control,
        name: "heroImageUrls"
    });

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/homepage');
                const data = await response.json();
                form.reset({
                    ...data,
                    heroImageUrls: data.heroImageUrls || [],
                });
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
    
     const newImagesFiles = form.watch('newImages');
    useEffect(() => {
        if (newImagesFiles && newImagesFiles.length > 0) {
            const urls = Array.from(newImagesFiles).map((file: any) => URL.createObjectURL(file));
            setNewImagePreviews(urls);
            return () => urls.forEach(url => URL.revokeObjectURL(url));
        }
        setNewImagePreviews([]);
    }, [newImagesFiles]);
    
    const onSubmit = async (data: HomepageFormValues) => {
        setIsSaving(true);
        try {
            let uploadedImageUrls: string[] = [];

            if (data.newImages && data.newImages.length > 0) {
                const formData = new FormData();
                for (const file of Array.from(data.newImages as FileList)) {
                    formData.append('files', file);
                }
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!uploadResponse.ok) throw new Error('Failed to upload new images');
                const { urls } = await uploadResponse.json();
                uploadedImageUrls = urls;
            }
            
            const finalData = {
                ...data,
                heroImageUrls: [...(data.heroImageUrls || []), ...uploadedImageUrls],
            };
            delete finalData.newImages;

            const response = await fetch('/api/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
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
        <div className="container mx-auto">
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

                        {/* Custom Image Upload */}
                         <div className="space-y-4">
                             <Label>Custom Hero Images</Label>
                             <p className="text-sm text-muted-foreground">Upload custom images for the hero slider. These will be shown first.</p>
                             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {heroImageFields.map((field, index) => (
                                    <div key={field.id} className="relative aspect-square rounded-md overflow-hidden border group">
                                        <Image src={form.watch(`heroImageUrls.${index}`)} alt={`Custom hero image ${index + 1}`} fill className="object-cover"/>
                                         <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeHeroImage(index)}>
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
                                <Label htmlFor="newImages" className="text-sm font-medium">Add New Custom Images</Label>
                                <Input
                                    id="newImages"
                                    type="file"
                                    multiple
                                    accept="image/png, image/jpeg, image/webp"
                                    {...form.register("newImages")}
                                />
                                {form.formState.errors.newImages && <p className="text-sm text-destructive">{form.formState.errors.newImages.message as string}</p>}
                            </div>
                         </div>


                        {/* Product Image Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Product-based Hero Images</Label>
                                    <p className="text-sm text-muted-foreground">Select products to feature in the slider. These appear after custom images.</p>
                                </div>
                                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline"><ImagePlus className="mr-2 h-4 w-4"/> Change Product Images</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                        <DialogTitle>Select Product Images</DialogTitle>
                                        <DialogDescription>
                                            Choose products whose main images you want to feature in the hero slider.
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
                                    <p className="text-muted-foreground">No product images selected.</p>
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
