
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, ShieldCheck, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProductSliders } from '@/components/ProductSliders';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-secondary/50 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10">
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
              Shop Now{' '}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <ProductSliders allProducts={products} />
      </section>

      <section className="bg-secondary/30 py-16 md:py-24 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10">
        <div className="container">
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
        </div>
      </section>
    </div>
  );
}
