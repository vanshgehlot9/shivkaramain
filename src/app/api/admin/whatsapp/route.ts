import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Forward request to Python backend
        const pythonResponse = await fetch('http://127.0.0.1:8000/api/admin/send-whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        
        const data = await pythonResponse.json();
        
        if (!pythonResponse.ok) {
            return NextResponse.json(
                { success: false, error: data.detail || 'Failed to send WhatsApp message' },
                { status: pythonResponse.status }
            );
        }
        
        return NextResponse.json({ success: true, data });
        
    } catch (error) {
        console.error('Error forwarding to Python API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error while connecting to Python backend' },
            { status: 500 }
        );
    }
}
