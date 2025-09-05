"use client"

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';

import { products } from '@/lib/products';
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

export default function ProductPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const product = products.find(p => p.id === id);
    const { addToCart } = useCart();
    
    if (!product) {
        notFound();
    }
    
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [mainImage, setMainImage] = useState(product.images[0]);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            size: selectedSize,
            code: product.code,
        });
    };

    return (
        <div className="py-10">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                   <div className="aspect-[3/4] w-full overflow-hidden rounded-lg mb-4 border">
                        <Image 
                            src={mainImage} 
                            alt={product.name}
                            width={1000}
                            height={1200}
                            className="w-full h-full object-cover"
                            data-ai-hint="product photo"
                        />
                   </div>
                   <Carousel opts={{align: 'start'}} className="w-full">
                        <CarouselContent>
                            {product.images.map((img, index) => (
                                <CarouselItem key={index} className="basis-1/3 sm:basis-1/4">
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
                        <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                            {product.sizes.map(size => (
                                <div key={size}>
                                    <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                                    <Label 
                                        htmlFor={`size-${size}`}
                                        className={`flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10`}
                                    >
                                        {size}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <Button size="lg" className="w-full" onClick={handleAddToCart}>
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
        </div>
    );
}
