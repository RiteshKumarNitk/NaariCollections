import { getNewArrivals } from "@/ai/flows/category-slider-new-arrivals";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

interface ProductSlidersProps {
    allProducts: Product[];
}

export async function ProductSliders({ allProducts }: ProductSlidersProps) {
    const categories: Product['category'][] = ['suits', 'sarees', 'kurtis', 'dresses'];
    
    // AI-powered New Arrivals
    const newArrivalsInput = {
        productCodes: allProducts.map(p => p.code),
        creationDates: allProducts.map(p => p.creationDate),
        numProductsToDisplay: 8,
    };
    
    let newArrivals: Product[] = [];
    try {
        const { newArrivalProductCodes } = await getNewArrivals(newArrivalsInput);
        const newArrivalsSet = new Set(newArrivalProductCodes);
        newArrivals = allProducts
            .filter(p => newArrivalsSet.has(p.code))
            .sort((a, b) => newArrivalProductCodes.indexOf(a.code) - newArrivalProductCodes.indexOf(b.code));
    } catch (error) {
        console.error("Failed to fetch new arrivals from AI flow, falling back to sorted dates:", error);
        newArrivals = [...allProducts].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).slice(0, 8);
    }
    
    const sliders = [
        { title: 'New Arrivals', products: newArrivals },
        ...categories.map(category => ({
            title: category.charAt(0).toUpperCase() + category.slice(1),
            products: allProducts.filter(p => p.category === category).slice(0, 8)
        }))
    ];

    return (
        <div className="container space-y-16">
            {sliders.map(slider => (
                 slider.products.length > 0 && (
                    <div key={slider.title}>
                        <h2 className="text-3xl font-headline mb-6 text-center">{slider.title}</h2>
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {slider.products.map((product) => (
                                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                                        <div className="p-1">
                                            <ProductCard product={product} />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex" />
                            <CarouselNext className="hidden md:flex" />
                        </Carousel>
                    </div>
                )
            ))}
        </div>
    );
}
