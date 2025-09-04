// Payment API route removed for Razorpay review. Restore when ready to enable payments.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { SubscriptionService, ClientService } from '../../../../lib/subscription-service';
import { getPlanById } from '../../../../lib/subscription-plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      domain, 
      contactEmail, 
      contactName, 
      contactPhone, 
      billingAddress, 
      planId, 
      gateway 
    } = body;

    // Validate required fields
    if (!domain || !contactEmail || !contactName || !planId || !gateway) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the plan details
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Check if domain already has an active subscription
    const existingSubscription = await SubscriptionService.getSubscriptionByDomain(domain);
    if (existingSubscription && SubscriptionService.isSubscriptionValid(existingSubscription)) {
      return NextResponse.json(
        { success: false, error: 'Domain already has an active subscription' },
        { status: 400 }
      );
    }

    // Create or update client record
    let client = await ClientService.getClientByDomain(domain);
    if (!client) {
      await ClientService.createClient({
        domain,
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        address: billingAddress,
        isActive: true
      });
    }

    const amount = plan.price;
    const currency = plan.currency;

    if (gateway === 'stripe') {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: plan.name,
                description: `Subscription for ${domain}`,
                metadata: {
                  domain,
                  planId,
                  services: plan.services.join(',')
                }
              },
              unit_amount: currency === 'USD' ? amount : amount * 100, // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancelled`,
        metadata: {
          domain,
          planId,
          contactEmail,
          contactName,
          contactPhone,
          billingAddress,
          services: plan.services.join(',')
        },
        customer_email: contactEmail,
      });

      return NextResponse.json({
        success: true,
        stripeUrl: session.url,
        sessionId: session.id
      });

    } else if (gateway === 'razorpay') {
      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          domain,
          planId,
          contactEmail,
          contactName,
          contactPhone,
          billingAddress,
          services: plan.services.join(',')
        }
      });

      // Razorpay checkout options
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Shivkara Digital',
        description: `${plan.name} - Subscription for ${domain}`,
        order_id: order.id,
        handler: function(response: any) {
          // This will be handled on the client side
          window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&signature=${response.razorpay_signature}`;
        },
        prefill: {
          name: contactName,
          email: contactEmail,
          contact: contactPhone
        },
        notes: {
          domain,
          planId
        },
        theme: {
          color: '#3B82F6'
        }
      };

      return NextResponse.json({
        success: true,
        razorpayOptions,
        orderId: order.id
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid payment gateway' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
