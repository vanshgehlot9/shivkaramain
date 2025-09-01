import { NextRequest, NextResponse } from 'next/server';
import { paymentMonitoringService } from '../../../../lib/payment-monitoring-service';

// This API endpoint should be called by a cron job daily
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // You can add your admin token verification here
    const token = authHeader.split(' ')[1];
    // if (!verifyAdminToken(token)) {
    //   return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    // }

    console.log('Starting payment monitoring check...');
    
    const results = await paymentMonitoringService.checkOverduePayments();
    
    return NextResponse.json({
      success: true,
      message: 'Payment monitoring completed',
      results
    });

  } catch (error) {
    console.error('Error in payment monitoring API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Manual trigger for testing (GET request)
export async function GET(request: NextRequest) {
  try {
    // In production, this should also require admin authentication
    const results = await paymentMonitoringService.checkOverduePayments();
    
    return NextResponse.json({
      success: true,
      message: 'Manual payment monitoring completed',
      results
    });

  } catch (error) {
    console.error('Error in manual payment monitoring:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
