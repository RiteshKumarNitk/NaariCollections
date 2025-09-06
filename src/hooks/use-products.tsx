
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import initialProducts from '@/data/products.json';

interface ProductsContextType {
  products: Product[];
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Product) => void;
  removeProduct: (productId: string) => void;
  forceRerender: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [version, setVersion] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`/data/products.json?v=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
        // In case of error (e.g. 404 during build), stick with initial data
        console.warn("Could not fetch updated products.json, using initial data.", error)
        setProducts(initialProducts);
    }
  }, []);


  useEffect(() => {
    if (version > 0) {
      fetchProducts();
    }
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
    <ProductsContext.Provider value={{ products, updateProduct, addProduct, removeProduct, forceRerender }}>
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
