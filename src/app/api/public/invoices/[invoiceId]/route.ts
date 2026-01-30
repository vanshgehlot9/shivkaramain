import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';

export async function GET(request: NextRequest, { params }: { params: Promise<{ invoiceId: string }> }) {
    try {
        const { invoiceId } = await params;

        if (!db) {
            return NextResponse.json({ success: false, error: 'Database not initialized' }, { status: 500 });
        }

        const invoiceDoc = await db.collection(COLLECTIONS.INVOICES).doc(invoiceId).get();

        if (!invoiceDoc.exists) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }

        const data = invoiceDoc.data();

        // Sanitize data for public view (remove sensitive internal notes if any)
        const publicData = {
            id: invoiceDoc.id,
            invoiceNumber: data?.invoiceNumber,
            clientName: data?.clientName,
            date: data?.date?.toDate?.()?.toISOString() || data?.date,
            dueDate: data?.dueDate?.toDate?.()?.toISOString() || data?.dueDate,
            items: data?.items,
            subtotal: data?.subtotal,
            tax: data?.tax,
            total: data?.total,
            status: data?.status,
            // Add other necessary fields but avoid sensitive admin info
        };

        return NextResponse.json({ success: true, data: publicData });

    } catch (error: any) {
        console.error('Error fetching public invoice:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
