import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '../../../../lib/subscription-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Get subscription for domain
    const subscription = await SubscriptionService.getSubscriptionByDomain(domain);

    if (!subscription) {
      return NextResponse.json({
        isValid: false,
        reason: 'no_subscription',
        message: 'No subscription found for this domain'
      });
    }

    // Check if subscription is valid
    const isValid = SubscriptionService.isSubscriptionValid(subscription);
    
    if (isValid) {
      return NextResponse.json({
        isValid: true,
        subscription: {
          status: subscription.status,
          endDate: subscription.endDate,
          services: subscription.services,
          plan: subscription.plan
        }
      });
    }

    // Determine the reason for invalid subscription
    let reason = 'unknown';
    let message = 'Subscription is not valid';

    if (subscription.status === 'EXPIRED') {
      const now = new Date();
      const endDate = subscription.endDate instanceof Date 
        ? subscription.endDate 
        : subscription.endDate.toDate();
      
      if (subscription.graceEndsAt) {
        const graceEnd = subscription.graceEndsAt instanceof Date 
          ? subscription.graceEndsAt 
          : subscription.graceEndsAt.toDate();
        
        if (graceEnd > now) {
          reason = 'grace_period';
          message = 'Subscription is in grace period';
        } else {
          reason = 'grace_expired';
          message = 'Grace period has ended';
        }
      } else {
        reason = 'expired';
        message = 'Subscription has expired';
      }
    } else if (subscription.status === 'SUSPENDED') {
      reason = 'suspended';
      message = 'Subscription is suspended';
    } else if (subscription.status === 'PENDING') {
      reason = 'pending';
      message = 'Subscription is pending activation';
    } else if (subscription.status === 'CANCELLED') {
      reason = 'cancelled';
      message = 'Subscription has been cancelled';
    }

    return NextResponse.json({
      isValid: false,
      reason,
      message,
      subscription: {
        status: subscription.status,
        endDate: subscription.endDate,
        graceEndsAt: subscription.graceEndsAt
      }
    });

  } catch (error) {
    console.error('Subscription check error:', error);
    
    // On error, return invalid but don't break the client site
    return NextResponse.json({
      isValid: false,
      reason: 'error',
      message: 'Unable to verify subscription status'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used for batch checking multiple domains
    const body = await request.json();
    const { domains } = body;

    if (!domains || !Array.isArray(domains)) {
      return NextResponse.json(
        { error: 'Domains array is required' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      domains.map(async (domain: string) => {
        try {
          const subscription = await SubscriptionService.getSubscriptionByDomain(domain);
          const isValid = subscription ? SubscriptionService.isSubscriptionValid(subscription) : false;
          
          return {
            domain,
            isValid,
            status: subscription?.status || 'no_subscription',
            endDate: subscription?.endDate || null
          };
        } catch (error) {
          return {
            domain,
            isValid: false,
            status: 'error',
            error: 'Check failed'
          };
        }
      })
    );

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Batch subscription check error:', error);
    return NextResponse.json(
      { error: 'Batch check failed' },
      { status: 500 }
    );
  }
}
