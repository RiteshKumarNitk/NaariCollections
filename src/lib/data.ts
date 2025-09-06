
import { unstable_noStore as noStore } from 'next/cache';
import { db } from './firebase-admin';
import type { Product } from './types';

// This function fetches all products from Firestore.
// It uses unstable_noStore to ensure it's re-fetched on every request,
// which is appropriate for dynamic data like a product list.
export async function getProducts(): Promise<Product[]> {
  noStore();
  if (!db) {
    console.error("Firestore is not initialized. Cannot fetch products.");
    return [];
  }
  try {
    const productsSnapshot = await db.collection('products').orderBy('creationDate', 'desc').get();
    if (productsSnapshot.empty) {
        return [];
    }
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    // In case of an error, return an empty array to prevent the app from crashing.
    return [];
  }
}
