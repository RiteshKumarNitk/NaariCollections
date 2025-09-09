// src/lib/firebase-admin.ts
import * as admin from "firebase-admin";

let db: admin.firestore.Firestore | undefined;

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      // Convert escaped \n into real newlines
      privateKey = privateKey.replace(/\\n/g, "\n");

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      db = admin.firestore();
      console.log("✅ Firebase Admin SDK initialized successfully.");
    } catch (error: any) {
      console.error("❌ Firebase admin initialization error:", error.message);
      throw new Error("Failed to initialize Firebase Admin SDK. Check FIREBASE_PRIVATE_KEY formatting.");
    }
  } else {
    console.warn(
      "⚠️ Firebase Admin SDK not initialized: Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY"
    );
  }
}

export { db };
