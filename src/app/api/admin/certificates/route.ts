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
                updatedAt: data.updatedAt?.toDate(),
                
                // Add missing properties
                type: data.type,
                internshipId: data.internshipId,
                internshipName: data.internshipName,
                internshipCategory: data.internshipCategory,
                mentorName: data.mentorName,
                mentorTitle: data.mentorTitle,
                mentorSignature: data.mentorSignature,
                cloudinaryUrl: data.cloudinaryUrl
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
        if (!body.studentId || !body.completionDate) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Missing required fields: studentId, completionDate' },
                { status: 400 }
            );
        }
        
        if (!body.bootcampId && !body.internshipId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Must provide either bootcampId or internshipId' },
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

        let bootcamp;
        let internship;
        
        if (body.bootcampId) {
            // Fetch bootcamp
            const bootcampDoc = await db.collection(COLLECTIONS.BOOTCAMPS).doc(body.bootcampId).get();
            if (!bootcampDoc.exists) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Bootcamp not found' },
                    { status: 404 }
                );
            }
            bootcamp = bootcampDoc.data()!;
            
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
        }
        
        if (body.internshipId) {
            // we will use the data passed from the client instead of rejecting if the collection document is not found
            internship = {
                position: body.internshipName,
                category: body.internshipCategory
            };
            
            const existingSnapshot = await db
                .collection(COLLECTIONS.CERTIFICATES)
                .where('studentId', '==', body.studentId)
                .where('internshipId', '==', body.internshipId)
                .where('status', '==', CertificateStatus.VALID)
                .limit(1)
                .get();
    
            if (!existingSnapshot.empty) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'A valid certificate already exists for this student and internship' },
                    { status: 409 }
                );
            }
        }

        // Generate certificate ID, signature, and metadata
        const completionDate = new Date(body.completionDate);
        const cryptoData = createSignedCertificate({
            type: body.type,
            studentId: body.studentId,
            bootcampId: body.bootcampId,
            internshipId: body.internshipId,
            studentName: student.fullName,
            studentEmail: student.email,
            bootcampName: bootcamp?.name,
            bootcampCategory: bootcamp?.category,
            internshipName: internship?.position || 'Internship',
            internshipCategory: internship?.category || 'General',
            mentorName: body.mentorName,
            mentorTitle: body.mentorTitle,
            mentorSignature: body.mentorSignature,
            completionDate
        });

        // Generate QR code
        const qrCodeDataUrl = await generateCertificateQR(cryptoData.id);

        const now = new Date();
        const certificate: Certificate = {
            id: cryptoData.id,
            type: body.type || (body.internshipId ? 'internship' : 'bootcamp') as any,
            studentId: body.studentId,
            bootcampId: body.bootcampId,
            internshipId: body.internshipId,
            studentName: student.fullName,
            studentEmail: student.email,
            bootcampName: bootcamp?.name,
            bootcampCategory: bootcamp?.category,
            internshipName: internship?.position || 'Internship',
            internshipCategory: internship?.category || 'General',
            mentorName: body.mentorName,
            mentorTitle: body.mentorTitle,
            mentorSignature: body.mentorSignature,
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

        // Remove undefined values to prevent Firestore errors
        const cleanCertificate = Object.fromEntries(
            Object.entries(certificate).filter(([_, v]) => v !== undefined)
        );

        // Store in Firestore
        await db.collection(COLLECTIONS.CERTIFICATES).doc(cryptoData.id).set({
            ...cleanCertificate,
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
            courseName: bootcamp?.name || internship?.position || 'Internship'
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
