/**
 * Enterprise-Grade Certificate Verification System
 * Type Definitions for Shivkara Digital & Tech Lab
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum CertificateStatus {
    VALID = 'valid',
    REVOKED = 'revoked',
    EXPIRED = 'expired'
}

export enum BootcampStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum BootcampCategory {
    DESIGN = 'design',
    DEVELOPMENT = 'development',
    DATA = 'data',
    MARKETING = 'marketing',
    BUSINESS = 'business',
    OTHER = 'other'
}

export enum AuditAction {
    ISSUE = 'ISSUE',
    REVOKE = 'REVOKE',
    VERIFY = 'VERIFY',
    UPDATE = 'UPDATE',
    CREATE_BOOTCAMP = 'CREATE_BOOTCAMP',
    UPDATE_BOOTCAMP = 'UPDATE_BOOTCAMP',
    DELETE_BOOTCAMP = 'DELETE_BOOTCAMP',
    CREATE_STUDENT = 'CREATE_STUDENT',
    UPDATE_STUDENT = 'UPDATE_STUDENT',
    DELETE_STUDENT = 'DELETE_STUDENT'
}

// ============================================================================
// BOOTCAMP TYPES
// ============================================================================

export interface Bootcamp {
    id: string;
    name: string;
    description: string;
    category: BootcampCategory;
    startDate: Date;
    endDate: Date;
    status: BootcampStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBootcampInput {
    name: string;
    description: string;
    category: BootcampCategory;
    startDate: Date;
    endDate: Date;
}

export interface UpdateBootcampInput {
    name?: string;
    description?: string;
    category?: BootcampCategory;
    startDate?: Date;
    endDate?: Date;
    status?: BootcampStatus;
}

// ============================================================================
// STUDENT TYPES
// ============================================================================

export interface Student {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    externalId?: string; // For external system integration
    enrolledAt: Date;
    createdAt: Date;
}

export interface CreateStudentInput {
    fullName: string;
    email: string;
    phone?: string;
    externalId?: string;
}

export interface UpdateStudentInput {
    fullName?: string;
    email?: string;
    phone?: string;
    externalId?: string;
}

// ============================================================================
// CERTIFICATE TYPES
// ============================================================================

export interface Certificate {
    id: string; // SHA-256 hash-based
    studentId: string;
    bootcampId: string;
    // Denormalized data for long-term validity
    studentName: string;
    studentEmail: string;
    bootcampName: string;
    bootcampCategory: BootcampCategory;
    // Certificate details
    completionDate: Date;
    issuedAt: Date;
    issuingAuthority: string;
    status: CertificateStatus;
    // Cryptographic integrity
    signature: string; // HMAC-SHA256
    signatureVersion: string;
    // Revocation info
    revokedAt?: Date;
    revocationReason?: string;
    // QR Code
    qrCodeDataUrl?: string; // Base64 data URL
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface IssueCertificateInput {
    studentId: string;
    bootcampId: string;
    completionDate: Date;
}

export interface RevokeCertificateInput {
    reason: string;
}

// Certificate payload for signing (excludes mutable fields)
export interface CertificateSigningPayload {
    id: string;
    studentId: string;
    bootcampId: string;
    studentName: string;
    bootcampName: string;
    completionDate: string; // ISO string
    issuedAt: string; // ISO string
    issuingAuthority: string;
}

// ============================================================================
// VERIFICATION TYPES
// ============================================================================

export interface VerificationResult {
    valid: boolean;
    status: CertificateStatus | 'NOT_FOUND' | 'SIGNATURE_INVALID';
    certificate?: PublicCertificateData;
    message: string;
    verifiedAt: Date;
}

// Public-facing certificate data (no sensitive info)
export interface PublicCertificateData {
    certificateId: string;
    studentName: string;
    bootcampName: string;
    bootcampCategory: BootcampCategory;
    completionDate: Date;
    issuedAt: Date;
    issuingAuthority: string;
    status: CertificateStatus;
    revokedAt?: Date;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
    id: string;
    action: AuditAction;
    entityType: 'certificate' | 'bootcamp' | 'student';
    entityId: string;
    performedBy: string; // Admin email or 'public'
    ipAddressHash: string; // SHA-256 hashed for privacy
    metadata?: Record<string, unknown>;
    timestamp: Date;
}

export interface CreateAuditLogInput {
    action: AuditAction;
    entityType: 'certificate' | 'bootcamp' | 'student';
    entityId: string;
    performedBy: string;
    ipAddress: string; // Will be hashed
    metadata?: Record<string, unknown>;
}

// ============================================================================
// VERIFICATION STATS TYPES
// ============================================================================

export interface VerificationStats {
    id: string; // Same as certificateId
    totalScans: number;
    uniqueScans: number;
    scanHistory: ScanEvent[]; // Last 100 scans
    countryBreakdown: Record<string, number>;
    lastScanAt: Date;
}

export interface ScanEvent {
    timestamp: Date;
    country?: string;
    ipHash: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ISSUING_AUTHORITY = 'Shivkara Digital';
export const SIGNATURE_VERSION = 'v1';
export const VERIFICATION_BASE_URL = process.env.NEXT_PUBLIC_VERIFICATION_URL || 'https://shivkaradigital.com/verify';
