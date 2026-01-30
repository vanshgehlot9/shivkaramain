// Server-only Firebase Admin initialization for API routes
// This should only be imported in API routes

import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

let adminApp: admin.app.App | null = null;
let db: admin.firestore.Firestore | null = null;

// Initialize Firebase Admin if not already initialized
function initializeFirebaseAdmin(): admin.app.App | null {
  // Return existing app if already initialized
  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0] as admin.app.App;
    if (adminApp) {
      db = adminApp.firestore();
      console.log('✅ Firebase Admin already initialized');
    }
    return adminApp;
  }

  try {
    // Method 1: Try base64-encoded service account credentials
    if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
      try {
        console.log('🔑 Attempting to initialize Firebase Admin with FIREBASE_ADMIN_CREDENTIALS...');
        const serviceAccount = JSON.parse(
          Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS, 'base64').toString()
        );

        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
        db = adminApp.firestore();
        console.log('✅ Firebase Admin initialized successfully with service account');
        return adminApp;
      } catch (error) {
        console.error('❌ Error parsing FIREBASE_ADMIN_CREDENTIALS:', error);
      }
    }

    // Method 2: Try with service account JSON string (not base64)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        console.log('🔑 Attempting to initialize Firebase Admin with FIREBASE_SERVICE_ACCOUNT_KEY...');
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
        db = adminApp.firestore();
        console.log('✅ Firebase Admin initialized successfully with service account key');
        return adminApp;
      } catch (error) {
        console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
      }
    }

    // Method 3: Try Application Default Credentials (works in GCP environments)
    if (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      try {
        console.log('🔑 Attempting to initialize Firebase Admin with Application Default Credentials...');
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        adminApp = admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: projectId,
        });
        db = adminApp.firestore();
        console.log('✅ Firebase Admin initialized successfully with ADC');
        return adminApp;
      } catch (error) {
        console.error('❌ Application Default Credentials failed:', error);
      }
    }

    // No valid credentials found
    console.error('❌ Firebase Admin credentials not configured.');
    console.error('Please set one of the following environment variables:');
    console.error('  - FIREBASE_ADMIN_CREDENTIALS (base64-encoded service account JSON)');
    console.error('  - FIREBASE_SERVICE_ACCOUNT_KEY (service account JSON string)');
    console.error('  - Or configure Application Default Credentials');
    return null;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    return null;
  }
}

// Try to initialize (may return null)
try {
  initializeFirebaseAdmin();
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error);
}

export { db, adminApp };

