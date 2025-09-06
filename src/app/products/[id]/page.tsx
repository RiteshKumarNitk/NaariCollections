
"use client"

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ReviewForm } from '@/components/ReviewForm';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage() {
    const params = useParams();
    const { addToCart } = useCart();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    useEffect(() => {
      if (!id) return;

      const fetchProduct = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            throw new Error('Product not found');
          }
          const data: Product = await res.json();
          setProduct(data);
          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0]);
          }
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
        } catch (err) {
          setProduct(null);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }, [id]);


    if (loading) {
        return (
             <div className="py-10">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
                        <div className="grid grid-cols-4 gap-2">
                            <Skeleton className="aspect-square w-full rounded-md" />
                            <Skeleton className="aspect-square w-full rounded-md" />
                            <Skeleton className="aspect-square w-full rounded-md" />
                            <Skeleton className="aspect-square w-full rounded-md" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-8 w-1/4" />
                        <Separator />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-1/4" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-16" />
                                <Skeleton className="h-10 w-16" />
                                <Skeleton className="h-10 w-16" />
                            </div>
                        </div>
                         <Skeleton className="h-12 w-full" />
                         <div className="space-y-2 pt-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                         </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!product) {
        notFound();
    }
    
    const handleAddToCart = () => {
        if (selectedSize) {
            addToCart({
                id: product.id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                size: selectedSize,
                code: product.code,
            });
        }
    };
    
    return (
        <div className="py-10">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                   <div className="aspect-[3/4] w-full overflow-hidden rounded-lg mb-4 border">
                        <Image 
                            src={mainImage} 
                            alt={product.name}
                            width={800}
                            height={1200}
                            className="w-full h-full object-cover"
                            data-ai-hint="product photo"
                            priority
                        />
                   </div>
                   <Carousel opts={{align: 'start'}} className="w-full max-w-full">
                        <CarouselContent className="-ml-2">
                            {product.images.map((img, index) => (
                                <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 pl-2">
                                     <div 
                                        onClick={() => setMainImage(img)}
                                        className={`aspect-square w-full overflow-hidden rounded-md border cursor-pointer ${mainImage === img ? 'border-primary ring-2 ring-primary' : ''}`}
                                     >
                                        <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} width={200} height={200} className="w-full h-full object-cover" data-ai-hint="product photo"/>
                                     </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                   </Carousel>
                </div>

                <div className="space-y-6">
                    <h1 className="text-3xl lg:text-4xl font-headline font-bold">{product.name}</h1>
                    <p className="text-3xl font-semibold text-foreground">₹{product.price.toLocaleString()}</p>
                    
                    <Separator />
                    
                    <div>
                        <h3 className="text-lg font-medium mb-2">Select Size</h3>
                        <RadioGroup value={selectedSize || ''} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                            {product.sizes.map(size => (
                                <div key={size}>
                                    <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                                    <Label 
                                        htmlFor={`size-${size}`}
                                        className={`flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer ${selectedSize === size ? 'border-primary bg-primary/10' : ''}`}
                                    >
                                        {size}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!selectedSize}>
                       <ShoppingBag className="mr-2 h-5 w-5"/> Add to Cart
                    </Button>

                    <div className="text-sm text-muted-foreground space-y-4 pt-4">
                        <p>{product.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <p><strong className="font-medium text-foreground">Fabric:</strong> {product.fabric}</p>
                            <p><strong className="font-medium text-foreground">Product Code:</strong> {product.code}</p>
                             <p><strong className="font-medium text-foreground">Category:</strong> <span className="capitalize">{product.category}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="my-12" />
            <ReviewForm productId={product.id} />
        </div>
    );
}
