
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <Card className="group relative w-full overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-[3/4] w-full overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={800}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint="product photo"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-card">
            <CardTitle className="text-base font-medium leading-tight tracking-normal">
              {product.name}
            </CardTitle>
          <p className="mt-2 text-lg font-semibold text-foreground">
            <span className="font-rupee">₹</span>{product.price.toLocaleString()}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
         <Button className="w-full" onClick={handleAddToCart} aria-label={`Add ${product.name} to cart`}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
         </Button>
      </CardFooter>
    </Card>
  );
}
