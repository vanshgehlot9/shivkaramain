import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { razorpay } from '@/lib/razorpay';
import { MINIMUM_BOOKING_AMOUNT } from '@/lib/payment-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, service, amount, totalValue } = body;

        if (!name || !email || !phone || !service) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Use provided amount or fallback to minimum
        const bookingAmount = amount || MINIMUM_BOOKING_AMOUNT;

        if (!db) {
            return NextResponse.json({ success: false, error: 'Database not initialized' }, { status: 500 });
        }

        // 1. Create/Update Client (Lead)
        // Check if client exists by email
        const clientSnapshot = await db.collection(COLLECTIONS.CLIENTS).where('email', '==', email).limit(1).get();
        let clientId;
        let clientName = name;

        if (!clientSnapshot.empty) {
            clientId = clientSnapshot.docs[0].id;
        } else {
            const newClient = await db.collection(COLLECTIONS.CLIENTS).add({
                name,
                email,
                phone,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'lead'
            });
            clientId = newClient.id;
        }

        // 2. Create "Booking Invoice" (Draft -> Pending)
        // We create an invoice for the booking amount
        const invoiceData = {
            invoiceNumber: `BOOK-${Date.now().toString().slice(-6)}`, // Temporary ID
            clientId,
            clientName,
            date: new Date(),
            dueDate: new Date(), // Due immediately
            status: 'sent', // Ready to pay
            items: [{
                description: `Booking Advance for ${service} (30% of ₹${totalValue || 'Custom'})`,
                quantity: 1,
                rate: bookingAmount
            }],
            subtotal: bookingAmount,
            tax: 0, // Assuming inclusive or 0 for advance
            taxPercentage: 0,
            discount: 0,
            total: bookingAmount,
            notes: "Non-refundable booking fee.",
            terms: "Project slot secured upon payment.",
            paidAmount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: 'BOOKING_ADVANCE', // Special tag
            totalProjectValue: totalValue || 0
        };

        const invoiceRef = await db.collection(COLLECTIONS.INVOICES).add(invoiceData);

        // 3. Create Razorpay Order
        const amountInPaise = bookingAmount * 100;
        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: invoiceData.invoiceNumber,
            notes: {
                invoiceId: invoiceRef.id,
                clientId: clientId,
                type: 'BOOKING_ADVANCE',
                serviceType: service
            }
        };

        const order = await razorpay.orders.create(options);

        // 4. Update Invoice with Order ID
        await invoiceRef.update({
            razorpayOrderId: order.id,
            invoiceNumber: `INV-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-BOOK-${order.id.slice(-4)}` // Better ID
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: amountInPaise,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID,
            invoiceId: invoiceRef.id
        });

    } catch (error: any) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
