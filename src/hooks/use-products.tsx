
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Product) => void;
  removeProduct: (productId: string) => void;
  forceRerender: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// This provider is now only used for the Admin section, not for the public-facing site.
export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?v=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
        console.error("Could not fetch products from API, using empty array.", error)
        setProducts([]);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [version, fetchProducts]);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };
  
  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const removeProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  const forceRerender = useCallback(() => {
    setVersion(v => v + 1);
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, updateProduct, addProduct, removeProduct, forceRerender }}>
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
