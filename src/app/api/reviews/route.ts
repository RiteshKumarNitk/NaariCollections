
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Review } from '@/lib/types';

const reviewsFilePath = path.join(process.cwd(), 'src/data/reviews.json');

async function getReviews(): Promise<Review[]> {
  try {
    const data = await fs.readFile(reviewsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Could not read reviews file:", error);
    return [];
  }
}

async function saveReviews(reviews: Review[]) {
  try {
    const data = JSON.stringify(reviews, null, 2);
    await fs.writeFile(reviewsFilePath, data, 'utf-8');
  } catch (error) {
    console.error("Could not write to reviews file:", error);
    throw new Error("Failed to save review data.");
  }
}

export async function POST(request: Request) {
  try {
    const newReviewData = await request.json();

    if (!newReviewData.productId || !newReviewData.name || !newReviewData.rating || !newReviewData.review) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const allReviews = await getReviews();

    const newReview: Review = {
      ...newReviewData,
      id: String(allReviews.length + 1 + Math.random()),
      date: new Date().toISOString(),
    };

    const updatedReviews = [...allReviews, newReview];
    await saveReviews(updatedReviews);

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Failed to create review', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
