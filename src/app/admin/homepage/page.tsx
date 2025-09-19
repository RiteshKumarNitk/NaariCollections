

"use client";

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { ArrowLeft, Loader2, ImagePlus, X, Check, Upload, Trash2, Sparkles, PlusCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateSubheadline } from '@/ai/flows/generate-subheadline-flow';
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
  heroImageUrls: z.array(z.string()), // Validation moved to onSubmit
  newImages: z.any()
    .refine((files) => !files || (files && files.length === 0) || Array.from(files).every((file: any) => file?.size <= 5 * 1024 * 1024), `Max file size is 5MB.`)
    .refine(
      (files) => !files || (files && files.length === 0) || Array.from(files).every((file: any) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ).optional(),
});

type HomepageFormValues = z.infer<typeof homepageSchema>;

export default function HomepageContentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { products } = useProducts();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<HomepageFormValues>({
        resolver: zodResolver(homepageSchema),
        defaultValues: {
            headline: '',
            subheadline: '',
            heroImageUrls: [],
            newImages: undefined,
        },
    });
    
    const { fields: heroImageFields, remove: removeHeroImage, append: appendHeroImage } = useFieldArray({
        control: form.control,
        name: "heroImageUrls"
    });

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/homepage');
                if (!response.ok) throw new Error("Could not load content.");
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
            const hasNewImages = data.newImages && data.newImages.length > 0;

            if (data.heroImageUrls.length === 0 && !hasNewImages) {
                 toast({
                    title: 'Validation Error',
                    description: 'Please add at least one hero image.',
                    variant: 'destructive',
                });
                setIsSaving(false);
                return;
            }

            if (hasNewImages) {
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
                const uploadResult = await uploadResponse.json();
                uploadedImageUrls = uploadResult.urls;
            }
            
            const finalData = {
                headline: data.headline,
                subheadline: data.subheadline,
                heroImageUrls: [...data.heroImageUrls, ...uploadedImageUrls],
            };

            const response = await fetch('/api/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save content');
            }

            toast({
                title: 'Success!',
                description: 'Homepage content has been updated.',
            });
            
            form.reset({
                ...finalData,
                newImages: undefined,
            });
            setNewImagePreviews([]);

        } catch (error) {
            console.error("Failed to save homepage content", error);
            toast({
                title: 'Error Saving Content',
                description: error instanceof Error ? error.message : 'An unknown error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const addProductImageToHero = (product: Product) => {
        const imageUrl = product.images[0];
        if (imageUrl && !form.getValues('heroImageUrls').includes(imageUrl)) {
            appendHeroImage(imageUrl);
            toast({
                title: 'Image Added',
                description: `Image from ${product.name} has been added to the hero slider.`,
            });
        } else if (form.getValues('heroImageUrls').includes(imageUrl)) {
            toast({
                title: 'Image Already Added',
                description: 'This product image is already in your hero slider.',
                variant: 'destructive',
            });
        }
    };

    const handleGenerateSubheadline = async () => {
        setIsGenerating(true);
        try {
            const headline = form.getValues('headline');
            if (!headline) {
                toast({
                    title: 'Headline Needed',
                    description: 'Please enter a headline first to generate a subheadline.',
                    variant: 'destructive',
                });
                return;
            }
            const result = await generateSubheadline({ headline });
            if (result.subheadline) {
                form.setValue('subheadline', result.subheadline, { shouldValidate: true });
                toast({
                    title: 'Subheadline Generated',
                    description: 'AI has created a new subheadline for you.',
                });
            }
        } catch (error) {
            console.error('Failed to generate subheadline', error);
            toast({
                title: 'Error',
                description: 'Could not generate subheadline. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const newImageRef = form.register("newImages");


    if (isLoading) {
        return <div className="container mx-auto flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

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
                                 <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="subheadline">Sub-headline</Label>
                                     <Button type="button" variant="outline" size="sm" onClick={handleGenerateSubheadline} disabled={isGenerating}>
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                                    </Button>
                                </div>
                                <Textarea id="subheadline" {...form.register('subheadline')} rows={3}/>
                                {form.formState.errors.subheadline && <p className="text-sm text-destructive">{form.formState.errors.subheadline.message}</p>}
                            </div>
                        </div>
                        
                        {/* Hero Image Management */}
                        <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                 <div>
                                    <Label>Hero Images</Label>
                                    <p className="text-sm text-muted-foreground">Manage the images in your homepage slider.</p>
                                </div>
                             </div>
                             
                              {form.formState.errors.heroImageUrls && <p className="text-sm text-destructive">{form.formState.errors.heroImageUrls.message}</p>}
                             
                             {(heroImageFields.length > 0 || newImagePreviews.length > 0) ? (
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
                             ) : (
                                <div className="text-center py-10 border-dashed border-2 rounded-md">
                                    <p className="text-muted-foreground">No hero images added yet.</p>
                                </div>
                             )}

                            <div className="flex items-center gap-2 mt-4">
                                 <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Add from Products</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                        <DialogTitle>Select Product Images</DialogTitle>
                                        <DialogDescription>
                                            Click on a product to add its main image to the hero slider.
                                        </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-[60vh] my-4">
                                             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-1">
                                                {products.map(product => {
                                                    const isSelected = form.watch('heroImageUrls').includes(product.images[0]);
                                                    return (
                                                        <div key={product.id} onClick={() => addProductImageToHero(product)} className={`relative aspect-square cursor-pointer rounded-md overflow-hidden ring-offset-background focus-within:ring-2 ring-ring`}>
                                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover"/>
                                                            <div className={`absolute inset-0 bg-black/50 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                                                                <div className="flex items-center justify-center h-full">
                                                                     <Check className="h-8 w-8 text-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                             </div>
                                        </ScrollArea>
                                         <Button onClick={() => setIsProductDialogOpen(false)}>Done</Button>
                                    </DialogContent>
                                </Dialog>
                                
                                <div className="flex-grow">
                                    <Label htmlFor="newImages" className="sr-only">Upload Custom Images</Label>
                                    <Input
                                        id="newImages"
                                        type="file"
                                        multiple
                                        accept="image/png, image/jpeg, image/webp"
                                        {...newImageRef}
                                    />
                                </div>
                            </div>
                            {form.formState.errors.newImages && <p className="text-sm text-destructive">{form.formState.errors.newImages.message as string}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSaving || (!form.formState.isDirty && newImagePreviews.length === 0)}>
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

