
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/products';

interface ProductsContextType {
  products: Product[];
  updateProduct: (updatedProduct: Product) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return (
    <ProductsContext.Provider value={{ products, updateProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
