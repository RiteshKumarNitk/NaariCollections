
import * as admin from 'firebase-admin';
import { config } from 'dotenv';

config();

function getServiceAccount(): admin.ServiceAccount | undefined {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env file. Firebase Admin SDK not initialized.");
    return undefined;
  }
  try {
    // This robustly handles a key that might be wrapped in single quotes,
    // which is a common copy-paste error.
    const sanitizedKey = key.trim().startsWith("'") && key.trim().endsWith("'")
      ? key.trim().substring(1, key.length - 1)
      : key;
    return JSON.parse(sanitizedKey);
  } catch (e) {
    console.error("CRITICAL ERROR: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's valid JSON.", e);
    return undefined;
  }
}

function initializeAdmin() {
  const serviceAccount = getServiceAccount();

  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (serviceAccount) {
    try {
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (e) {
      console.error('Firebase admin initialization error', e);
      throw new Error('Failed to initialize Firebase Admin SDK.');
    }
  } else {
    // Return a dummy object if initialization is not possible.
    // This allows the app to build but will fail at runtime if Firebase is accessed.
    console.warn("Firebase Admin SDK not initialized due to missing credentials.");
    return null;
  }
}

const firebaseAdmin = initializeAdmin();

// Export a getter function for the db instance
export const getDb = () => {
    if (!firebaseAdmin) {
        throw new Error('Firebase Admin SDK is not initialized. Check your environment variables.');
    }
    return admin.firestore();
};

// For backward compatibility or direct use
export const db = getDb();
