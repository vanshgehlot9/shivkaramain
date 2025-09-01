# Subscription Management System

A comprehensive subscription management system built with Next.js, Firebase, Stripe, and Razorpay for managing client subscriptions, billing, and access control.

## Features

### ✅ Subscription Plans
- **Flexible Billing**: Monthly, Quarterly, and Yearly subscription options
- **Multi-tier Plans**: Basic, Professional, and Enterprise tiers
- **Service-based Pricing**: Different services (hosting, SEO, maintenance, support)
- **Automatic Savings**: Built-in discounts for longer billing cycles

### ✅ Payment Integration
- **Dual Gateway Support**: Stripe (International) + Razorpay (India)
- **Secure Processing**: PCI-compliant payment handling
- **Webhook Integration**: Automatic subscription activation
- **Invoice Generation**: PDF invoices with cloud storage

### ✅ Access Control
- **Client Site Middleware**: Automatic subscription validation
- **Grace Period Support**: 3-day grace period after expiry
- **Flexible Redirects**: Customizable payment page redirects
- **Multi-framework Support**: Next.js, Express.js, PHP examples

### ✅ Admin Dashboard
- **Subscription Management**: View, suspend, reactivate subscriptions
- **Client Management**: Complete client database
- **Analytics**: Revenue tracking, churn analysis, growth metrics
- **Notification Center**: Automated reminders and alerts

### ✅ Client Dashboard
- **Subscription Status**: Real-time subscription information
- **Billing History**: Invoice downloads and payment history
- **Plan Management**: Upgrade, downgrade, renewal options
- **Support Integration**: Direct contact with support team

### ✅ Automation
- **Cloud Scheduler**: Daily cron jobs for expiry management
- **Email Notifications**: Automated reminders and alerts
- **WhatsApp Integration**: SMS/WhatsApp notifications via Twilio
- **Status Updates**: Automatic subscription status management

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd shivkara-main

# Install dependencies
npm install

# Install additional packages for subscription system
npm install react-firebase-hooks stripe razorpay @stripe/stripe-js
```

### 2. Environment Setup

Copy the example environment file and configure your keys:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PASSWORD=your_admin_password
```

### 3. Firebase Setup

1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Authentication
4. Create the following collections:
   - `subscriptions`
   - `clients`
   - `invoices`
   - `payment_sessions`

### 4. Payment Gateway Setup

#### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints:
   - `https://yourdomain.com/api/webhooks/stripe`
4. Configure webhook events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

#### Razorpay Setup
1. Create a Razorpay account
2. Get your API keys from the Razorpay Dashboard
3. Set up webhook endpoint:
   - `https://yourdomain.com/api/webhooks/razorpay`
4. Configure webhook events:
   - `payment.captured`
   - `payment.failed`

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## Usage

### For Administrators

1. **Access Admin Dashboard**:
   - Navigate to `/admin`
   - Enter admin password
   - Go to "Subscriptions" tab

2. **Manage Subscriptions**:
   - View all active subscriptions
   - Suspend or reactivate subscriptions
   - Send payment reminders
   - Export subscription data

3. **Monitor Analytics**:
   - Track revenue and growth metrics
   - Monitor expiring subscriptions
   - Analyze churn rates

### For Clients

1. **Purchase Subscription**:
   - Visit `/payment`
   - Select desired plan
   - Complete payment via Stripe or Razorpay

2. **Access Dashboard**:
   - Sign in at `/dashboard`
   - View subscription status
   - Download invoices
   - Manage account settings

### For Client Site Integration

#### Next.js Sites
Copy `middleware-sample.js` to your client's Next.js project root as `middleware.js`:

```javascript
// middleware.js
import { NextResponse } from 'next/server';

const CLIENT_CONFIG = {
  domain: 'clientdomain.com', // Replace with actual domain
  gracePeriod: 3,
  allowedPaths: ['/maintenance', '/suspended']
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip check for allowed paths
  if (CLIENT_CONFIG.allowedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  try {
    const response = await fetch(`https://shivkaradigital.com/api/subscription/check?domain=${CLIENT_CONFIG.domain}`);
    const data = await response.json();
    
    if (data.isValid) {
      return NextResponse.next();
    } else {
      const redirectUrl = new URL('https://shivkaradigital.com/payment');
      redirectUrl.searchParams.set('domain', CLIENT_CONFIG.domain);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    // On error, allow access to prevent site downtime
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

#### Express.js Sites
```javascript
const subscriptionMiddleware = require('./subscription-middleware');
app.use(subscriptionMiddleware);
```

#### PHP Sites
```php
include 'subscription-check.php';
checkSubscription();
```

## API Endpoints

### Payment APIs
- `POST /api/payments/create-session` - Create payment session
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/razorpay` - Razorpay webhook handler

### Subscription APIs
- `GET /api/subscription/check?domain=example.com` - Check subscription status
- `POST /api/subscription/check` - Batch check multiple domains

### Admin APIs
- `GET /api/admin/subscriptions` - Get all subscriptions
- `PUT /api/admin/subscriptions/:id` - Update subscription
- `GET /api/admin/analytics` - Get analytics data

## Database Schema

### Subscriptions Collection
```typescript
{
  id: string;
  domain: string;
  planId: string;
  plan: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'PENDING' | 'CANCELLED';
  services: string[];
  graceEndsAt?: Date;
  metadata: {
    gateway: 'stripe' | 'razorpay';
    customerId?: string;
    subscriptionId?: string;
    lastPaymentId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Clients Collection
```typescript
{
  id: string;
  domain: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Invoices Collection
```typescript
{
  id: string;
  subscriptionId: string;
  domain: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: Date;
  paidAt?: Date;
  invoiceNumber: string;
  downloadUrl?: string;
  gateway: 'stripe' | 'razorpay';
  gatewayInvoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Subscriptions - Admin only write, domain-based read
    match /subscriptions/{document} {
      allow read: if resource.data.domain == request.auth.token.email.split('@')[1] 
                  || request.auth.token.admin == true;
      allow write: if request.auth.token.admin == true;
    }
    
    // Clients - Admin only write, self read
    match /clients/{document} {
      allow read: if resource.data.email == request.auth.token.email 
                  || request.auth.token.admin == true;
      allow write: if request.auth.token.admin == true;
    }
    
    // Invoices - Admin write, subscription owner read
    match /invoices/{document} {
      allow read: if resource.data.domain == request.auth.token.email.split('@')[1] 
                  || request.auth.token.admin == true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

## Cloud Functions (Optional)

### Automated Cron Jobs
```javascript
// functions/src/cron.ts
export const dailySubscriptionCheck = functions.pubsub
  .schedule('0 9 * * *') // Daily at 9 AM
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    // Check for expiring subscriptions
    // Send reminders
    // Update statuses
  });
```

### Invoice Generation
```javascript
// functions/src/invoices.ts
export const generateInvoice = functions.firestore
  .document('invoices/{invoiceId}')
  .onCreate(async (snap, context) => {
    // Generate PDF invoice
    // Upload to Cloud Storage
    // Send email notification
  });
```

## Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add RAZORPAY_KEY_SECRET
# ... add all environment variables
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

## Monitoring and Analytics

### Built-in Analytics
- Revenue tracking
- Subscription growth
- Churn analysis
- Payment success rates

### External Integrations
- Google Analytics
- Mixpanel
- Segment
- PostHog

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **Webhook Verification**: Always verify webhook signatures
3. **Firestore Rules**: Implement proper security rules
4. **HTTPS Only**: Use HTTPS in production
5. **CORS Configuration**: Configure CORS properly for API endpoints

## Troubleshooting

### Common Issues

1. **Webhook Not Working**:
   - Check webhook URL is publicly accessible
   - Verify webhook secret
   - Check Firestore write permissions

2. **Payment Failed**:
   - Verify API keys are correct
   - Check webhook endpoint configuration
   - Review payment gateway logs

3. **Subscription Check Failed**:
   - Verify Firebase connection
   - Check Firestore security rules
   - Ensure proper domain configuration

### Debug Mode
Set `NODE_ENV=development` for detailed logging.

## Support

For technical support and questions:
- Email: support@shivkaradigital.com
- Documentation: [Link to full documentation]
- Issues: [GitHub Issues]

## License

This project is proprietary software. All rights reserved.
