import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ProductSliders } from '@/components/ProductSliders';
import { products } from '@/lib/products';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-secondary/50">
        <Image
          src="https://picsum.photos/1800/1000"
          alt="Woman in elegant ethnic wear"
          data-ai-hint="elegant ethnic"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-foreground p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-md">
            Elegance Redefined
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Discover our curated collection of exquisite women&apos;s ethnic wear.
            Handcrafted with passion, designed for you.
          </p>
          <Button asChild size="lg" className="mt-8 group">
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <ProductSliders allProducts={products} />
      </section>
    </div>
  );
}
