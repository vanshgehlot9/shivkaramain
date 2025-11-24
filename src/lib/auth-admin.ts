import { adminApp } from "@/lib/firebase-admin-config";
import { NextResponse } from "next/server";

export async function verifyAuth(request: Request) {
    if (!adminApp) {
        // If admin app is not initialized, we can't verify. 
        // In development without credentials, we might skip or fail.
        // For security, we should fail if we can't verify.
        console.error("Firebase Admin not initialized. Cannot verify auth.");
        return null;
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await adminApp.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying auth token:", error);
        return null;
    }
}

export function unauthorizedResponse() {
    return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
    );
}
