/**
 * Firebase Admin SDK — for server-side operations (cron, API routes)
 * 
 * Setup:
 * 1. Go to Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate new private key"
 * 3. Download the JSON file
 * 4. Set environment variable in Vercel:
 *    FIREBASE_ADMIN_SERVICE_ACCOUNT = <contents of JSON file>
 * 
 * The Admin SDK bypasses security rules and has full database access.
 */

import admin from "firebase-admin";

let adminApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App | null {
  if (adminApp) return adminApp;

  try {
    const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
    
    if (!serviceAccountJson) {
      console.warn("FIREBASE_ADMIN_SERVICE_ACCOUNT not set — Admin SDK unavailable");
      return null;
    }

    // Parse JSON, handling potential newline issues in private_key
    let serviceAccount: any;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (parseErr) {
      console.error("JSON parse error. First 100 chars:", serviceAccountJson.substring(0, 100));
      throw parseErr;
    }

    // Ensure private_key has proper newlines (Vercel may escape them)
    if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    console.log("Firebase Admin: project_id =", serviceAccount.project_id);
    console.log("Firebase Admin: client_email =", serviceAccount.client_email);

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    return adminApp;
  } catch (error) {
    console.error("Firebase Admin init error:", error);
    return null;
  }
}

export function isAdminConfigured(): boolean {
  return !!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
}

export async function getAdminFirestore() {
  const app = getFirebaseAdmin();
  if (!app) return null;
  return app.firestore();
}
