
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

const aboutUsSchema = z.object({
  headline: z.string().min(1, 'Headline is required.'),
  intro: z.string().min(1, 'Introduction is required.'),
  paragraph1: z.string().min(1, 'Paragraph 1 is required.'),
  paragraph2: z.string().min(1, 'Paragraph 2 is required.'),
  paragraph3: z.string().min(1, 'Paragraph 3 is required.'),
  imageUrl: z.string().url('A valid image URL is required.'),
  newImage: z.any()
    .refine((file) => !file || (file.size <= 5 * 1024 * 1024), `Max file size is 5MB.`)
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ).optional(),
});

type AboutUsFormValues = z.infer<typeof aboutUsSchema>;

export default function AboutUsContentPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<AboutUsFormValues>({
        resolver: zodResolver(aboutUsSchema),
        defaultValues: {
            headline: '',
            intro: '',
            paragraph1: '',
            paragraph2: '',
            paragraph3: '',
            imageUrl: '',
            newImage: undefined,
        },
    });

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/content/about-us');
                if (!response.ok) throw new Error("Could not load content.");
                const data = await response.json();
                form.reset(data);
                setImagePreview(data.imageUrl);
            } catch (error) {
                console.error("Failed to fetch content", error);
                toast({
                    title: 'Error',
                    description: 'Could not load page content.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [form, toast]);

    const newImageFile = form.watch('newImage');
    useEffect(() => {
        if (newImageFile) {
            const url = URL.createObjectURL(newImageFile);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [newImageFile]);

    const onSubmit = async (data: AboutUsFormValues) => {
        setIsSaving(true);
        try {
            let finalImageUrl = data.imageUrl;

            if (data.newImage) {
                const formData = new FormData();
                formData.append('files', data.newImage);
                
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }
                const uploadResult = await uploadResponse.json();
                finalImageUrl = uploadResult.urls[0];
            }
            
            const finalData = { ...data, imageUrl: finalImageUrl };
            delete finalData.newImage;

            const response = await fetch('/api/content/about-us', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) throw new Error('Failed to save content');

            toast({
                title: 'Success!',
                description: 'About Us page content has been updated.',
            });
            form.reset(finalData);
            setImagePreview(finalData.imageUrl);
        } catch (error) {
            console.error("Failed to save content", error);
            toast({
                title: 'Error',
                description: 'Could not save page content.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

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
                    <CardTitle>About Us Page Content</CardTitle>
                    <CardDescription>Update the text and image for your "About Us" page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="headline">Headline</Label>
                                    <Input id="headline" {...form.register('headline')} />
                                    {form.formState.errors.headline && <p className="text-sm text-destructive">{form.formState.errors.headline.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="intro">Intro Paragraph</Label>
                                    <Textarea id="intro" {...form.register('intro')} rows={3}/>
                                    {form.formState.errors.intro && <p className="text-sm text-destructive">{form.formState.errors.intro.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paragraph1">Paragraph 1</Label>
                                    <Textarea id="paragraph1" {...form.register('paragraph1')} rows={5}/>
                                    {form.formState.errors.paragraph1 && <p className="text-sm text-destructive">{form.formState.errors.paragraph1.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paragraph2">Paragraph 2</Label>
                                    <Textarea id="paragraph2" {...form.register('paragraph2')} rows={5}/>
                                    {form.formState.errors.paragraph2 && <p className="text-sm text-destructive">{form.formState.errors.paragraph2.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="paragraph3">Paragraph 3</Label>
                                    <Textarea id="paragraph3" {...form.register('paragraph3')} rows={5}/>
                                    {form.formState.errors.paragraph3 && <p className="text-sm text-destructive">{form.formState.errors.paragraph3.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Page Image</Label>
                                {imagePreview && (
                                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md border">
                                        <Image
                                            src={imagePreview}
                                            alt="About Us preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                  <Label htmlFor="newImage">Upload New Image</Label>
                                  <Input 
                                      id="newImage" 
                                      type="file" 
                                      accept="image/png, image/jpeg, image/webp"
                                      {...form.register("newImage")}
                                  />
                                  {form.formState.errors.newImage && <p className="text-sm text-destructive">{form.formState.errors.newImage.message as string}</p>}
                                </div>
                            </div>
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
