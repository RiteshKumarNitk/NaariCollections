
"use server";

import type adminType from "firebase-admin";

declare global {
  var _firebaseAdmin: typeof adminType | undefined;
  var _firebaseDb: adminType.firestore.Firestore | undefined;
}

export async function getDb(): Promise<adminType.firestore.Firestore> {
  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin must only run on the server");
  }

  // Lazy-load firebase-admin
  if (!global._firebaseAdmin) {
    global._firebaseAdmin =
      (await import("firebase-admin")).default ||
      (await import("firebase-admin"));
  }

  const admin = global._firebaseAdmin;

  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase environment variables for initialization.");
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket: `${projectId}.appspot.com`,
      });
      console.log("✅ Firebase Admin initialized");
    } catch (error: any) {
        if (!/already exists/i.test(error.message)) {
            console.error('Firebase admin initialization error', error.stack);
        }
    }
  }

  if (!global._firebaseDb) {
    global._firebaseDb = admin.firestore();
  }

  return global._firebaseDb;
}
