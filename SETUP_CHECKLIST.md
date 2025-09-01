# Subscription System Setup Checklist

## ✅ Pre-Setup Verification

- [ ] Next.js project is running locally
- [ ] Firebase project exists
- [ ] Stripe account is created
- [ ] Razorpay account is created (for Indian payments)

## 🔧 Environment Configuration

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Configure Firebase
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable Firestore Database
- [ ] Enable Authentication (Email/Password)
- [ ] Copy configuration keys to .env.local:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

### 3. Configure Stripe
- [ ] Get API keys from https://dashboard.stripe.com/apikeys
- [ ] Add to .env.local:
  - [ ] `STRIPE_SECRET_KEY` (sk_test_... or sk_live_...)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_... or pk_live_...)
- [ ] Set up webhook endpoint:
  - [ ] URL: `https://yourdomain.com/api/webhooks/stripe`
  - [ ] Events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`
  - [ ] Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Configure Razorpay
- [ ] Get API keys from https://dashboard.razorpay.com/app/api-keys
- [ ] Add to .env.local:
  - [ ] `RAZORPAY_KEY_ID` (rzp_test_... or rzp_live_...)
  - [ ] `RAZORPAY_KEY_SECRET`
  - [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] Set up webhook endpoint:
  - [ ] URL: `https://yourdomain.com/api/webhooks/razorpay`
  - [ ] Events: `payment.captured`, `payment.failed`

### 5. Application Configuration
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your domain
- [ ] Set `ADMIN_PASSWORD` for admin access
- [ ] Configure optional services (Twilio, email, etc.)

## 🔥 Firebase Setup

### 1. Firestore Collections
Create these collections in Firestore (they will auto-create when first document is added):
- [ ] `subscriptions`
- [ ] `clients`
- [ ] `invoices`
- [ ] `payment_sessions`

### 2. Firestore Security Rules
- [ ] Update Firestore rules in Firebase Console
- [ ] Copy rules from `firestore.rules` file
- [ ] Test rules work correctly

### 3. Firebase Authentication
- [ ] Enable Email/Password authentication
- [ ] Create admin user account
- [ ] Set custom claims for admin user (optional)

## 🚀 Development Testing

### 1. Install Dependencies
```bash
npm install
npm install react-firebase-hooks stripe razorpay @stripe/stripe-js
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test Core Functions
- [ ] Visit http://localhost:3000/payment
- [ ] Select a plan and test payment flow
- [ ] Check Firestore for created subscription
- [ ] Visit http://localhost:3000/admin
- [ ] Login with admin credentials
- [ ] Verify subscription appears in admin dashboard

### 4. Test Client Dashboard
- [ ] Visit http://localhost:3000/dashboard
- [ ] Sign in as a client
- [ ] Verify subscription status displays correctly

## 🌐 Production Deployment

### 1. Environment Variables
- [ ] Set all environment variables in production
- [ ] Use production API keys for Stripe/Razorpay
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain

### 2. Webhook Configuration
- [ ] Update webhook URLs to production domain
- [ ] Test webhook delivery
- [ ] Verify webhook signatures work

### 3. Firebase Configuration
- [ ] Switch to production Firebase project (if different)
- [ ] Update Firestore security rules
- [ ] Set up proper authentication

### 4. DNS and SSL
- [ ] Configure custom domain
- [ ] Ensure SSL certificate is active
- [ ] Test all payment flows in production

## 🛠️ Client Integration

### 1. Middleware Setup
For each client website, set up subscription checking:

#### Next.js Sites
- [ ] Copy `middleware-sample.js` to client project
- [ ] Update domain configuration
- [ ] Test middleware functionality

#### Express.js Sites
- [ ] Copy `middleware-express.js` to client project
- [ ] Configure domain in middleware
- [ ] Test subscription checking

#### PHP Sites
- [ ] Copy `subscription-check.php` to client site
- [ ] Include in main files
- [ ] Test subscription validation

### 2. Client Configuration
- [ ] Add client domain to subscription system
- [ ] Test subscription expiry behavior
- [ ] Verify grace period functionality

## 📧 Notification Setup (Optional)

### 1. Email Notifications
- [ ] Configure email service (SendGrid, Mailgun, etc.)
- [ ] Set up email templates
- [ ] Test payment confirmations and reminders

### 2. WhatsApp/SMS (Optional)
- [ ] Configure Twilio account
- [ ] Set up WhatsApp Business API
- [ ] Test notification delivery

## 📊 Analytics and Monitoring

### 1. Built-in Analytics
- [ ] Verify analytics data appears in admin dashboard
- [ ] Test revenue tracking
- [ ] Check subscription metrics

### 2. External Analytics (Optional)
- [ ] Set up Google Analytics
- [ ] Configure conversion tracking
- [ ] Monitor payment success rates

## 🔒 Security Checklist

- [ ] All API keys are in environment variables
- [ ] Webhook endpoints verify signatures
- [ ] Firestore rules are properly configured
- [ ] HTTPS is enforced in production
- [ ] Admin access is password protected
- [ ] Client data is properly isolated

## 🧪 Testing Checklist

### Payment Flow Testing
- [ ] Test Stripe payment success
- [ ] Test Stripe payment failure
- [ ] Test Razorpay payment success
- [ ] Test Razorpay payment failure
- [ ] Verify subscription creation
- [ ] Test webhook processing

### Subscription Management
- [ ] Test subscription expiry
- [ ] Test grace period functionality
- [ ] Test subscription suspension
- [ ] Test subscription reactivation
- [ ] Test plan upgrades/downgrades

### Access Control
- [ ] Test middleware on active subscription
- [ ] Test middleware on expired subscription
- [ ] Test middleware during grace period
- [ ] Test middleware error handling

## 📞 Support and Maintenance

### Documentation
- [ ] Review full system documentation
- [ ] Understand database schema
- [ ] Know how to troubleshoot common issues

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor webhook delivery
- [ ] Track payment success rates

### Backup and Recovery
- [ ] Regular Firestore backups
- [ ] Test data recovery procedures
- [ ] Document system architecture

## ✅ Final Verification

- [ ] All environment variables configured
- [ ] Payment flows working correctly
- [ ] Webhooks processing successfully
- [ ] Admin dashboard functional
- [ ] Client dashboard working
- [ ] Subscription checking operational
- [ ] Email notifications sent (if configured)
- [ ] Production deployment successful
- [ ] Client sites integrated
- [ ] Monitoring and analytics active

## 🚨 Common Issues and Solutions

### Webhook Issues
**Problem**: Webhooks not receiving data
**Solution**: Check webhook URL, verify signatures, ensure public accessibility

### Payment Failures
**Problem**: Payments not processing
**Solution**: Verify API keys, check webhook configuration, review gateway logs

### Subscription Access
**Problem**: Middleware not working
**Solution**: Check domain configuration, verify Firebase connection, test API endpoint

### Database Errors
**Problem**: Firestore write failures
**Solution**: Review security rules, check authentication, verify field types

---

## Next Steps After Setup

1. **Test thoroughly** in development environment
2. **Deploy to staging** for final testing
3. **Configure production** environment
4. **Train team** on admin dashboard
5. **Document processes** for client onboarding
6. **Set up monitoring** and alerts
7. **Create backup procedures**

## Support Contacts

- **Technical Issues**: Create GitHub issue or contact development team
- **Business Questions**: Contact project manager
- **Emergency Support**: Use provided emergency contact information

---

*This checklist ensures complete setup and deployment of the subscription management system. Check off each item as you complete it to track your progress.*
