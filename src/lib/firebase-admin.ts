
import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// The service account key might be read with extra quotes, so we clean it up before parsing.
let key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (key && key.startsWith("'") && key.endsWith("'")) {
  key = key.substring(1, key.length - 1);
}

const serviceAccount = key
  ? JSON.parse(key)
  : undefined;

if (!admin.apps.length) {
  try {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        console.warn("Firebase service account key not found. Firebase Admin SDK not initialized.");
    }
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

export const db = admin.firestore();
