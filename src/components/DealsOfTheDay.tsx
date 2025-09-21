
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
        <Carousel
            opts={{
                align: "start",
                loop: dealProducts.length > 5,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
                {dealProducts.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                        <div className="p-1">
                            <ProductCard product={product} onAddToCart={() => openDialog(product)} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
        </Carousel>
    );
}
