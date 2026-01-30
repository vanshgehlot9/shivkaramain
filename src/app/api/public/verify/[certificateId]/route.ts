/**
 * Public Certificate Verification API
 * GET /api/public/verify/[certificateId] - Verify a certificate
 * 
 * This is the CRITICAL public-facing endpoint that validates certificates.
 * It is rate-limited and logs all verification attempts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { verifySignature, isValidCertificateId, hashIpAddress } from '@/lib/certificate-crypto';
import { logCertificateVerification } from '@/lib/certificate-audit';
import {
    checkRateLimitByIP,
    getIPFromRequest,
    createRateLimitHeaders,
    STRICT_RATE_LIMIT
} from '@/lib/rate-limiter';
import {
    Certificate,
    CertificateStatus,
    VerificationResult,
    PublicCertificateData
} from '@/lib/certificate-types';

interface RouteParams {
    params: Promise<{ certificateId: string }>;
}

// ============================================================================
// GET - Public certificate verification
// ============================================================================

export async function GET(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    const ipAddress = getIPFromRequest(request);
    const { certificateId } = await params;

    // Rate limiting
    const rateLimitResult = checkRateLimitByIP(ipAddress, STRICT_RATE_LIMIT);
    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.allowed) {
        return NextResponse.json<VerificationResult>(
            {
                valid: false,
                status: 'NOT_FOUND',
                message: 'Too many verification requests. Please try again later.',
                verifiedAt: new Date()
            },
            {
                status: 429,
                headers: rateLimitHeaders
            }
        );
    }

    try {
        // Validate certificate ID format
        if (!isValidCertificateId(certificateId)) {
            await logCertificateVerification(certificateId, ipAddress, 'not_found');

            return NextResponse.json<VerificationResult>(
                {
                    valid: false,
                    status: 'NOT_FOUND',
                    message: 'Invalid certificate identifier format.',
                    verifiedAt: new Date()
                },
                { status: 404, headers: rateLimitHeaders }
            );
        }

        if (!db) {
            return NextResponse.json<VerificationResult>(
                {
                    valid: false,
                    status: 'NOT_FOUND',
                    message: 'Verification service temporarily unavailable.',
                    verifiedAt: new Date()
                },
                { status: 503, headers: rateLimitHeaders }
            );
        }

        // Fetch certificate
        const doc = await db.collection(COLLECTIONS.CERTIFICATES).doc(certificateId).get();

        if (!doc.exists) {
            await logCertificateVerification(certificateId, ipAddress, 'not_found');

            return NextResponse.json<VerificationResult>(
                {
                    valid: false,
                    status: 'NOT_FOUND',
                    message: 'No certificate found with this identifier. The certificate may not exist or may have been issued by a different authority.',
                    verifiedAt: new Date()
                },
                { status: 404, headers: rateLimitHeaders }
            );
        }

        const data = doc.data()!;

        // Reconstruct certificate for signature verification
        const certificate: Certificate = {
            id: doc.id,
            studentId: data.studentId,
            bootcampId: data.bootcampId,
            studentName: data.studentName,
            studentEmail: data.studentEmail,
            bootcampName: data.bootcampName,
            bootcampCategory: data.bootcampCategory,
            completionDate: data.completionDate?.toDate() || new Date(),
            issuedAt: data.issuedAt?.toDate() || new Date(),
            issuingAuthority: data.issuingAuthority,
            status: data.status,
            signature: data.signature,
            signatureVersion: data.signatureVersion,
            revokedAt: data.revokedAt?.toDate(),
            revocationReason: data.revocationReason,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
        };

        // Verify cryptographic signature
        const signatureValid = verifySignature(certificate);

        if (!signatureValid) {
            await logCertificateVerification(certificateId, ipAddress, 'invalid');

            return NextResponse.json<VerificationResult>(
                {
                    valid: false,
                    status: 'SIGNATURE_INVALID',
                    message: 'Certificate integrity check failed. This certificate may have been tampered with.',
                    verifiedAt: new Date()
                },
                { status: 400, headers: rateLimitHeaders }
            );
        }

        // Check status
        if (certificate.status === CertificateStatus.REVOKED) {
            await logCertificateVerification(certificateId, ipAddress, 'revoked');

            const publicData: PublicCertificateData = {
                certificateId: certificate.id,
                studentName: certificate.studentName,
                bootcampName: certificate.bootcampName,
                bootcampCategory: certificate.bootcampCategory,
                completionDate: certificate.completionDate,
                issuedAt: certificate.issuedAt,
                issuingAuthority: certificate.issuingAuthority,
                status: CertificateStatus.REVOKED,
                revokedAt: certificate.revokedAt
            };

            return NextResponse.json<VerificationResult>(
                {
                    valid: false,
                    status: CertificateStatus.REVOKED,
                    certificate: publicData,
                    message: 'This certificate has been revoked by the issuing authority.',
                    verifiedAt: new Date()
                },
                { status: 200, headers: rateLimitHeaders }
            );
        }

        // Certificate is valid!
        await logCertificateVerification(certificateId, ipAddress, 'valid');

        // Update verification stats
        await updateVerificationStats(certificateId, ipAddress);

        const publicData: PublicCertificateData = {
            certificateId: certificate.id,
            studentName: certificate.studentName,
            bootcampName: certificate.bootcampName,
            bootcampCategory: certificate.bootcampCategory,
            completionDate: certificate.completionDate,
            issuedAt: certificate.issuedAt,
            issuingAuthority: certificate.issuingAuthority,
            status: CertificateStatus.VALID
        };

        return NextResponse.json<VerificationResult>(
            {
                valid: true,
                status: CertificateStatus.VALID,
                certificate: publicData,
                message: 'This certificate is valid and was issued by Shivkara Digital.',
                verifiedAt: new Date()
            },
            { status: 200, headers: rateLimitHeaders }
        );
    } catch (error) {
        console.error('Verification error:', error);

        return NextResponse.json<VerificationResult>(
            {
                valid: false,
                status: 'NOT_FOUND',
                message: 'An error occurred during verification. Please try again.',
                verifiedAt: new Date()
            },
            { status: 500, headers: rateLimitHeaders }
        );
    }
}

// ============================================================================
// Helper: Update verification stats
// ============================================================================

async function updateVerificationStats(
    certificateId: string,
    ipAddress: string
): Promise<void> {
    if (!db) return;

    try {
        const statsRef = db.collection(COLLECTIONS.VERIFICATION_STATS).doc(certificateId);
        const statsDoc = await statsRef.get();
        const ipHash = hashIpAddress(ipAddress);
        const now = new Date();

        if (!statsDoc.exists) {
            // Create new stats document
            await statsRef.set({
                id: certificateId,
                totalScans: 1,
                uniqueScans: 1,
                scanHistory: [{
                    timestamp: now,
                    ipHash
                }],
                countryBreakdown: {},
                lastScanAt: now
            });
        } else {
            const data = statsDoc.data()!;
            const scanHistory = data.scanHistory || [];

            // Check if this is a unique scan (IP not seen in last 24 hours)
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const recentScansFromIP = scanHistory.filter((scan: { ipHash: string; timestamp: Date | { toDate?: () => Date } }) => {
                const scanTime = typeof scan.timestamp === 'object' && 'toDate' in scan.timestamp && scan.timestamp.toDate
                    ? scan.timestamp.toDate()
                    : new Date(scan.timestamp as unknown as string);
                return scan.ipHash === ipHash && scanTime >= twentyFourHoursAgo;
            });

            const isUnique = recentScansFromIP.length === 0;

            // Keep only last 100 scans in history
            const newHistory = [
                ...scanHistory.slice(-99),
                { timestamp: now, ipHash }
            ];

            await statsRef.update({
                totalScans: (data.totalScans || 0) + 1,
                uniqueScans: (data.uniqueScans || 0) + (isUnique ? 1 : 0),
                scanHistory: newHistory,
                lastScanAt: now
            });
        }
    } catch (error) {
        // Don't fail verification if stats update fails
        console.error('Failed to update verification stats:', error);
    }
}
