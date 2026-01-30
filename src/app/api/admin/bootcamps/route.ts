/**
 * Bootcamps API Routes
 * GET /api/admin/bootcamps - List all bootcamps
 * POST /api/admin/bootcamps - Create a new bootcamp
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { generateUUID } from '@/lib/certificate-crypto';
import { logBootcampCreate } from '@/lib/certificate-audit';
import { getIPFromRequest } from '@/lib/rate-limiter';
import {
    Bootcamp,
    BootcampStatus,
    BootcampCategory,
    CreateBootcampInput,
    ApiResponse
} from '@/lib/certificate-types';

// ============================================================================
// GET - List all bootcamps
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
        const status = searchParams.get('status') as BootcampStatus | null;
        const category = searchParams.get('category') as BootcampCategory | null;

        let query = db.collection(COLLECTIONS.BOOTCAMPS).orderBy('createdAt', 'desc');

        if (status) {
            query = query.where('status', '==', status);
        }

        if (category) {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();

        const bootcamps: Bootcamp[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                description: data.description,
                category: data.category,
                startDate: data.startDate?.toDate() || new Date(),
                endDate: data.endDate?.toDate() || new Date(),
                status: data.status,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            };
        });

        return NextResponse.json<ApiResponse<Bootcamp[]>>({
            success: true,
            data: bootcamps
        });
    } catch (error) {
        console.error('Error fetching bootcamps:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to fetch bootcamps' },
            { status: 500 }
        );
    }
}

// ============================================================================
// POST - Create a new bootcamp
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        if (!db) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const body = await request.json() as CreateBootcampInput;

        // Validate required fields
        if (!body.name || !body.description || !body.category || !body.startDate || !body.endDate) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Missing required fields: name, description, category, startDate, endDate' },
                { status: 400 }
            );
        }

        // Validate category
        if (!Object.values(BootcampCategory).includes(body.category)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: `Invalid category. Must be one of: ${Object.values(BootcampCategory).join(', ')}` },
                { status: 400 }
            );
        }

        const now = new Date();
        const bootcampId = generateUUID();

        const bootcamp: Bootcamp = {
            id: bootcampId,
            name: body.name,
            description: body.description,
            category: body.category,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            status: BootcampStatus.ACTIVE,
            createdAt: now,
            updatedAt: now
        };

        await db.collection(COLLECTIONS.BOOTCAMPS).doc(bootcampId).set({
            ...bootcamp,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            createdAt: now,
            updatedAt: now
        });

        // Audit log
        const ipAddress = getIPFromRequest(request);
        const adminEmail = request.headers.get('x-admin-email') || 'unknown';
        await logBootcampCreate(bootcampId, adminEmail, ipAddress, body.name);

        return NextResponse.json<ApiResponse<Bootcamp>>({
            success: true,
            data: bootcamp,
            message: 'Bootcamp created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating bootcamp:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to create bootcamp' },
            { status: 500 }
        );
    }
}
