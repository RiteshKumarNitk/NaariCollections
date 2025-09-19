
"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { useAddToCartDialog } from "./AddToCartDialog";

interface DealsOfTheDayProps {
    allProducts: Product[];
}

export function DealsOfTheDay({ allProducts }: DealsOfTheDayProps) {
    const { openDialog } = useAddToCartDialog();
    
    // Simple logic to select some products for the deals section
    // For a real app, this would be driven by a proper merchandising system
    const dealProducts = allProducts.filter(p => ['27H93', '27H81', '25H56', '25H57', '27H86'].includes(p.code));

    if (dealProducts.length === 0) {
        return null;
    }

    return (
        <div>
            <h2 className="text-3xl font-headline mb-6 text-center">Deals of the Day</h2>
            <p className="mt-3 mb-8 text-muted-foreground text-lg text-center">
                Don't miss out on these limited-time offers!
            </p>
             <Carousel
                opts={{
                    align: "start",
                    loop: dealProducts.length > 4,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {dealProducts.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <div className="p-1">
                                <ProductCard product={product} onAddToCart={() => openDialog(product)} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
            </Carousel>
        </div>
    );
}
