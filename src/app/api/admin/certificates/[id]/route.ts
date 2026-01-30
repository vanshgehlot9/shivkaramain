/**
 * Single Certificate API Routes
 * GET /api/admin/certificates/[id] - Get certificate details with analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getAuditLogsForEntity } from '@/lib/certificate-audit';
import { ApiResponse } from '@/lib/certificate-types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================================================
// GET - Get certificate details with analytics
// ============================================================================

export async function GET(
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

        const data = doc.data()!;
        const certificate = {
            id: doc.id,
            studentId: data.studentId,
            bootcampId: data.bootcampId,
            studentName: data.studentName,
            studentEmail: data.studentEmail,
            bootcampName: data.bootcampName,
            bootcampCategory: data.bootcampCategory,
            completionDate: data.completionDate?.toDate(),
            issuedAt: data.issuedAt?.toDate(),
            issuingAuthority: data.issuingAuthority,
            status: data.status,
            signature: data.signature,
            signatureVersion: data.signatureVersion,
            revokedAt: data.revokedAt?.toDate(),
            revocationReason: data.revocationReason,
            qrCodeDataUrl: data.qrCodeDataUrl,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
        };

        // Fetch verification stats
        const statsDoc = await db.collection(COLLECTIONS.VERIFICATION_STATS).doc(id).get();
        const stats = statsDoc.exists ? {
            totalScans: statsDoc.data()!.totalScans || 0,
            uniqueScans: statsDoc.data()!.uniqueScans || 0,
            lastScanAt: statsDoc.data()!.lastScanAt?.toDate(),
            countryBreakdown: statsDoc.data()!.countryBreakdown || {}
        } : {
            totalScans: 0,
            uniqueScans: 0,
            lastScanAt: null,
            countryBreakdown: {}
        };

        // Fetch recent audit logs
        const auditLogs = await getAuditLogsForEntity('certificate', id, 20);

        return NextResponse.json<ApiResponse>({
            success: true,
            data: {
                certificate,
                stats,
                auditLogs
            }
        });
    } catch (error) {
        console.error('Error fetching certificate:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to fetch certificate' },
            { status: 500 }
        );
    }
}
