// src/lib/firebase-admin.ts
"use server"; // ensures this runs only in Node.js runtime

import * as admin from "firebase-admin";

let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase environment variables");
  }

  try {
    console.log("DEBUG Project ID:", projectId);
    console.log("DEBUG Client Email:", clientEmail);
    console.log("DEBUG Private Key length:", privateKey.length);

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log("✅ Firebase Admin SDK initialized successfully.");
  } catch (err: any) {
    console.error("❌ Firebase admin initialization error:", err);
    throw new Error(
      "Failed to initialize Firebase Admin SDK. Make sure this code runs only on server-side."
    );
  }
}

db = admin.firestore();

export { db };
