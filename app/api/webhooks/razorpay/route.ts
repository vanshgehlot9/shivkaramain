import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { SubscriptionService, InvoiceService } from '../../../../lib/subscription-service';
import { getPlanById } from '../../../../lib/subscription-plans';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle the event
    switch (event.event) {
      case 'payment.captured': {
        await handleSuccessfulPayment(event.payload.payment.entity);
        break;
      }
      case 'payment.failed': {
        await handlePaymentFailure(event.payload.payment.entity);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.event}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(payment: any) {
  try {
    const { domain, planId, contactEmail, contactName, contactPhone, billingAddress } = payment.notes;
    
    const plan = getPlanById(planId);
    if (!plan) {
      console.error('Plan not found:', planId);
      return;
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    
    switch (plan.type) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Create subscription
    const subscriptionId = await SubscriptionService.createSubscription({
      domain,
      planId,
      plan: plan.type,
      startDate,
      endDate,
      status: 'ACTIVE',
      services: plan.services,
      metadata: {
        gateway: 'razorpay',
        customerId: payment.customer_id,
        lastPaymentId: payment.id,
      }
    });

    // Create invoice record
    await InvoiceService.createInvoice({
      subscriptionId,
      domain,
      amount: payment.amount / 100, // Convert from paise to rupees
      currency: 'INR',
      status: 'PAID',
      dueDate: startDate,
      paidAt: new Date(),
      invoiceNumber: `INV-${Date.now()}`,
      gateway: 'razorpay',
      gatewayInvoiceId: payment.id,
    });

    console.log(`Subscription created successfully for ${domain}`);
    
    // TODO: Send welcome email
    // TODO: Generate and store invoice PDF
    
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handlePaymentFailure(payment: any) {
  try {
    console.log('Payment failed:', payment.id);
    
    // TODO: Send payment failure notification
    // TODO: Handle failed payment logic
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
