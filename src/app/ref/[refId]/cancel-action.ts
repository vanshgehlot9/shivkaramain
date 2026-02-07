"use server";

import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';

export async function cancelInvoice(invoiceId: string): Promise<{ success: boolean; error?: string }> {
    if (!invoiceId) {
        return { success: false, error: "Invoice ID is required" };
    }

    try {
        if (!db) {
            return { success: false, error: "Database not initialized" };
        }
        const invoiceRef = db.collection(COLLECTIONS.INVOICES).doc(invoiceId);
        const invoiceDoc = await invoiceRef.get();

        if (!invoiceDoc.exists) {
            return { success: false, error: "Invoice not found" };
        }

        const invoiceData = invoiceDoc.data();

        // Only cancel if still pending
        if (invoiceData?.status !== 'pending_verification') {
            return { success: false, error: "Invoice cannot be cancelled" };
        }

        await invoiceRef.update({
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            cancelReason: 'Payment session expired or abandoned'
        });

        return { success: true };
    } catch (error: any) {
        console.error("Error cancelling invoice:", error);
        return { success: false, error: error.message || "Failed to cancel invoice" };
    }
}
