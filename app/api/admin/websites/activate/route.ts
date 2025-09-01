import { NextRequest, NextResponse } from 'next/server';
import { paymentMonitoringService } from '../../../../lib/payment-monitoring-service';

// Activate website manually
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, adminId } = body;

    if (!websiteId || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields: websiteId, adminId' },
        { status: 400 }
      );
    }

    await paymentMonitoringService.manualActivateWebsite(websiteId, adminId);

    return NextResponse.json({
      success: true,
      message: 'Website activated successfully'
    });

  } catch (error) {
    console.error('Error activating website:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to activate website',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
