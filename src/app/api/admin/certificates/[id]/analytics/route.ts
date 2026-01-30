/**
 * Certificate Analytics API
 * GET /api/admin/certificates/[id]/analytics - Get detailed verification analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { ApiResponse } from '@/lib/certificate-types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================================================
// GET - Get detailed verification analytics
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

        // Check if certificate exists
        const certDoc = await db.collection(COLLECTIONS.CERTIFICATES).doc(id).get();
        if (!certDoc.exists) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Certificate not found' },
                { status: 404 }
            );
        }

        // Fetch verification stats
        const statsDoc = await db.collection(COLLECTIONS.VERIFICATION_STATS).doc(id).get();

        if (!statsDoc.exists) {
            return NextResponse.json<ApiResponse>({
                success: true,
                data: {
                    certificateId: id,
                    totalScans: 0,
                    uniqueScans: 0,
                    lastScanAt: null,
                    countryBreakdown: {},
                    recentScans: []
                }
            });
        }

        const stats = statsDoc.data()!;

        // Process scan history for recent scans (last 20)
        const scanHistory = stats.scanHistory || [];
        const recentScans = scanHistory
            .slice(-20)
            .reverse()
            .map((scan: { timestamp: { toDate?: () => Date }; country?: string }) => ({
                timestamp: scan.timestamp?.toDate?.() || scan.timestamp,
                country: scan.country || 'Unknown'
            }));

        // Calculate daily scan counts for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyCounts: Record<string, number> = {};
        for (const scan of scanHistory) {
            const scanDate = scan.timestamp?.toDate?.() || new Date(scan.timestamp);
            if (scanDate >= thirtyDaysAgo) {
                const dateKey = scanDate.toISOString().split('T')[0];
                dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
            }
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            data: {
                certificateId: id,
                totalScans: stats.totalScans || 0,
                uniqueScans: stats.uniqueScans || 0,
                lastScanAt: stats.lastScanAt?.toDate?.() || stats.lastScanAt || null,
                countryBreakdown: stats.countryBreakdown || {},
                recentScans,
                dailyCounts
            }
        });
    } catch (error) {
        console.error('Error fetching certificate analytics:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
