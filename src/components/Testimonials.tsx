
"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

import type { Review } from "@/lib/types";
import type { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface TestimonialsProps {
  allProducts: Product[];
}

export function Testimonials({ allProducts }: TestimonialsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);
  
  if (isLoading) {
    return (
      <div className="py-16 md:py-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Customers Say</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Real reviews from our valued customers.
            </p>
          </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length: 3}).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex flex-col h-full">
                <Skeleton className="h-8 w-8 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-5 w-24 mb-6" />
                <div className="mt-auto pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  
  if (reviews.length === 0) {
    return null;
  }

  const getProductById = (productId: string) => {
    return allProducts.find(p => p.id === productId);
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Customers Say</h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Real reviews from our valued customers.
        </p>
      </div>
       <Carousel
        opts={{
          align: "start",
          loop: reviews.length > 2,
        }}
        className="w-full max-w-5xl mx-auto px-4 md:px-0"
      >
        <CarouselContent className="-ml-4">
          {reviews.map((review) => {
            const product = getProductById(review.productId);
            return (
              <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                   <Card className="h-full flex flex-col">
                     <CardContent className="p-6 flex flex-col flex-grow">
                      <Quote className="h-8 w-8 text-primary/50 mb-4" />
                      <div className="flex-grow">
                          <p className="text-muted-foreground italic">"'{review.review}'"</p>
                      </div>
                       <div className="flex items-center gap-2 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-5 w-5", i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
                        ))}
                      </div>
                       <div className="mt-auto pt-6 border-t mt-6 flex items-center gap-4">
                          {product && (
                            <Image src={product.images[0]} alt={product.name} width={56} height={56} className="rounded-full aspect-square object-cover" />
                          )}
                          <div>
                            <p className="font-semibold">{review.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Verified Purchase &middot; {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                            </p>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0 md:-left-8" />
        <CarouselNext className="right-0 md:-right-8" />
      </Carousel>
    </section>
  );
}
