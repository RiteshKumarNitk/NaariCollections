import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase admin initialization error:', error.message);
      // Provide a more helpful error message.
      throw new Error('Failed to initialize Firebase Admin SDK. The service account key is likely malformed or the environment variables are not set correctly.');
    }
  } else {
    // This provides a clear error if the required environment variables are missing.
    console.warn('Firebase Admin SDK not initialized: required environment variables are missing. Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your .env file.');
  }
}

// Export the initialized firestore database instance.
// It might be undefined if initialization failed, and downstream code should handle that.
db = admin.firestore();

export { db };
