
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gem, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';

import { Button } from '@/components/ui/button';
import { ProductSliders } from '@/components/ProductSliders';
import { HeroSlider } from '@/components/HeroSlider';
import { Skeleton } from '@/components/ui/skeleton';

interface HomepageContent {
  headline: string;
  subheadline: string;
  heroProductIds: string[];
}

export default function Home() {
  const { products } = useProducts();
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        const response = await fetch('/api/homepage');
        if (!response.ok) {
          throw new Error('Failed to fetch homepage content');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error(error);
        // Fallback content in case of error
        setContent({
          headline: 'Elegance Redefined',
          subheadline: 'Discover our curated collection of exquisite women\'s ethnic wear. Handcrafted with passion, designed for you.',
          heroProductIds: ['1', '2', '3', '5'],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageContent();
  }, []);

  const heroImages = content?.heroProductIds
    .map(id => products.find(p => p.id === id)?.images[0])
    .filter((img): img is string => !!img) || [];

  if (isLoading || products.length === 0) {
    return (
       <>
        <Skeleton className="h-[calc(100vh-4rem)] w-full" />
        <section className="py-12 md:py-20">
           <div className="space-y-16">
              <div className="space-y-6">
                <Skeleton className="h-8 w-1/3 mx-auto" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Skeleton className="h-[350px] w-full" />
                  <Skeleton className="h-[350px] w-full" />
                  <Skeleton className="h-[350px] w-full" />
                  <Skeleton className="h-[350px] w-full" />
                </div>
              </div>
           </div>
        </section>
      </>
    )
  }

  return (
    <>
      <HeroSlider images={heroImages}>
         <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-foreground p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-md text-white">
            {content?.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">
            {content?.subheadline}
          </p>
          <Button asChild size="lg" className="mt-8 group">
            <Link href="/shop">
              Shop Now{' '}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </HeroSlider>

      <section className="py-12 md:py-20">
        <ProductSliders allProducts={products} />
      </section>

      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Choose Naari?</h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Experience the difference with our commitment to quality and style.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
              <Gem className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-semibold mb-2">Exquisite Quality</h3>
            <p className="text-muted-foreground">
              We use only the finest materials and artisanal techniques to craft each piece, ensuring longevity and a luxurious feel.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-semibold mb-2">Fast & Secure Shipping</h3>
            <p className="text-muted-foreground">
              Your new favorite outfit will be at your doorstep in no time, with tracked shipping and careful packaging.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
             <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
               <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-semibold mb-2">Guaranteed Satisfaction</h3>
            <p className="text-muted-foreground">
              We stand by our products. If you&apos;re not completely in love with your purchase, our hassle-free return policy has you covered.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
