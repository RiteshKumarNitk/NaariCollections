
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const pricingSchema = z.object({
  amount: z.coerce.number().int().min(1, 'Please enter a positive number.'),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

export default function BulkPricingPage() {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const form = useForm<PricingFormValues>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const onSubmit = () => {
        // This just opens the confirmation dialog
        setIsDialogOpen(true);
    };
    
    const handleBulkUpdate = async () => {
        setIsDialogOpen(false);
        setIsUpdating(true);
        const amount = form.getValues('amount');
        
        try {
            const response = await fetch('/api/products/bulk-update-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update prices.');
            }

            toast({
                title: 'Success!',
                description: `${result.updatedCount} product prices have been increased by ₹${amount}.`,
            });
            form.reset({ amount: 0 });

        } catch (error) {
            console.error("Failed to update prices", error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An unknown error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <div className="container mx-auto max-w-2xl">
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
                        <CardTitle>Bulk Price Editor</CardTitle>
                        <CardDescription>
                            Increase the price of all products by a specific amount. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount to Add (₹)</Label>
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    placeholder="e.g., 200"
                                    {...form.register('amount')} 
                                />
                                {form.formState.errors.amount && (
                                    <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Update All Prices
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-destructive" /> Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently increase the price of all products in your store by 
                        <strong className="font-bold text-foreground"> ₹{form.getValues('amount')}</strong>. 
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleBulkUpdate}
                        disabled={isUpdating}
                    >
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isUpdating ? 'Updating...' : 'Yes, update prices'}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
