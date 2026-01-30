/**
 * Single Bootcamp API Routes
 * GET /api/admin/bootcamps/[id] - Get bootcamp details
 * PUT /api/admin/bootcamps/[id] - Update bootcamp
 * DELETE /api/admin/bootcamps/[id] - Delete bootcamp
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import {
    Bootcamp,
    BootcampStatus,
    BootcampCategory,
    UpdateBootcampInput,
    ApiResponse
} from '@/lib/certificate-types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================================================
// GET - Get bootcamp details
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
        const doc = await db.collection(COLLECTIONS.BOOTCAMPS).doc(id).get();

        if (!doc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Bootcamp not found' },
                { status: 404 }
            );
        }

        const data = doc.data()!;
        const bootcamp: Bootcamp = {
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

        return NextResponse.json<ApiResponse<Bootcamp>>({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        console.error('Error fetching bootcamp:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to fetch bootcamp' },
            { status: 500 }
        );
    }
}

// ============================================================================
// PUT - Update bootcamp
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
        const doc = await db.collection(COLLECTIONS.BOOTCAMPS).doc(id).get();

        if (!doc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Bootcamp not found' },
                { status: 404 }
            );
        }

        const body = await request.json() as UpdateBootcampInput;
        const updateData: Record<string, unknown> = {
            updatedAt: new Date()
        };

        if (body.name !== undefined) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.category !== undefined) {
            if (!Object.values(BootcampCategory).includes(body.category)) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `Invalid category` },
                    { status: 400 }
                );
            }
            updateData.category = body.category;
        }
        if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
        if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
        if (body.status !== undefined) {
            if (!Object.values(BootcampStatus).includes(body.status)) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `Invalid status` },
                    { status: 400 }
                );
            }
            updateData.status = body.status;
        }

        await db.collection(COLLECTIONS.BOOTCAMPS).doc(id).update(updateData);

        // Fetch updated document
        const updatedDoc = await db.collection(COLLECTIONS.BOOTCAMPS).doc(id).get();
        const data = updatedDoc.data()!;

        const bootcamp: Bootcamp = {
            id: updatedDoc.id,
            name: data.name,
            description: data.description,
            category: data.category,
            startDate: data.startDate?.toDate() || new Date(),
            endDate: data.endDate?.toDate() || new Date(),
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
        };

        return NextResponse.json<ApiResponse<Bootcamp>>({
            success: true,
            data: bootcamp,
            message: 'Bootcamp updated successfully'
        });
    } catch (error) {
        console.error('Error updating bootcamp:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to update bootcamp' },
            { status: 500 }
        );
    }
}

// ============================================================================
// DELETE - Delete bootcamp
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
        const doc = await db.collection(COLLECTIONS.BOOTCAMPS).doc(id).get();

        if (!doc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Bootcamp not found' },
                { status: 404 }
            );
        }

        // Check if there are certificates for this bootcamp
        const certificatesSnapshot = await db
            .collection(COLLECTIONS.CERTIFICATES)
            .where('bootcampId', '==', id)
            .limit(1)
            .get();

        if (!certificatesSnapshot.empty) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Cannot delete bootcamp with issued certificates. Set status to cancelled instead.' },
                { status: 400 }
            );
        }

        await db.collection(COLLECTIONS.BOOTCAMPS).doc(id).delete();

        return NextResponse.json<ApiResponse>({
            success: true,
            message: 'Bootcamp deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting bootcamp:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to delete bootcamp' },
            { status: 500 }
        );
    }
}
