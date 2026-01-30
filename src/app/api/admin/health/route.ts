import { NextResponse } from 'next/server';
import { db, adminApp } from '@/lib/firebase-admin-config';

/**
 * Health check endpoint to diagnose Firebase Admin SDK configuration
 * This endpoint does NOT require authentication
 */
export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        checks: {
            adminAppInitialized: false,
            firestoreAvailable: false,
            authAvailable: false,
            environmentVariables: {
                FIREBASE_ADMIN_CREDENTIALS: false,
                FIREBASE_SERVICE_ACCOUNT_KEY: false,
                FIREBASE_PROJECT_ID: false,
                NEXT_PUBLIC_FIREBASE_PROJECT_ID: false,
            },
        },
        errors: [] as string[],
        projectInfo: {
            clientProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT_SET',
            serverProjectId: 'UNKNOWN',
        },
    };

    try {
        // Check if Admin App is initialized
        if (adminApp) {
            diagnostics.checks.adminAppInitialized = true;

            try {
                // Get project ID from admin app
                const projectId = adminApp.options.projectId;
                diagnostics.projectInfo.serverProjectId = projectId || 'UNKNOWN';
            } catch (error: any) {
                diagnostics.errors.push(`Failed to get project ID: ${error.message}`);
            }

            // Check if Firestore is available
            if (db) {
                diagnostics.checks.firestoreAvailable = true;
                try {
                    // Try a simple Firestore operation
                    await db.collection('_health_check').limit(1).get();
                } catch (error: any) {
                    diagnostics.errors.push(`Firestore test failed: ${error.message}`);
                }
            }

            // Check if Auth is available
            try {
                const auth = adminApp.auth();
                if (auth) {
                    diagnostics.checks.authAvailable = true;
                }
            } catch (error: any) {
                diagnostics.errors.push(`Auth initialization failed: ${error.message}`);
            }
        } else {
            diagnostics.errors.push('Firebase Admin App is not initialized');
        }

        // Check environment variables (without exposing values)
        diagnostics.checks.environmentVariables.FIREBASE_ADMIN_CREDENTIALS =
            !!process.env.FIREBASE_ADMIN_CREDENTIALS;
        diagnostics.checks.environmentVariables.FIREBASE_SERVICE_ACCOUNT_KEY =
            !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        diagnostics.checks.environmentVariables.FIREBASE_PROJECT_ID =
            !!process.env.FIREBASE_PROJECT_ID;
        diagnostics.checks.environmentVariables.NEXT_PUBLIC_FIREBASE_PROJECT_ID =
            !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        // Check for project ID mismatch
        if (diagnostics.projectInfo.clientProjectId !== 'NOT_SET' &&
            diagnostics.projectInfo.serverProjectId !== 'UNKNOWN' &&
            diagnostics.projectInfo.clientProjectId !== diagnostics.projectInfo.serverProjectId) {
            diagnostics.errors.push(
                `⚠️ PROJECT MISMATCH: Client (${diagnostics.projectInfo.clientProjectId}) !== Server (${diagnostics.projectInfo.serverProjectId})`
            );
        }

        const allChecksPass =
            diagnostics.checks.adminAppInitialized &&
            diagnostics.checks.firestoreAvailable &&
            diagnostics.checks.authAvailable &&
            diagnostics.errors.length === 0;

        return NextResponse.json({
            status: allChecksPass ? 'healthy' : 'unhealthy',
            ...diagnostics,
        }, {
            status: allChecksPass ? 200 : 503,
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            error: error.message,
            ...diagnostics,
        }, {
            status: 500,
        });
    }
}
