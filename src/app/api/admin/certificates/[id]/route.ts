/**
 * Single Certificate API Routes
 * GET /api/admin/certificates/[id] - Get certificate details with analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getAuditLogsForEntity } from '@/lib/certificate-audit';
import { ApiResponse } from '@/lib/certificate-types';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

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
            type: data.type || 'bootcamp',
            studentId: data.studentId,
            bootcampId: data.bootcampId,
            studentName: data.studentName,
            studentEmail: data.studentEmail,
            bootcampName: data.bootcampName,
            bootcampCategory: data.bootcampCategory,
            internshipId: data.internshipId,
            internshipName: data.internshipName,
            internshipCategory: data.internshipCategory,
            completionDate: data.completionDate?.toDate(),
            issuedAt: data.issuedAt?.toDate(),
            issuingAuthority: data.issuingAuthority,
            status: data.status,
            mentorName: data.mentorName,
            mentorTitle: data.mentorTitle,
            mentorSignature: data.mentorSignature,
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

// DELETE - remove a certificate document (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorizedResponse();

    try {
        if (!db) return NextResponse.json<ApiResponse>({ success: false, error: 'Database not initialized' }, { status: 500 });

        const { id } = await params;
        if (!id) return NextResponse.json<ApiResponse>({ success: false, error: 'Missing id' }, { status: 400 });

        const docRef = db.collection(COLLECTIONS.CERTIFICATES).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return NextResponse.json<ApiResponse>({ success: false, error: 'Certificate not found' }, { status: 404 });

        // Delete the certificate document
        await docRef.delete();

        // Optionally remove verification stats
        const statsRef = db.collection(COLLECTIONS.VERIFICATION_STATS).doc(id);
        const statsDoc = await statsRef.get();
        if (statsDoc.exists) await statsRef.delete();

        return NextResponse.json<ApiResponse>({ success: true, message: 'Certificate deleted' });
    } catch (error) {
        console.error('Error deleting certificate:', error);
        return NextResponse.json<ApiResponse>({ success: false, error: 'Failed to delete certificate' }, { status: 500 });
    }
}
