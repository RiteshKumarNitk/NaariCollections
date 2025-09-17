
"use client";

import { useEffect, useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { AddToCartDialog, useAddToCartDialog } from "./AddToCartDialog";
import { Skeleton } from "./ui/skeleton";

interface ProductSlidersProps {
    allProducts: Product[];
}

function Sliders({ allProducts }: ProductSlidersProps) {
    const categories: Product['category'][] = ['suits', 'sarees', 'kurtis', 'dresses'];
    const { openDialog } = useAddToCartDialog();
    
    const newArrivals = useMemo(() => {
        return [...allProducts]
            .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
            .slice(0, 8);
    }, [allProducts]);

    const sliders = [
        { title: 'New Arrivals', products: newArrivals, loading: false },
        ...categories.map(category => ({
            title: category.charAt(0).toUpperCase() + category.slice(1),
            products: allProducts.filter(p => p.category === category).slice(0, 8),
            loading: false,
        }))
    ];

    return (
        <div className="space-y-16">
            {sliders.map(slider => (
                 (slider.products.length > 0) && (
                    <div key={slider.title}>
                        <h2 className="text-3xl font-headline mb-6 text-center">{slider.title}</h2>
                         <Carousel
                            opts={{
                                align: "start",
                                loop: slider.products.length > 4,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {slider.products.map((product) => (
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
                )
            ))}
        </div>
    );
}

export function ProductSliders(props: ProductSlidersProps) {
    return (
        <AddToCartDialog>
            <Sliders {...props} />
        </AddToCartDialog>
    )
}
