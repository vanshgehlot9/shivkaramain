/**
 * Single Student API Routes
 * GET /api/admin/students/[id] - Get student details
 * PUT /api/admin/students/[id] - Update student
 * DELETE /api/admin/students/[id] - Delete student
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import {
    Student,
    UpdateStudentInput,
    ApiResponse
} from '@/lib/certificate-types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================================================
// GET - Get student details with certificates
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
        const doc = await db.collection(COLLECTIONS.STUDENTS).doc(id).get();

        if (!doc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Student not found' },
                { status: 404 }
            );
        }

        const data = doc.data()!;
        const student: Student = {
            id: doc.id,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            externalId: data.externalId,
            enrolledAt: data.enrolledAt?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date()
        };

        // Fetch certificates for this student
        const certificatesSnapshot = await db
            .collection(COLLECTIONS.CERTIFICATES)
            .where('studentId', '==', id)
            .orderBy('issuedAt', 'desc')
            .get();

        const certificates = certificatesSnapshot.docs.map(doc => ({
            id: doc.id,
            bootcampName: doc.data().bootcampName,
            status: doc.data().status,
            issuedAt: doc.data().issuedAt?.toDate()
        }));

        return NextResponse.json<ApiResponse>({
            success: true,
            data: {
                student,
                certificates
            }
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to fetch student' },
            { status: 500 }
        );
    }
}

// ============================================================================
// PUT - Update student
// ============================================================================

export async function PUT(
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
        const doc = await db.collection(COLLECTIONS.STUDENTS).doc(id).get();

        if (!doc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Student not found' },
                { status: 404 }
            );
        }

        const body = await request.json() as UpdateStudentInput;
        const updateData: Record<string, unknown> = {};

        if (body.fullName !== undefined) updateData.fullName = body.fullName;
        if (body.email !== undefined) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(body.email)) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Invalid email format' },
                    { status: 400 }
                );
            }

            // Check for duplicate email (excluding current student)
            const existingSnapshot = await db
                .collection(COLLECTIONS.STUDENTS)
                .where('email', '==', body.email.toLowerCase())
                .get();

            const duplicate = existingSnapshot.docs.find(d => d.id !== id);
            if (duplicate) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'A student with this email already exists' },
                    { status: 409 }
                );
            }

            updateData.email = body.email.toLowerCase();
        }
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.externalId !== undefined) updateData.externalId = body.externalId;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No fields to update' },
                { status: 400 }
            );
        }

        await db.collection(COLLECTIONS.STUDENTS).doc(id).update(updateData);

        // Fetch updated document
        const updatedDoc = await db.collection(COLLECTIONS.STUDENTS).doc(id).get();
        const data = updatedDoc.data()!;

        const student: Student = {
            id: updatedDoc.id,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            externalId: data.externalId,
            enrolledAt: data.enrolledAt?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date()
        };

        return NextResponse.json<ApiResponse<Student>>({
            success: true,
            data: student,
            message: 'Student updated successfully'
        });
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to update student' },
            { status: 500 }
        );
    }
}

// ============================================================================
// DELETE - Delete student
// ============================================================================

export async function DELETE(
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
        const doc = await db.collection(COLLECTIONS.STUDENTS).doc(id).get();

        if (!doc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Student not found' },
                { status: 404 }
            );
        }

        // Check if there are certificates for this student
        const certificatesSnapshot = await db
            .collection(COLLECTIONS.CERTIFICATES)
            .where('studentId', '==', id)
            .limit(1)
            .get();

        if (!certificatesSnapshot.empty) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Cannot delete student with issued certificates. Certificates contain denormalized data that remains valid.' },
                { status: 400 }
            );
        }

        await db.collection(COLLECTIONS.STUDENTS).doc(id).delete();

        return NextResponse.json<ApiResponse>({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to delete student' },
            { status: 500 }
        );
    }
}
