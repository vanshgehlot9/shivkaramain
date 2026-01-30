import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { sendLeadNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        if (!db) {
            return NextResponse.json(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { name, email, company, budget, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const leadData = {
            name,
            email,
            company: company || '',
            budget: budget || '',
            message,
            status: 'new',
            source: 'website_contact',
            createdAt: new Date(),
        };

        const docRef = await db.collection(COLLECTIONS.LEADS).add(leadData);

        // Send email notification
        await sendLeadNotification(leadData);

        return NextResponse.json({
            success: true,
            data: { id: docRef.id, ...leadData },
            message: 'Message sent successfully',
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error submitting contact form:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
