
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
  amount: z.coerce.number().int().refine(n => n !== 0, 'Please enter a non-zero amount.'),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

export default function BulkPricingPage() {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<PricingFormValues | null>(null);
    
    const form = useForm<PricingFormValues>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const onSubmit = (data: PricingFormValues) => {
        setFormData(data);
        setIsDialogOpen(true);
    };
    
    const handleBulkUpdate = async () => {
        if (!formData) return;

        setIsDialogOpen(false);
        setIsUpdating(true);
        
        try {
            const response = await fetch('/api/products/bulk-update-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: formData.amount }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update prices.');
            }

            const action = formData.amount > 0 ? 'increased' : 'decreased';
            toast({
                title: 'Success!',
                description: `${result.updatedCount} product prices have been ${action} by ₹${Math.abs(formData.amount)}. ${result.adjustedCount > 0 ? `${result.adjustedCount} prices were adjusted to prevent falling below ₹1.` : ''}`,
            });
            form.reset({ amount: 0 });
            setFormData(null);

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
    
    const amount = form.watch('amount');
    const isIncrease = amount > 0;
    const actionText = isIncrease ? 'increase' : 'decrease';
    const absAmount = Math.abs(amount);

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
                            Increase or decrease the price of all products by a specific amount. This action cannot be undone. Use a negative number to decrease prices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount to Add or Subtract (<span className="font-rupee">₹</span>)</Label>
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    placeholder="e.g., 200 or -150"
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
                        This will permanently <strong className={`font-bold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>{actionText}</strong> the price of all products in your store by 
                        <strong className="font-bold text-foreground"> <span className="font-rupee">₹</span>{absAmount}</strong>. 
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleBulkUpdate}
                        disabled={isUpdating}
                        className={!isIncrease ? 'bg-destructive hover:bg-destructive/90' : ''}
                    >
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isUpdating ? 'Updating...' : `Yes, ${actionText} prices`}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
