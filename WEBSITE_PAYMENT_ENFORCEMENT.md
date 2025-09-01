# Website Payment Enforcement System

## Overview
This system provides automated payment monitoring and website suspension capabilities for subscription-based websites. When clients fail to pay after one month, administrators can disable their websites through a comprehensive management dashboard.

## Core Features

### 1. Automated Payment Monitoring
- **Service**: `/lib/payment-monitoring-service.ts`
- **Function**: Automatically checks for overdue payments daily
- **Actions**: Sends payment reminders and suspends websites after grace period
- **Configuration**: Customizable grace periods and reminder schedules

### 2. Admin Website Management Dashboard
- **Component**: `/components/admin/WebsiteManagementDashboard.tsx`
- **Location**: Admin Panel → "Website Management" tab
- **Features**:
  - View all client websites and payment status
  - Manual website suspension/activation
  - Bulk operations for multiple websites
  - Payment reminder management
  - Automated monitoring controls

### 3. API Endpoints
- **Manual Control**: 
  - `POST /api/admin/websites/suspend` - Suspend a website
  - `POST /api/admin/websites/activate` - Activate a website
- **Automated Monitoring**: 
  - `POST /api/admin/payment-monitoring` - Run payment checks (for cron jobs)

## Usage Guide

### For Administrators

#### Accessing Website Management
1. Navigate to the Admin Panel (`/admin`)
2. Click on the "Website Management" tab
3. View the comprehensive dashboard with all client websites

#### Manual Website Control
1. **Suspend Website**: Click "Suspend" button next to any active website
2. **Activate Website**: Click "Activate" button next to any suspended website
3. **Bulk Operations**: Select multiple websites and use bulk action buttons
4. **Send Reminders**: Use "Send Reminder" to notify clients about payments

#### Monitoring Overdue Payments
1. **Payment Status**: View real-time payment status for each client
2. **Days Overdue**: See exactly how many days payments are overdue
3. **Automated Actions**: Configure automatic suspension after specific periods
4. **Grace Periods**: Set custom grace periods for different client types

### For Developers

#### Setting Up Automated Monitoring
```javascript
// Add this to your cron job configuration
// Run daily at 9 AM
0 9 * * * curl -X POST https://yourdomain.com/api/admin/payment-monitoring
```

#### Database Requirements
Ensure your database has these collections/tables:
- `subscriptions`: Client subscription data with payment dates
- `websites`: Website information with status flags
- `users`: Client user accounts with contact information

#### Environment Variables
Add these to your `.env.local`:
```
ADMIN_SECRET_KEY=your-admin-secret-key
EMAIL_SERVICE_API_KEY=your-email-service-key
```

## Technical Implementation

### Payment Monitoring Logic
1. **Daily Check**: System runs automated payment checks
2. **Grace Period**: Configurable grace period before suspension (default: 7 days)
3. **Reminder System**: Automated email reminders at 3, 7, and 10 days overdue
4. **Automatic Suspension**: Websites suspended after grace period expires
5. **Reactivation**: Automatic reactivation when payment is received

### Website Suspension Methods
- **DNS Redirect**: Redirect domain to payment page
- **Content Blocking**: Display payment notice instead of website content
- **Server Response**: Return 503 Service Unavailable with payment message
- **Database Flag**: Mark website as suspended in database

### Security Features
- **Admin Authentication**: All operations require admin privileges
- **Audit Logging**: All suspension/activation actions are logged
- **Rate Limiting**: API endpoints have rate limiting protection
- **Secure Tokens**: JWT tokens for API authentication

## Configuration Options

### Grace Period Settings
```typescript
// In payment-monitoring-service.ts
const GRACE_PERIOD_DAYS = 7; // Days after due date before suspension
const REMINDER_DAYS = [3, 7, 10]; // Days to send payment reminders
```

### Email Templates
Customize payment reminder emails in the service configuration:
- Payment due reminder
- Overdue payment notice
- Website suspension warning
- Reactivation confirmation

### Suspension Behavior
Configure how suspended websites behave:
- Redirect to payment page
- Show custom suspension message
- Completely disable website access
- Maintain minimal functionality

## Monitoring and Analytics

### Payment Metrics
- Total active subscriptions
- Overdue payment amounts
- Suspension rates
- Payment recovery rates

### Website Status Tracking
- Currently active websites
- Suspended websites count
- Recent suspension/activation activity
- Client payment patterns

### Automated Reports
- Daily payment status reports
- Weekly overdue payment summaries
- Monthly subscription analytics
- Client retention metrics

## Troubleshooting

### Common Issues
1. **Website Not Suspending**: Check API endpoint accessibility
2. **Email Reminders Not Sending**: Verify email service configuration
3. **Admin Dashboard Not Loading**: Check component imports and authentication
4. **Automated Monitoring Not Running**: Verify cron job configuration

### Support Commands
```bash
# Check payment monitoring logs
npm run logs:payment-monitoring

# Test email service
npm run test:email-service

# Verify database connections
npm run test:database

# Run manual payment check
npm run check:payments
```

## Future Enhancements

### Planned Features
- SMS payment reminders
- Partial payment tracking
- Custom suspension messages per client
- Integration with payment gateways
- Mobile app for admin management

### Advanced Automation
- AI-powered payment prediction
- Dynamic grace periods based on client history
- Automated payment plan negotiations
- Integration with accounting software

## Support
For technical support or feature requests, contact the development team or refer to the project documentation.
