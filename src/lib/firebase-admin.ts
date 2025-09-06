
import * as admin from 'firebase-admin';

// Ensure the environment variable is loaded
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Please check your .env file.');
  }

  try {
    // Un-escape the newline characters in the private key
    const parsedServiceAccount = JSON.parse(serviceAccountKey);
    const privateKey = parsedServiceAccount.private_key.replace(/\\n/g, '\n');

    // Initialize the app with the corrected credentials
    admin.initializeApp({
      credential: admin.credential.cert({
        ...parsedServiceAccount,
        private_key: privateKey,
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // Provide a more helpful error message.
    throw new Error('Failed to initialize Firebase Admin SDK. The service account key is likely malformed. Please verify the JSON in your .env file.');
  }
}

export const db = admin.firestore();
