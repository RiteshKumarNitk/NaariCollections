
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';

const themedSelections = [
  {
    title: 'Festive Favorites',
    href: '/shop?category=anarkali',
    items: [
      { name: 'Anarkali Sets', href: '/shop?category=anarkali', image: 'https://picsum.photos/seed/anarkali/300/300', hint: 'anarkali suit' },
      { name: 'Elegant Sarees', href: '/shop?category=sarees', image: 'https://picsum.photos/seed/sarees/300/300', hint: 'elegant saree' },
      { name: 'Indo-Western', href: '/shop?category=indo-western', image: 'https://picsum.photos/seed/indowestern/300/300', hint: 'indo western dress' },
      { name: 'Jewellery', href: '/shop', image: 'https://picsum.photos/seed/jewellery/300/300', hint: 'ethnic jewellery' },
    ]
  },
  {
    title: 'Casual Comfort',
    href: '/shop?category=kurtis',
    items: [
      { name: 'Everyday Kurtis', href: '/shop?category=kurtis', image: 'https://picsum.photos/seed/kurtis/300/300', hint: 'casual kurti' },
      { name: 'Airy Kaftans', href: '/shop?category=kaftans', image: 'https://picsum.photos/seed/kaftan/300/300', hint: 'comfortable kaftan' },
      { name: 'Co-ord Sets', href: '/shop?category=coord-sets', image: 'https://picsum.photos/seed/coord/300/300', hint: 'stylish coord set' },
      { name: 'Cotton Suits', href: '/shop?category=suits', image: 'https://picsum.photos/seed/cottonsuit/300/300', hint: 'cotton suit' },
    ]
  },
];

export function PromotionalGrid() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {themedSelections.map((selection) => (
            <Card key={selection.title} className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <Link href={selection.href} className="group">
                  <CardTitle className="flex items-center justify-between text-xl md:text-2xl font-headline">
                    {selection.title}
                    <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {selection.items.map((item) => (
                    <Link key={item.name} href={item.href} className="group">
                      <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={item.hint}
                        />
                      </div>
                      <h4 className="text-sm font-medium text-center">{item.name}</h4>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Ad Banner */}
          <Card className="lg:col-span-1 bg-primary/20 flex flex-col items-center justify-center text-center p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
             <h3 className="text-2xl md:text-3xl font-headline font-bold text-primary-foreground">
                Discover Our<br/>Newest Collection
             </h3>
             <p className="mt-2 text-muted-foreground">
                Fresh styles, just for you.
             </p>
             <Button asChild className="mt-6">
                <Link href="/shop">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
             </Button>
          </Card>

        </div>
      </div>
    </section>
  );
}
