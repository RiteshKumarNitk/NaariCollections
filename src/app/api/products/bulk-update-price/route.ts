
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const db = await getDb();
  if (!db) {
    return NextResponse.json({ message: 'Database not initialized' }, { status: 500 });
  }

  try {
    const { amount } = await request.json();

    if (typeof amount !== 'number' || amount === 0) {
      return NextResponse.json({ message: 'A non-zero amount is required' }, { status: 400 });
    }

    const productsCollection = db.collection('products');
    const snapshot = await productsCollection.get();

    if (snapshot.empty) {
      return NextResponse.json({ message: 'No products found to update' }, { status: 404 });
    }

    const batch = db.batch();
    let updatedCount = 0;
    let adjustedCount = 0;

    snapshot.forEach(doc => {
      const product = doc.data();
      const currentPrice = product.price || 0;
      let newPrice = currentPrice + amount;

      if (newPrice < 1) {
        newPrice = 1; // Prevent price from going below 1
        adjustedCount++;
      }

      batch.update(doc.ref, { price: newPrice });
      updatedCount++;
    });

    await batch.commit();

    return NextResponse.json({ 
        message: 'Product prices updated successfully',
        updatedCount,
        adjustedCount
    }, { status: 200 });

  } catch (error) {
    console.error('API Bulk Update Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to update product prices', error: message }, { status: 500 });
  }
}
