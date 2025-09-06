
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/lib/types';
import initialProducts from '@/data/products.json';

interface ProductsContextType {
  products: Product[];
  updateProduct: (updatedProduct: Product) => void;
  // This function will be used to signal that the data has been updated
  // and components should refetch or re-render.
  forceRerender: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [version, setVersion] = useState(0); // Add a version state

  useEffect(() => {
    // This effect will run when `version` changes, fetching the latest data.
    const fetchProducts = async () => {
      // The cache-busting query parameter ensures we get the latest version.
      const response = await fetch(`/data/products.json?v=${new Date().getTime()}`);
      const data = await response.json();
      setProducts(data);
    };
    
    // We don't want to fetch on initial load, only on subsequent updates.
    if (version > 0) {
      fetchProducts();
    }
  }, [version]);


  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    // Note: The API call is now responsible for persistence.
    // This state update provides immediate UI feedback.
  };

  const forceRerender = () => {
    setVersion(v => v + 1);
  };


  return (
    <ProductsContext.Provider value={{ products, updateProduct, forceRerender }}>
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
