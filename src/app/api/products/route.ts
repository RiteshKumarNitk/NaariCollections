
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import type { Product } from '@/lib/types';

const db = getDb();

export async function GET() {
  try {
    const productsSnapshot = await db.collection('products').orderBy('creationDate', 'desc').get();
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProductData = await request.json();
    
    const newProduct: Omit<Product, 'id'> = {
      ...newProductData,
      creationDate: new Date().toISOString(),
    };

    const docRef = await db.collection('products').add(newProduct);
    
    const createdProduct: Product = {
        id: docRef.id,
        ...newProduct
    }

    return NextResponse.json(createdProduct, { status: 201 });

  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Failed to create product', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
