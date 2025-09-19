
import { getDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

 
const fallbackContent = {
  headline: "Elegance Redefined",
  subheadline: "Discover our curated collection of exquisite women's ethnic wear.",
  heroImageUrls: []
};

async function getHomepageData() {
  const db = await getDb();
  if (!db) {
    console.error("Firestore is not initialized in API route.");
    return fallbackContent;
  }
  const homepageDocRef = db.collection('content').doc('homepage');
  try {
    const doc = await homepageDocRef.get();
    if (!doc.exists) {
      return fallbackContent;
    }
    const data = doc.data();
    return {
        ...fallbackContent, // ensure all keys exist
        ...data,
    };
  } catch (error) {
    console.error("Could not read homepage data from Firestore:", error);
    return fallbackContent;
  }
}

async function saveHomepageData(data: any) {
  const db = await getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  const homepageDocRef = db.collection('content').doc('homepage');
  try {
    // We use `set` instead of `update` to completely overwrite the document,
    // which is useful for managing the array of hero images.
    await homepageDocRef.set(data);
  } catch (error) {
    console.error("Could not write to homepage data in Firestore:", error);
    throw new Error("Failed to save homepage data.");
  }
}

export async function GET() {
  try {
    const data = await getHomepageData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API GET Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to retrieve homepage data';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();

    if (!updatedData.headline || !updatedData.subheadline) {
        return NextResponse.json({ message: 'Invalid data format: headline and subheadline are required.' }, { status: 400 });
    }
    
    // Ensure heroImageUrls is always an array
    updatedData.heroImageUrls = updatedData.heroImageUrls || [];

    await saveHomepageData(updatedData);
    
    return NextResponse.json(updatedData, { status: 200 });
  } catch (error) {
    console.error('API POST Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update homepage data';
    return NextResponse.json({ message }, { status: 500 });
  }
}
