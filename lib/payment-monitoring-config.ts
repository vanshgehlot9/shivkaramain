/**
 * Cron Job Configuration for Payment Monitoring
 * 
 * This file sets up automated daily checks for overdue payments
 * and website suspension enforcement.
 * 
 * You can use this with:
 * 1. Vercel Cron Jobs
 * 2. GitHub Actions
 * 3. Server-side cron jobs
 * 4. Third-party services like EasyCron
 */

// For Vercel Cron Jobs - Add this to vercel.json
export const vercelCronConfig = {
  "crons": [
    {
      "path": "/api/admin/payment-monitoring",
      "schedule": "0 9 * * *"  // Run daily at 9 AM UTC
    }
  ]
};

// For GitHub Actions - Create .github/workflows/payment-monitoring.yml
export const githubActionConfig = `
name: Daily Payment Monitoring

on:
  schedule:
    - cron: '0 9 * * *'  # Run daily at 9 AM UTC
  workflow_dispatch:     # Allow manual trigger

jobs:
  payment-monitoring:
    runs-on: ubuntu-latest
    
    steps:
    - name: Trigger Payment Monitoring
      run: |
        curl -X POST "${{ secrets.SITE_URL }}/api/admin/payment-monitoring" \\
          -H "Authorization: Bearer ${{ secrets.ADMIN_API_TOKEN }}" \\
          -H "Content-Type: application/json"
`;

// For server-side cron job - Add this to your crontab
export const serverCronConfig = `
# Daily payment monitoring at 9 AM
0 9 * * * curl -X POST "https://yoursite.com/api/admin/payment-monitoring" -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
`;

// Manual trigger function for testing
export async function triggerPaymentMonitoring(): Promise<void> {
  try {
    const response = await fetch('/api/admin/payment-monitoring', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log('Payment monitoring result:', result);
  } catch (error) {
    console.error('Error triggering payment monitoring:', error);
  }
}

// Configuration for different suspension policies
export const suspensionPolicies = {
  strict: {
    name: 'Strict Policy',
    description: 'Quick suspension for non-payment',
    rules: [
      { days: 1, action: 'send_reminder' },
      { days: 3, action: 'send_reminder' },
      { days: 7, action: 'suspend_website' },
      { days: 15, action: 'disable_website' }
    ]
  },
  standard: {
    name: 'Standard Policy',
    description: 'Balanced approach to payment enforcement',
    rules: [
      { days: 3, action: 'send_reminder' },
      { days: 7, action: 'send_reminder' },
      { days: 15, action: 'suspend_website' },
      { days: 30, action: 'disable_website' }
    ]
  },
  lenient: {
    name: 'Lenient Policy',
    description: 'More time before suspension',
    rules: [
      { days: 7, action: 'send_reminder' },
      { days: 14, action: 'send_reminder' },
      { days: 21, action: 'send_reminder' },
      { days: 30, action: 'suspend_website' },
      { days: 60, action: 'disable_website' }
    ]
  }
};

// Email templates for different stages
export const emailTemplates = {
  firstReminder: {
    subject: 'Payment Reminder - Your Website Subscription',
    template: `
      Dear {{clientName}},
      
      This is a friendly reminder that your payment for {{domain}} is now {{daysOverdue}} days overdue.
      
      Payment Details:
      - Amount Due: ₹{{amount}}
      - Due Date: {{dueDate}}
      - Plan: {{planName}}
      
      To avoid any service interruption, please make your payment as soon as possible:
      {{paymentUrl}}
      
      If you have any questions, please contact our support team.
      
      Best regards,
      Shivkara Digital Team
    `
  },
  
  urgentReminder: {
    subject: 'Urgent: Payment Required - Website Suspension Warning',
    template: `
      Dear {{clientName}},
      
      URGENT: Your payment for {{domain}} is now {{daysOverdue}} days overdue.
      
      WARNING: Your website will be suspended if payment is not received within the next few days.
      
      Payment Details:
      - Amount Due: ₹{{amount}}
      - Due Date: {{dueDate}}
      - Plan: {{planName}}
      
      Please make your payment immediately to avoid service suspension:
      {{paymentUrl}}
      
      Contact our support team if you need assistance: support@shivkaradigital.com
      
      Best regards,
      Shivkara Digital Team
    `
  },
  
  suspensionNotice: {
    subject: 'Website Suspended - Immediate Action Required',
    template: `
      Dear {{clientName}},
      
      Your website {{domain}} has been suspended due to non-payment.
      
      Suspension Details:
      - Payment Overdue: {{daysOverdue}} days
      - Amount Due: ₹{{amount}}
      - Suspended Date: {{suspensionDate}}
      
      To reactivate your website, please:
      1. Make the overdue payment: {{paymentUrl}}
      2. Contact support for immediate reactivation
      
      Your website data is safe and will be restored once payment is received.
      
      Contact support: support@shivkaradigital.com
      
      Best regards,
      Shivkara Digital Team
    `
  },
  
  disableNotice: {
    subject: 'Website Disabled - Final Notice',
    template: `
      Dear {{clientName}},
      
      Your website {{domain}} has been disabled due to extended non-payment.
      
      Disable Details:
      - Payment Overdue: {{daysOverdue}} days
      - Amount Due: ₹{{amount}}
      - Disabled Date: {{disableDate}}
      
      IMPORTANT: Your website data will be permanently deleted in 7 days unless payment is made.
      
      To restore your website:
      1. Make all overdue payments: {{paymentUrl}}
      2. Contact support immediately: support@shivkaradigital.com
      
      This is your final opportunity to restore your website and data.
      
      Best regards,
      Shivkara Digital Team
    `
  }
};

// Dashboard configuration
export const dashboardConfig = {
  refreshInterval: 30000, // 30 seconds
  maxItemsPerPage: 50,
  defaultFilters: {
    status: 'all',
    sortBy: 'daysOverdue',
    sortOrder: 'desc'
  },
  alerts: {
    showOverdueAlerts: true,
    showSuspensionAlerts: true,
    showRevenueAlerts: true
  }
};
