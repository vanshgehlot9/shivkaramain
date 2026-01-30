/**
 * Certificates API Routes
 * GET /api/admin/certificates - List all certificates
 * POST /api/admin/certificates - Issue a new certificate
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { createSignedCertificate } from '@/lib/certificate-crypto';
import { generateCertificateQR } from '@/lib/certificate-qr';
import { logCertificateIssue } from '@/lib/certificate-audit';
import { getIPFromRequest } from '@/lib/rate-limiter';
import {
    Certificate,
    CertificateStatus,
    IssueCertificateInput,
    ApiResponse
} from '@/lib/certificate-types';

// ============================================================================
// GET - List all certificates
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        if (!db) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as CertificateStatus | null;
        const bootcampId = searchParams.get('bootcampId');
        const studentId = searchParams.get('studentId');
        const limit = parseInt(searchParams.get('limit') || '100');

        let query = db.collection(COLLECTIONS.CERTIFICATES).orderBy('issuedAt', 'desc').limit(limit);

        // Note: Firestore requires composite indexes for multiple where clauses
        // For production, create indexes in Firebase console

        const snapshot = await query.get();

        let certificates = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
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
                revokedAt: data.revokedAt?.toDate(),
                revocationReason: data.revocationReason,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate()
            };
        });

        // Client-side filtering (for demo; use indexes in production)
        if (status) {
            certificates = certificates.filter(c => c.status === status);
        }
        if (bootcampId) {
            certificates = certificates.filter(c => c.bootcampId === bootcampId);
        }
        if (studentId) {
            certificates = certificates.filter(c => c.studentId === studentId);
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            data: certificates
        });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to fetch certificates' },
            { status: 500 }
        );
    }
}

// ============================================================================
// POST - Issue a new certificate
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        if (!db) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const body = await request.json() as IssueCertificateInput;

        // Validate required fields
        if (!body.studentId || !body.bootcampId || !body.completionDate) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Missing required fields: studentId, bootcampId, completionDate' },
                { status: 400 }
            );
        }

        // Fetch student
        const studentDoc = await db.collection(COLLECTIONS.STUDENTS).doc(body.studentId).get();
        if (!studentDoc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Student not found' },
                { status: 404 }
            );
        }
        const student = studentDoc.data()!;

        // Fetch bootcamp
        const bootcampDoc = await db.collection(COLLECTIONS.BOOTCAMPS).doc(body.bootcampId).get();
        if (!bootcampDoc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Bootcamp not found' },
                { status: 404 }
            );
        }
        const bootcamp = bootcampDoc.data()!;

        // Check for existing certificate for this student-bootcamp combination
        const existingSnapshot = await db
            .collection(COLLECTIONS.CERTIFICATES)
            .where('studentId', '==', body.studentId)
            .where('bootcampId', '==', body.bootcampId)
            .where('status', '==', CertificateStatus.VALID)
            .limit(1)
            .get();

        if (!existingSnapshot.empty) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'A valid certificate already exists for this student and bootcamp' },
                { status: 409 }
            );
        }

        // Generate certificate ID, signature, and metadata
        const completionDate = new Date(body.completionDate);
        const cryptoData = createSignedCertificate({
            studentId: body.studentId,
            bootcampId: body.bootcampId,
            studentName: student.fullName,
            studentEmail: student.email,
            bootcampName: bootcamp.name,
            bootcampCategory: bootcamp.category,
            completionDate
        });

        // Generate QR code
        const qrCodeDataUrl = await generateCertificateQR(cryptoData.id);

        const now = new Date();
        const certificate: Certificate = {
            id: cryptoData.id,
            studentId: body.studentId,
            bootcampId: body.bootcampId,
            studentName: student.fullName,
            studentEmail: student.email,
            bootcampName: bootcamp.name,
            bootcampCategory: bootcamp.category,
            completionDate,
            issuedAt: cryptoData.issuedAt,
            issuingAuthority: cryptoData.issuingAuthority,
            status: CertificateStatus.VALID,
            signature: cryptoData.signature,
            signatureVersion: cryptoData.signatureVersion,
            qrCodeDataUrl,
            createdAt: now,
            updatedAt: now
        };

        // Store in Firestore
        await db.collection(COLLECTIONS.CERTIFICATES).doc(cryptoData.id).set({
            ...certificate,
            completionDate,
            issuedAt: cryptoData.issuedAt,
            createdAt: now,
            updatedAt: now
        });

        // Initialize verification stats
        await db.collection(COLLECTIONS.VERIFICATION_STATS).doc(cryptoData.id).set({
            id: cryptoData.id,
            totalScans: 0,
            uniqueScans: 0,
            scanHistory: [],
            countryBreakdown: {},
            lastScanAt: null
        });

        // Audit log
        const ipAddress = getIPFromRequest(request);
        const adminEmail = request.headers.get('x-admin-email') || 'unknown';
        await logCertificateIssue(cryptoData.id, adminEmail, ipAddress, {
            studentName: student.fullName,
            bootcampName: bootcamp.name
        });

        return NextResponse.json<ApiResponse<Certificate>>({
            success: true,
            data: certificate,
            message: 'Certificate issued successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error issuing certificate:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to issue certificate' },
            { status: 500 }
        );
    }
}
