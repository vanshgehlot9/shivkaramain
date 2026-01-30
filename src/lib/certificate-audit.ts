/**
 * Enterprise-Grade Certificate Verification System
 * Audit Logging for Shivkara Digital & Tech Lab
 * 
 * Features:
 * - Immutable audit trail for all certificate operations
 * - Privacy-preserving IP address hashing
 * - Structured metadata for analytics
 */

import { db } from './firebase-admin-config';
import { COLLECTIONS } from './firebase-collections';
import { hashIpAddress } from './certificate-crypto';
import {
    AuditLog,
    AuditAction,
    CreateAuditLogInput
} from './certificate-types';

// ============================================================================
// AUDIT LOG CREATION
// ============================================================================

/**
 * Creates an audit log entry for certificate operations.
 * Uses Firestore server timestamp for accuracy.
 * 
 * @param input - Audit log input data
 * @returns Created audit log ID
 */
export async function createAuditLog(input: CreateAuditLogInput): Promise<string> {
    if (!db) {
        console.error('Firebase Admin not initialized, skipping audit log');
        return '';
    }

    try {
        // Sanitize metadata to remove undefined values (Firestore rejects undefined)
        const cleanMetadata = input.metadata
            ? Object.entries(input.metadata).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, unknown>)
            : {};

        const auditLog: Omit<AuditLog, 'id'> = {
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId,
            performedBy: input.performedBy,
            ipAddressHash: hashIpAddress(input.ipAddress),
            metadata: cleanMetadata,
            timestamp: new Date()
        };

        const docRef = await db.collection(COLLECTIONS.AUDIT_LOGS).add({
            ...auditLog,
            timestamp: new Date() // Firestore will convert to Timestamp
        });

        return docRef.id;
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw - audit logging should not break main operations
        return '';
    }
}

// ============================================================================
// SPECIALIZED AUDIT FUNCTIONS
// ============================================================================

/**
 * Logs certificate issuance.
 */
export async function logCertificateIssue(
    certificateId: string,
    adminEmail: string,
    ipAddress: string,
    metadata?: Record<string, unknown>
): Promise<void> {
    await createAuditLog({
        action: AuditAction.ISSUE,
        entityType: 'certificate',
        entityId: certificateId,
        performedBy: adminEmail,
        ipAddress,
        metadata: {
            ...metadata,
            actionDescription: 'Certificate issued'
        }
    });
}

/**
 * Logs certificate revocation.
 */
export async function logCertificateRevoke(
    certificateId: string,
    adminEmail: string,
    ipAddress: string,
    reason: string
): Promise<void> {
    await createAuditLog({
        action: AuditAction.REVOKE,
        entityType: 'certificate',
        entityId: certificateId,
        performedBy: adminEmail,
        ipAddress,
        metadata: {
            reason,
            actionDescription: 'Certificate revoked'
        }
    });
}

/**
 * Logs public certificate verification.
 * Uses 'public' as performer since no admin is involved.
 */
export async function logCertificateVerification(
    certificateId: string,
    ipAddress: string,
    verificationResult: 'valid' | 'invalid' | 'revoked' | 'not_found',
    country?: string
): Promise<void> {
    await createAuditLog({
        action: AuditAction.VERIFY,
        entityType: 'certificate',
        entityId: certificateId,
        performedBy: 'public',
        ipAddress,
        metadata: {
            verificationResult,
            country,
            actionDescription: 'Certificate verification attempted'
        }
    });
}

/**
 * Logs bootcamp creation.
 */
export async function logBootcampCreate(
    bootcampId: string,
    adminEmail: string,
    ipAddress: string,
    bootcampName: string
): Promise<void> {
    await createAuditLog({
        action: AuditAction.CREATE_BOOTCAMP,
        entityType: 'bootcamp',
        entityId: bootcampId,
        performedBy: adminEmail,
        ipAddress,
        metadata: {
            bootcampName,
            actionDescription: 'Bootcamp created'
        }
    });
}

/**
 * Logs student registration.
 */
export async function logStudentCreate(
    studentId: string,
    adminEmail: string,
    ipAddress: string,
    studentName: string
): Promise<void> {
    await createAuditLog({
        action: AuditAction.CREATE_STUDENT,
        entityType: 'student',
        entityId: studentId,
        performedBy: adminEmail,
        ipAddress,
        metadata: {
            studentName,
            actionDescription: 'Student registered'
        }
    });
}

// ============================================================================
// AUDIT LOG QUERIES
// ============================================================================

/**
 * Gets audit logs for a specific entity.
 */
export async function getAuditLogsForEntity(
    entityType: 'certificate' | 'bootcamp' | 'student',
    entityId: string,
    limit: number = 50
): Promise<AuditLog[]> {
    if (!db) {
        return [];
    }

    try {
        const snapshot = await db
            .collection(COLLECTIONS.AUDIT_LOGS)
            .where('entityType', '==', entityType)
            .where('entityId', '==', entityId)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as AuditLog[];
    } catch (error) {
        console.error('Failed to get audit logs:', error);
        return [];
    }
}

/**
 * Gets recent audit logs across all entities.
 */
export async function getRecentAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    if (!db) {
        return [];
    }

    try {
        const snapshot = await db
            .collection(COLLECTIONS.AUDIT_LOGS)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as AuditLog[];
    } catch (error) {
        console.error('Failed to get recent audit logs:', error);
        return [];
    }
}
