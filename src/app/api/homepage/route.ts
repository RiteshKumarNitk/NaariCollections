
import { getDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

 
const fallbackContent = {
  headline: "Elegance Redefined",
  subheadline: "Discover our curated collection of exquisite women's ethnic wear.",
  heroProductIds: []
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
    return doc.data();
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
