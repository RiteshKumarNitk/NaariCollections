"use client"

import React, { useState, createContext, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';

interface AddToCartDialogContextType {
  openDialog: (product: Product) => void;
}

const AddToCartDialogContext = createContext<AddToCartDialogContextType | null>(null);

export function useAddToCartDialog() {
  const context = useContext(AddToCartDialogContext);
  if (!context) {
    throw new Error('useAddToCartDialog must be used within an AddToCartDialog provider');
  }
  return context;
}

export function AddToCartDialog({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  const openDialog = (product: Product) => {
    setProduct(product);
    setSelectedSize(product.sizes[0]);
  };

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size: selectedSize,
        code: product.code,
      });
      setProduct(null);
    }
  };
  
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setProduct(null);
    }
  }

  return (
    <AddToCartDialogContext.Provider value={{ openDialog }}>
      {children}
      <Dialog open={!!product} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a size</DialogTitle>
            <DialogDescription>
              Which size for the {product?.name} would you like to add?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup
              value={selectedSize || ''}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2"
            >
              {product?.sizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem
                    value={size}
                    id={`dialog-size-${size}`}
                    className="sr-only"
                    checked={selectedSize === size}
                  />
                  <Label
                    htmlFor={`dialog-size-${size}`}
                    className="flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
                <ShoppingBag className="mr-2 h-5 w-5"/> Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AddToCartDialogContext.Provider>
  );
}
