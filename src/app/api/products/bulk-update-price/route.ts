
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';

export async function POST(request: Request) {
  const db = await getDb();
  if (!db) {
    return NextResponse.json({ message: 'Database not initialized' }, { status: 500 });
  }

  try {
    const { amount } = await request.json();

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: 'A positive amount is required' }, { status: 400 });
    }

    const productsCollection = db.collection('products');
    const snapshot = await productsCollection.get();

    if (snapshot.empty) {
      return NextResponse.json({ message: 'No products found to update' }, { status: 404 });
    }

    // Use a batch write for atomic and efficient updates
    const batch = db.batch();
    let updatedCount = 0;

    snapshot.forEach(doc => {
      const product = doc.data();
      const currentPrice = product.price || 0;
      const newPrice = currentPrice + amount;

      batch.update(doc.ref, { price: newPrice });
      updatedCount++;
    });

    await batch.commit();

    return NextResponse.json({ 
        message: 'Product prices updated successfully',
        updatedCount 
    }, { status: 200 });

  } catch (error) {
    console.error('API Bulk Update Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to update product prices', error: message }, { status: 500 });
  }
}
