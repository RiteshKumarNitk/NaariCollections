
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = [
  {
    name: "Sarees",
    href: "/shop?category=sarees",
    imageSrc: "https://picsum.photos/seed/saree/400/500",
    imageHint: "elegant saree"
  },
  {
    name: "Suits",
    href: "/shop?category=suits",
    imageSrc: "https://picsum.photos/seed/suits/400/500",
    imageHint: "designer suit"
  },
  {
    name: "Kurtis",
    href: "/shop?category=kurtis",
    imageSrc: "https://picsum.photos/seed/kurtis/400/500",
    imageHint: "modern kurti"
  },
  {
    name: "Dresses",
    href: "/shop?category=dresses",
    imageSrc: "https://picsum.photos/seed/dresses/400/500",
    imageHint: "ethnic dress"
  },
];

export function ShopByCategory() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Shop by Category</h2>
          <Button variant="link" asChild className="text-base">
            <Link href="/shop">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group block">
              <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={category.imageSrc}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={category.imageHint}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-headline font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
