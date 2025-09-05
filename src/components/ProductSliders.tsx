
"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { getNewArrivals } from "@/ai/flows/category-slider-new-arrivals";
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
    
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            setIsLoading(true);
            try {
                const newArrivalsInput = {
                    productCodes: allProducts.map(p => p.code),
                    creationDates: allProducts.map(p => p.creationDate),
                    numProductsToDisplay: 8,
                };
                const { newArrivalProductCodes } = await getNewArrivals(newArrivalsInput);
                const newArrivalsSet = new Set(newArrivalProductCodes);
                const sortedArrivals = allProducts
                    .filter(p => newArrivalsSet.has(p.code))
                    .sort((a, b) => newArrivalProductCodes.indexOf(a.code) - newArrivalProductCodes.indexOf(b.code));
                setNewArrivals(sortedArrivals);
            } catch (error) {
                console.error("Failed to fetch new arrivals from AI flow, falling back to sorted dates:", error instanceof Error ? error.message : String(error));
                const fallbackArrivals = [...allProducts].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).slice(0, 8);
                setNewArrivals(fallbackArrivals);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNewArrivals();
    }, [allProducts]);
    
    const sliders = [
        { title: 'New Arrivals', products: newArrivals, loading: isLoading },
        ...categories.map(category => ({
            title: category.charAt(0).toUpperCase() + category.slice(1),
            products: allProducts.filter(p => p.category === category).slice(0, 8),
            loading: false, // Only new arrivals are loaded async
        }))
    ];

    const SliderSkeleton = () => (
         <Carousel
            opts={{
                align: "start",
            }}
            className="w-full"
        >
            <CarouselContent>
                {Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <div className="p-1">
                            <div className="space-y-3">
                                <Skeleton className="h-[300px] w-full" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );

    return (
        <div className="space-y-16">
            {sliders.map(slider => (
                 (slider.products.length > 0 || slider.loading) && (
                    <div key={slider.title}>
                        <h2 className="text-3xl font-headline mb-6 text-center">{slider.title}</h2>
                         {slider.loading ? <SliderSkeleton /> : (
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
                         )}
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
