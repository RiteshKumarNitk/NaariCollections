
import 'dotenv/config';
import { getDb } from './firebase-admin';
import productsData from '../data/products.json';
import reviewsData from '../data/reviews.json';
import homepageData from '../data/homepage.json';
import type { Product } from './types';
import type { Review } from './types';

async function seedProducts() {
   const db = await getDb();
  const productsCollection = db.collection('products');
  console.log('Seeding products...');
  for (const product of productsData) {
    // We will use the existing IDs from the JSON file if they are strings,
    // otherwise Firestore will auto-generate an ID.
    const { id, ...productData } = product as (Product & { id?: string });
    if (id && typeof id === 'string') {
       await productsCollection.doc(id).set(productData);
       console.log(`- Added product ${product.name} with explicit ID: ${id}`);
    } else {
        const docRef = await productsCollection.add(productData);
        console.log(`- Added product ${product.name} with auto-generated ID: ${docRef.id}`);
    }
  }
  console.log('Products seeded successfully!');
}

async function seedReviews() {
   const db = await getDb();
  const reviewsCollection = db.collection('reviews');
  console.log('Seeding reviews...');
  for (const review of reviewsData) {
     const { id, ...reviewData } = review as (Review & { id?: string });
     if (id && typeof id === 'string') {
        await reviewsCollection.doc(id).set(reviewData);
        console.log(`- Added review by ${review.name} with explicit ID: ${id}`);
     } else {
        const docRef = await reviewsCollection.add(reviewData);
        console.log(`- Added review by ${review.name} with auto-generated ID: ${docRef.id}`);
     }
  }
  console.log('Reviews seeded successfully!');
}

async function seedHomepage() {
   const db = await getDb();
    console.log('Seeding homepage content...');
    await db.collection('content').doc('homepage').set(homepageData);
    console.log('Homepage content seeded successfully!');
}


async function main() {
  try {
    await seedProducts();
    await seedReviews();
    await seedHomepage();
    console.log('\nDatabase seeding completed!');
    // process.exit(0) is removed to prevent the dev server from stopping
  } catch (error) {
    console.error('Error seeding database:', error);
    // process.exit(1) is removed to prevent the dev server from stopping
  }
}

main();
