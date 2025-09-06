
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

async function getProductById(productId: string) {
  try {
    const docRef = db.collection('products').doc(productId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw new Error('Failed to retrieve product data');
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ message: 'Failed to retrieve product data' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    const updatedData = await request.json();
    const productRef = db.collection('products').doc(productId);

    await productRef.update(updatedData);

    const updatedProductDoc = await productRef.get();
    const updatedProduct = { id: updatedProductDoc.id, ...updatedProductDoc.data() };

    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Failed to update product', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    await db.collection('products').doc(productId).delete();
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('API DELETE Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Failed to delete product', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
