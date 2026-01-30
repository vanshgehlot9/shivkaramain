import { adminApp } from "@/lib/firebase-admin-config";
import { NextResponse } from "next/server";

// Development mode: Set to true to bypass auth (ONLY for local development)
const DEV_MODE = process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true';

export async function verifyAuth(request: Request) {
    // Check if Firebase Admin is initialized
    if (!adminApp) {
        console.error("❌ Firebase Admin not initialized. Cannot verify auth.");
        console.error("   → Please check your environment variables:");
        console.error("      - FIREBASE_ADMIN_CREDENTIALS (base64-encoded service account)");
        console.error("      - FIREBASE_SERVICE_ACCOUNT_KEY (service account JSON)");
        console.error("      - FIREBASE_PROJECT_ID (for Application Default Credentials)");

        // In development mode with bypass flag, allow access
        if (DEV_MODE) {
            console.warn("⚠️  DEV MODE: Bypassing authentication (NOT FOR PRODUCTION!)");
            return { uid: 'dev-user', email: 'dev@localhost' };
        }

        return null;
    }

    // Get authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
        console.error("❌ No Authorization header found in request");
        if (DEV_MODE) {
            console.warn("⚠️  DEV MODE: Bypassing authentication");
            return { uid: 'dev-user', email: 'dev@localhost' };
        }
        return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
        console.error("❌ Authorization header does not start with 'Bearer '");
        console.error("   → Received header:", authHeader.substring(0, 50) + "...");
        return null;
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token || token.trim() === "") {
        console.error("❌ Empty token after 'Bearer ' prefix");
        return null;
    }

    try {
        console.log("🔐 Attempting to verify Firebase ID token...");
        const decodedToken = await adminApp.auth().verifyIdToken(token, true);
        console.log("✅ Token verified successfully for user:", decodedToken.uid);
        return decodedToken;
    } catch (error: any) {
        console.error("❌ Error verifying auth token:");
        console.error("   Error code:", error.code);
        console.error("   Error message:", error.message);
        console.error("   Token (first 20 chars):", token.substring(0, 20) + "...");

        // Provide specific error messages for common issues
        if (error.code === 'auth/id-token-expired') {
            console.error("   → Token has expired. User needs to refresh their session.");
        } else if (error.code === 'auth/argument-error') {
            console.error("   → Invalid token format.");
        } else if (error.code === 'auth/project-not-found' || error.code === 'auth/project-id-mismatch') {
            console.error("   → Firebase project mismatch between client and server.");
            console.error("   → Check that FIREBASE_PROJECT_ID matches NEXT_PUBLIC_FIREBASE_PROJECT_ID");
        } else if (error.code === 'auth/invalid-credential') {
            console.error("   → Invalid service account credentials.");
        }

        return null;
    }
}

export function unauthorizedResponse() {
    return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
    );
}
