import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

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
