
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import type { Review } from '@/lib/types';

const db = getDb();

export async function GET() {
  try {
    const reviewsSnapshot = await db.collection('reviews').orderBy('date', 'desc').get();
    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const newReviewData = await request.json();

    if (!newReviewData.productId || !newReviewData.name || !newReviewData.rating || !newReviewData.review) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newReview: Omit<Review, 'id'> = {
      ...newReviewData,
      date: new Date().toISOString(),
    };
    
    const docRef = await db.collection('reviews').add(newReview);
    
    const createdReview: Review = {
        id: docRef.id,
        ...newReview
    }

    return NextResponse.json(createdReview, { status: 201 });

  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Failed to create review', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
