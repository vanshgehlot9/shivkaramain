import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { SubscriptionService, InvoiceService } from '../../../../lib/subscription-service';
import { getPlanById } from '../../../../lib/subscription-plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePayment(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailure(invoice);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const { domain, planId, contactEmail, contactName, contactPhone, billingAddress, services } = session.metadata!;
    
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
        gateway: 'stripe',
        customerId: session.customer as string,
        subscriptionId: session.subscription as string,
        lastPaymentId: session.payment_intent as string,
      }
    });

    // Create invoice record
    await InvoiceService.createInvoice({
      subscriptionId,
      domain,
      amount: plan.price,
      currency: plan.currency,
      status: 'PAID',
      dueDate: startDate,
      paidAt: new Date(),
      invoiceNumber: `INV-${Date.now()}`,
      gateway: 'stripe',
      gatewayInvoiceId: session.id,
    });

    console.log(`Subscription created successfully for ${domain}`);
    
    // TODO: Send welcome email
    // TODO: Generate and store invoice PDF
    
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  try {
    // Handle recurring payment success
    console.log('Recurring payment succeeded:', invoice.id);
    
    // TODO: Extend subscription, update invoice status
    
  } catch (error) {
    console.error('Error handling invoice payment:', error);
  }
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  try {
    // Handle payment failure
    console.log('Payment failed for invoice:', invoice.id);
    
    // TODO: Send payment failure notification
    // TODO: Update subscription status if needed
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
