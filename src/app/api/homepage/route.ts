
import { db } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

async function getHomepageData() {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  const homepageDocRef = db.collection('content').doc('homepage');
  try {
    const doc = await homepageDocRef.get();
    if (!doc.exists) {
      // If the document doesn't exist, return a default structure
      return {
        headline: "Elegance Redefined",
        subheadline: "Discover our curated collection of exquisite women's ethnic wear.",
        heroProductIds: []
      };
    }
    return doc.data();
  } catch (error) {
    console.error("Could not read homepage data from Firestore:", error);
    // Return a default structure on error
    return {
      headline: "Elegance Redefined",
      subheadline: "Discover our curated collection of exquisite women's ethnic wear.",
      heroProductIds: []
    };
  }
}

async function saveHomepageData(data: any) {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  const homepageDocRef = db.collection('content').doc('homepage');
  try {
    await homepageDocRef.set(data, { merge: true });
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

    // Basic validation
    if (!updatedData.headline || !updatedData.subheadline || !Array.isArray(updatedData.heroProductIds)) {
        return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    await saveHomepageData(updatedData);
    
    return NextResponse.json(updatedData, { status: 200 });
  } catch (error) {
    console.error('API POST Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update homepage data';
    return NextResponse.json({ message }, { status: 500 });
  }
}
