
import * as admin from 'firebase-admin';

// This function checks for the required Firebase environment variables
// and returns a service account object if they exist.
function getServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // The private key needs to have its escaped newlines replaced with actual newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Firebase Admin SDK environment variables are not set. Please check your .env file for FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}


// Initialize Firebase Admin SDK only if it hasn't been initialized yet.
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();

  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error:', error.message);
      // We throw a more user-friendly error to guide them.
      throw new Error('Failed to initialize Firebase Admin SDK. The service account key is likely malformed or the environment variables are not set correctly.');
    }
  } else {
    // This case will be hit if the env vars are not set.
    // It's useful for some build environments where credentials are not needed.
    console.warn("Firebase Admin SDK is not initialized because environment variables are missing.");
  }
}

export const db = admin.apps.length > 0 ? admin.firestore() : null;
