/**
 * Enterprise-Grade Certificate Verification System
 * Cryptographic Utilities for Shivkara Digital & Tech Lab
 * 
 * Security Features:
 * - SHA-256 hash-based certificate IDs (non-sequential, non-guessable)
 * - HMAC-SHA256 digital signatures for tamper detection
 * - Timing-safe comparison to prevent timing attacks
 * - Privacy-preserving IP address hashing
 */

import crypto from 'crypto';
import {
    Certificate,
    CertificateSigningPayload,
    ISSUING_AUTHORITY,
    SIGNATURE_VERSION
} from './certificate-types';

// ============================================================================
// SECRETS (Must be set in environment variables)
// ============================================================================

function getCertificateIdSecret(): string {
    const secret = process.env.CERTIFICATE_ID_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('CERTIFICATE_ID_SECRET must be set and at least 32 characters');
    }
    return secret;
}

function getSigningSecret(): string {
    const secret = process.env.CERTIFICATE_SIGNING_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('CERTIFICATE_SIGNING_SECRET must be set and at least 32 characters');
    }
    return secret;
}

// ============================================================================
// CERTIFICATE ID GENERATION
// ============================================================================

/**
 * Generates a unique, non-sequential certificate ID using SHA-256.
 * The ID is deterministic based on inputs, allowing regeneration if needed.
 * 
 * Format: 32-character hex string (128 bits of entropy)
 * 
 * @param studentId - Unique student identifier
 * @param bootcampId - Unique bootcamp identifier
 * @param issuedAt - Certificate issuance timestamp
 * @returns 32-character hexadecimal certificate ID
 */
export function generateCertificateId(
    studentId: string,
    bootcampId: string,
    issuedAt: Date
): string {
    const secret = getCertificateIdSecret();
    const payload = `${studentId}:${bootcampId}:${issuedAt.toISOString()}:${secret}`;

    return crypto
        .createHash('sha256')
        .update(payload)
        .digest('hex')
        .substring(0, 32)
        .toUpperCase();
}

// ============================================================================
// DIGITAL SIGNATURE
// ============================================================================

/**
 * Creates a signing payload from certificate data.
 * Only includes immutable fields that should be protected.
 */
function createSigningPayload(certificate: {
    id: string;
    studentId: string;
    bootcampId: string;
    studentName: string;
    bootcampName: string;
    completionDate: Date;
    issuedAt: Date;
    issuingAuthority: string;
}): CertificateSigningPayload {
    return {
        id: certificate.id,
        studentId: certificate.studentId,
        bootcampId: certificate.bootcampId,
        studentName: certificate.studentName,
        bootcampName: certificate.bootcampName,
        completionDate: certificate.completionDate.toISOString(),
        issuedAt: certificate.issuedAt.toISOString(),
        issuingAuthority: certificate.issuingAuthority
    };
}

/**
 * Signs a certificate using HMAC-SHA256.
 * The signature covers all immutable certificate fields.
 * 
 * @param certificate - Certificate data to sign
 * @returns 64-character hexadecimal signature
 */
export function signCertificate(certificate: {
    id: string;
    studentId: string;
    bootcampId: string;
    studentName: string;
    bootcampName: string;
    completionDate: Date;
    issuedAt: Date;
    issuingAuthority: string;
}): string {
    const secret = getSigningSecret();
    const payload = createSigningPayload(certificate);
    const payloadString = JSON.stringify(payload, Object.keys(payload).sort());

    return crypto
        .createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex');
}

/**
 * Verifies a certificate's digital signature.
 * Uses timing-safe comparison to prevent timing attacks.
 * 
 * @param certificate - Certificate with signature to verify
 * @returns true if signature is valid, false otherwise
 */
export function verifySignature(certificate: Certificate): boolean {
    try {
        const expectedSignature = signCertificate({
            id: certificate.id,
            studentId: certificate.studentId,
            bootcampId: certificate.bootcampId,
            studentName: certificate.studentName,
            bootcampName: certificate.bootcampName,
            completionDate: certificate.completionDate,
            issuedAt: certificate.issuedAt,
            issuingAuthority: certificate.issuingAuthority
        });

        // Use timing-safe comparison to prevent timing attacks
        const signatureBuffer = Buffer.from(certificate.signature, 'hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');

        if (signatureBuffer.length !== expectedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

// ============================================================================
// PRIVACY UTILITIES
// ============================================================================

/**
 * Hashes an IP address for privacy-preserving audit logging.
 * Uses SHA-256 with a daily salt to prevent correlation across days.
 * 
 * @param ipAddress - Raw IP address
 * @returns 16-character hexadecimal hash
 */
export function hashIpAddress(ipAddress: string): string {
    const dailySalt = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const secret = getCertificateIdSecret();

    return crypto
        .createHash('sha256')
        .update(`${ipAddress}:${dailySalt}:${secret}`)
        .digest('hex')
        .substring(0, 16);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a random UUID v4 for entity IDs.
 */
export function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * Validates that a certificate ID has the correct format.
 * Format: 32-character uppercase hexadecimal
 */
export function isValidCertificateId(id: string): boolean {
    return /^[A-F0-9]{32}$/.test(id);
}

/**
 * Generates the verification URL for a certificate.
 */
export function getVerificationUrl(certificateId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shivkaradigital.com';
    return `${baseUrl}/verify/${certificateId}`;
}

// ============================================================================
// CERTIFICATE CREATION HELPER
// ============================================================================

/**
 * Creates a complete certificate object with ID and signature.
 * This is the main function to use when issuing a new certificate.
 */
export function createSignedCertificate(params: {
    studentId: string;
    bootcampId: string;
    studentName: string;
    studentEmail: string;
    bootcampName: string;
    bootcampCategory: string;
    completionDate: Date;
}): {
    id: string;
    signature: string;
    signatureVersion: string;
    issuingAuthority: string;
    issuedAt: Date;
} {
    const issuedAt = new Date();

    const id = generateCertificateId(
        params.studentId,
        params.bootcampId,
        issuedAt
    );

    const signature = signCertificate({
        id,
        studentId: params.studentId,
        bootcampId: params.bootcampId,
        studentName: params.studentName,
        bootcampName: params.bootcampName,
        completionDate: params.completionDate,
        issuedAt,
        issuingAuthority: ISSUING_AUTHORITY
    });

    return {
        id,
        signature,
        signatureVersion: SIGNATURE_VERSION,
        issuingAuthority: ISSUING_AUTHORITY,
        issuedAt
    };
}
