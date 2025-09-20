
import { getDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

const DOC_PATH = 'content/about-us';

const fallbackContent = {
  headline: 'Our Story',
  intro: "Founded on the principles of celebrating heritage and empowering the modern woman, Naari is more than just a clothing brand—it's a movement.",
  paragraph1: 'Our journey began with a simple idea: to create beautiful, high-quality ethnic wear that blends timeless traditions with contemporary style. We believe that every woman deserves to feel confident, graceful, and connected to her roots.',
  paragraph2: 'Each piece in our collection is thoughtfully designed and crafted with passion. We work with skilled artisans across the country, using age-old techniques and the finest materials to bring you garments that are not just clothes, but stories woven in thread.',
  paragraph3: 'From the bustling markets of Jaipur to the serene ghats of Varanasi, our inspiration comes from the rich tapestry of Indian culture. We invite you to be a part of our story and discover the elegance of Naari.',
  imageUrl: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/about_us_founder.jpg'
};

async function getContent() {
  const db = await getDb();
  if (!db) {
    console.error("Firestore is not initialized in API route.");
    return fallbackContent;
  }
  const docRef = db.doc(DOC_PATH);
  try {
    const doc = await docRef.get();
    if (!doc.exists) {
      // If the document doesn't exist, create it with fallback content
      await docRef.set(fallbackContent);
      return fallbackContent;
    }
    return doc.data();
  } catch (error) {
    console.error("Could not read content from Firestore:", error);
    return fallbackContent;
  }
}

async function saveContent(data: any) {
  const db = await getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  const docRef = db.doc(DOC_PATH);
  try {
    await docRef.set(data, { merge: true });
  } catch (error) {
    console.error("Could not write content to Firestore:", error);
    throw new Error("Failed to save content.");
  }
}

export async function GET() {
  try {
    const data = await getContent();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API GET Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to retrieve data';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();

    // Basic validation
    if (!updatedData.headline || !updatedData.intro || !updatedData.imageUrl) {
        return NextResponse.json({ message: 'Invalid data format: Missing required fields.' }, { status: 400 });
    }
    
    await saveContent(updatedData);
    
    return NextResponse.json(updatedData, { status: 200 });
  } catch (error) {
    console.error('API POST Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update data';
    return NextResponse.json({ message }, { status: 500 });
  }
}
