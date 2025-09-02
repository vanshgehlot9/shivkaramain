import { NextRequest, NextResponse } from 'next/server';
import { paymentMonitoringService } from '@/lib/payment-monitoring-service';

// Suspend website manually
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, reason, adminId } = body;

    if (!websiteId || !reason || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields: websiteId, reason, adminId' },
        { status: 400 }
      );
    }

    await paymentMonitoringService.manualSuspendWebsite(websiteId, reason, adminId);

    return NextResponse.json({
      success: true,
      message: 'Website suspended successfully'
    });

  } catch (error) {
    console.error('Error suspending website:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to suspend website',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
