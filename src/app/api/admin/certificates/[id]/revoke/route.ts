/**
 * Certificate Revocation API
 * POST /api/admin/certificates/[id]/revoke - Revoke a certificate
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { logCertificateRevoke } from '@/lib/certificate-audit';
import { getIPFromRequest } from '@/lib/rate-limiter';
import {
    CertificateStatus,
    RevokeCertificateInput,
    ApiResponse
} from '@/lib/certificate-types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================================================
// POST - Revoke a certificate
// ============================================================================

export async function POST(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    try {
        if (!db) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const { id } = await params;
        const doc = await db.collection(COLLECTIONS.CERTIFICATES).doc(id).get();

        if (!doc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Certificate not found' },
                { status: 404 }
            );
        }

        const currentData = doc.data()!;

        // Check if already revoked
        if (currentData.status === CertificateStatus.REVOKED) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Certificate is already revoked' },
                { status: 400 }
            );
        }

        const body = await request.json() as RevokeCertificateInput;

        // Validate reason
        if (!body.reason || body.reason.trim().length < 10) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Revocation reason must be at least 10 characters' },
                { status: 400 }
            );
        }

        const now = new Date();

        // Update certificate status
        await db.collection(COLLECTIONS.CERTIFICATES).doc(id).update({
            status: CertificateStatus.REVOKED,
            revokedAt: now,
            revocationReason: body.reason.trim(),
            updatedAt: now
        });

        // Audit log
        const ipAddress = getIPFromRequest(request);
        const adminEmail = request.headers.get('x-admin-email') || 'unknown';
        await logCertificateRevoke(id, adminEmail, ipAddress, body.reason.trim());

        return NextResponse.json<ApiResponse>({
            success: true,
            message: 'Certificate revoked successfully',
            data: {
                certificateId: id,
                status: CertificateStatus.REVOKED,
                revokedAt: now
            }
        });
    } catch (error) {
        console.error('Error revoking certificate:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to revoke certificate' },
            { status: 500 }
        );
    }
}
