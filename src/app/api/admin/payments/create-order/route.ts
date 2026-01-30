import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';
import { sendOrderNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
    // 1. Verify Admin Auth (Optional: You might want to allow public access if it's client-facing, 
    // but usually order creation is protected or tied to a valid invoice ID)
    // For now, let's assume this is called by the frontend when the user clicks "Pay Now"
    // and we validate the invoice ID.

    try {
        const body = await request.json();
        const { invoiceId } = body;

        if (!invoiceId) {
            return NextResponse.json({ success: false, error: 'Invoice ID is required' }, { status: 400 });
        }

        if (!db) {
            return NextResponse.json({ success: false, error: 'Database not initialized' }, { status: 500 });
        }

        // 2. Fetch Invoice Details
        const invoiceDoc = await db.collection(COLLECTIONS.INVOICES).doc(invoiceId).get();
        if (!invoiceDoc.exists) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }

        const invoiceData = invoiceDoc.data();
        if (!invoiceData) {
            return NextResponse.json({ success: false, error: 'Invoice data is empty' }, { status: 404 });
        }

        // 3. Create Razorpay Order
        // Amount must be in smallest currency unit (paise for INR)
        const amountInPaise = Math.round(invoiceData.total * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: invoiceData.invoiceNumber,
            notes: {
                invoiceId: invoiceId,
                clientId: invoiceData.clientId
            }
        };

        const order = await razorpay.orders.create(options);

        // 4. Save Order ID to Invoice (Optional but good for tracking)
        await db.collection(COLLECTIONS.INVOICES).doc(invoiceId).update({
            razorpayOrderId: order.id,
            updatedAt: new Date()
        });

        // 5. Send Order Notification Email
        await sendOrderNotification(invoiceData);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: amountInPaise,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
