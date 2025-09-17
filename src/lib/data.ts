
import { unstable_noStore as noStore } from 'next/cache';
import { getDb } from './firebase-admin';
import type { Product } from './types';


// This function fetches all products from Firestore.
// It uses unstable_noStore to ensure it's re-fetched on every request,
// which is appropriate for dynamic data like a product list.
export async function getProducts(): Promise<Product[]> {
  noStore(); // ensure fresh data on each request

  try {
    const db = await getDb(); // server-only, lazy-loaded
    const snapshot = await db.collection("products").orderBy("creationDate", "desc").get();

    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }
}
