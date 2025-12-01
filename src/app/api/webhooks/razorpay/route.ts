import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { sendPaymentSuccessEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const text = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not set");
            return NextResponse.json({ success: false, error: "Configuration error" }, { status: 500 });
        }

        if (!signature) {
            return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
        }

        // 1. Verify Signature
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
        shasum.update(text);
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Process Event
        const body = JSON.parse(text);
        const event = body.event;
        const payload = body.payload;

        if (event === 'payment.captured') {
            const payment = payload.payment.entity;
            const orderId = payment.order_id;
            const notes = payment.notes;
            const invoiceId = notes?.invoiceId;

            if (invoiceId && db) {
                // 3. Update Invoice Status
                const invoiceRef = db.collection(COLLECTIONS.INVOICES).doc(invoiceId);
                const invoiceDoc = await invoiceRef.get();

                if (invoiceDoc.exists) {
                    const invoiceData = invoiceDoc.data();

                    // Update Invoice
                    await invoiceRef.update({
                        status: 'paid',
                        paidDate: new Date(),
                        paidAmount: invoiceData?.total || 0, // Assuming full payment
                        paymentId: payment.id,
                        paymentMethod: payment.method,
                        updatedAt: new Date()
                    });

                    // Create Income Record (Mirroring the logic in your Invoice PUT route)
                    await db.collection(COLLECTIONS.INCOME).add({
                        date: new Date(),
                        clientName: invoiceData?.clientName || 'Unknown',
                        projectName: `Invoice ${invoiceData?.invoiceNumber}`,
                        paymentMode: 'razorpay',
                        amount: invoiceData?.total || 0,
                        invoiceId: invoiceId,
                        description: `Online Payment for invoice ${invoiceData?.invoiceNumber}`,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });

                    // Create Transaction Record
                    const lastTransactionSnapshot = await db
                        .collection(COLLECTIONS.TRANSACTIONS)
                        .orderBy('date', 'desc')
                        .limit(1)
                        .get();

                    let runningBalance = invoiceData?.total || 0;
                    if (!lastTransactionSnapshot.empty) {
                        const lastTransaction = lastTransactionSnapshot.docs[0].data();
                        runningBalance = (lastTransaction.runningBalance || 0) + (invoiceData?.total || 0);
                    }

                    await db.collection(COLLECTIONS.TRANSACTIONS).add({
                        date: new Date(),
                        type: 'income',
                        cashIn: invoiceData?.total || 0,
                        cashOut: 0,
                        runningBalance,
                        note: `Razorpay Payment: ${invoiceData?.invoiceNumber}`,
                        invoiceId: invoiceId,
                        createdAt: new Date(),
                    });

                    console.log(`Invoice ${invoiceId} marked as paid via Razorpay.`);

                    // Send Payment Success Email
                    await sendPaymentSuccessEmail(invoiceData, payment);
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error processing Razorpay webhook:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
