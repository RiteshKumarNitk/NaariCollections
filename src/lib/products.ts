
import type { Product } from './types';
import productsData from '@/data/products.json';

// The initial products are now loaded from the JSON file.
// The useProducts hook will manage the state of this data in the application.
export const products: Product[] = productsData;
