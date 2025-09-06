
import * as admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Please check your .env file and Next.js configuration.');
  }
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    throw new Error('Failed to initialize Firebase Admin SDK. The service account key is likely malformed. Please verify the JSON in your .env file.');
  }
}

export const db = admin.firestore();
