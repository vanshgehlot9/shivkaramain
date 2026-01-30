import { NextResponse } from 'next/server';

// Temporary in-memory storage (will reset on server restart)
// In production, use a real database (Postgres, Mongo, etc.)
let inquiries: any[] = [];

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newInquiry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...body
        };
        inquiries.unshift(newInquiry); // Add to top
        return NextResponse.json({ success: true, inquiry: newInquiry });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ inquiries });
}
