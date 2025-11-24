import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

// GET - Fetch all leads
export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth) {
        return unauthorizedResponse();
    }

    try {
        if (!db) {
            return NextResponse.json(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const snapshot = await db.collection(COLLECTIONS.LEADS).orderBy('createdAt', 'desc').get();
        const leads = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({
            success: true,
            data: leads,
        });
    } catch (error: any) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new lead
export async function POST(request: NextRequest) {
    // Note: Public endpoint for lead submission, no auth required for creation
    // But we might want to rate limit or add captcha verification here

    try {
        if (!db) {
            return NextResponse.json(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { name, email, phone } = body;

        if (!name || !email || !phone) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const leadData = {
            name,
            email,
            phone,
            status: 'new',
            createdAt: new Date(),
        };

        const docRef = await db.collection(COLLECTIONS.LEADS).add(leadData);

        return NextResponse.json({
            success: true,
            data: { id: docRef.id, ...leadData },
            message: 'Lead submitted successfully',
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
