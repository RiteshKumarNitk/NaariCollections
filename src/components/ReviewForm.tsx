
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const reviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  rating: z.number().min(1, 'Please select a rating.'),
  review: z.string().min(10, 'Review must be at least 10 characters.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: '',
      rating: 0,
      review: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    const payload = { ...data, productId };
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        toast({
            title: 'Review Submitted!',
            description: 'Thank you for your feedback.',
        });
        form.reset();
        setRating(0);

    } catch (error) {
        console.error(error);
        toast({
            title: 'Error',
            description: 'Could not submit your review. Please try again.',
            variant: 'destructive',
        });
    }
  };
  
  const handleSetRating = (rate: number) => {
    setRating(rate);
    form.setValue('rating', rate, { shouldValidate: true });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Share your thoughts about this product with other customers.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Your Rating</label>
                    <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                        key={star}
                        className={cn(
                            'h-6 w-6 cursor-pointer',
                            (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                        )}
                        onClick={() => handleSetRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                    </div>
                    {form.formState.errors.rating && <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>}
                </div>
                <div className="space-y-2">
                    <Input {...form.register('name')} placeholder="Your Name" />
                    {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Textarea {...form.register('review')} placeholder="Your Review" rows={4} />
                    {form.formState.errors.review && <p className="text-sm text-destructive">{form.formState.errors.review.message}</p>}
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </form>
        </CardContent>
    </Card>
  );
}
