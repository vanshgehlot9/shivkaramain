/**
 * Students API Routes
 * GET /api/admin/students - List all students
 * POST /api/admin/students - Register a new student
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { generateUUID } from '@/lib/certificate-crypto';
import { logStudentCreate } from '@/lib/certificate-audit';
import { getIPFromRequest } from '@/lib/rate-limiter';
import {
    Student,
    CreateStudentInput,
    ApiResponse
} from '@/lib/certificate-types';

// ============================================================================
// GET - List all students
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
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '100');

        let query = db.collection(COLLECTIONS.STUDENTS).orderBy('createdAt', 'desc').limit(limit);

        const snapshot = await query.get();

        let students: Student[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                externalId: data.externalId,
                enrolledAt: data.enrolledAt?.toDate() || new Date(),
                createdAt: data.createdAt?.toDate() || new Date()
            };
        });

        // Client-side search filter (Firestore doesn't support full-text search)
        if (search) {
            const searchLower = search.toLowerCase();
            students = students.filter(s =>
                s.fullName.toLowerCase().includes(searchLower) ||
                s.email.toLowerCase().includes(searchLower)
            );
        }

        return NextResponse.json<ApiResponse<Student[]>>({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to fetch students' },
            { status: 500 }
        );
    }
}

// ============================================================================
// POST - Register a new student
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        if (!db) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const body = await request.json() as CreateStudentInput;

        // Validate required fields
        if (!body.fullName || !body.email) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Missing required fields: fullName, email' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Check for duplicate email
        const existingSnapshot = await db
            .collection(COLLECTIONS.STUDENTS)
            .where('email', '==', body.email.toLowerCase())
            .limit(1)
            .get();

        if (!existingSnapshot.empty) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'A student with this email already exists' },
                { status: 409 }
            );
        }

        const now = new Date();
        const studentId = generateUUID();

        const student: Student = {
            id: studentId,
            fullName: body.fullName,
            email: body.email.toLowerCase(),
            phone: body.phone,
            externalId: body.externalId,
            enrolledAt: now,
            createdAt: now
        };

        await db.collection(COLLECTIONS.STUDENTS).doc(studentId).set({
            ...student,
            enrolledAt: now,
            createdAt: now
        });

        // Audit log
        const ipAddress = getIPFromRequest(request);
        const adminEmail = request.headers.get('x-admin-email') || 'unknown';
        await logStudentCreate(studentId, adminEmail, ipAddress, body.fullName);

        return NextResponse.json<ApiResponse<Student>>({
            success: true,
            data: student,
            message: 'Student registered successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error registering student:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to register student' },
            { status: 500 }
        );
    }
}
