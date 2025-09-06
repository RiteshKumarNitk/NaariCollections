
import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

let serviceAccount: admin.ServiceAccount | undefined;

try {
  let key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (key) {
    // This is the critical fix: It robustly handles a key that might be
    // wrapped in single quotes, which is a common copy-paste error.
    if (key.startsWith("'") && key.endsWith("'")) {
      key = key.substring(1, key.length - 1);
    }
    serviceAccount = JSON.parse(key);
  }
} catch (e) {
  console.error("CRITICAL ERROR: Could not parse the FIREBASE_SERVICE_ACCOUNT_KEY. Please ensure it's a valid JSON object in your .env file and does NOT have surrounding quotes.", e);
}


if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (e) {
      console.error('Firebase admin initialization error', e);
    }
  } else {
    console.warn("Firebase service account key not found or is invalid. Firebase Admin SDK not initialized.");
  }
}

export const db = admin.firestore();
