/**
 * Payment Monitoring and Website Management Service
 * Handles automatic website suspension for overdue payments
 */

export interface PaymentStatus {
  websiteId: string;
  domain: string;
  clientEmail: string;
  planId: string;
  lastPaymentDate: Date;
  nextPaymentDue: Date;
  daysOverdue: number;
  status: 'active' | 'pending_payment' | 'suspended' | 'disabled';
  autoSuspendEnabled: boolean;
  remindersSent: number;
  suspensionDate?: Date;
}

export interface SuspensionRule {
  id: string;
  name: string;
  description: string;
  daysAfterDue: number;
  action: 'send_reminder' | 'suspend_website' | 'disable_website';
  isActive: boolean;
  createdAt: Date;
}

export class PaymentMonitoringService {
  private static instance: PaymentMonitoringService;
  private suspensionRules: SuspensionRule[] = [
    {
      id: '1',
      name: 'First Payment Reminder',
      description: 'Send email reminder 3 days after payment due',
      daysAfterDue: 3,
      action: 'send_reminder',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Second Payment Reminder',
      description: 'Send urgent email reminder 7 days after payment due',
      daysAfterDue: 7,
      action: 'send_reminder',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Website Suspension',
      description: 'Suspend website 15 days after payment due',
      daysAfterDue: 15,
      action: 'suspend_website',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '4',
      name: 'Website Disable',
      description: 'Disable website permanently 30 days after payment due',
      daysAfterDue: 30,
      action: 'disable_website',
      isActive: true,
      createdAt: new Date()
    }
  ];

  public static getInstance(): PaymentMonitoringService {
    if (!PaymentMonitoringService.instance) {
      PaymentMonitoringService.instance = new PaymentMonitoringService();
    }
    return PaymentMonitoringService.instance;
  }

  /**
   * Check all websites for overdue payments and apply rules
   */
  async checkOverduePayments(): Promise<{
    processed: number;
    remindersSent: number;
    websitesSuspended: number;
    websitesDisabled: number;
    errors: string[];
  }> {
    const results = {
      processed: 0,
      remindersSent: 0,
      websitesSuspended: 0,
      websitesDisabled: 0,
      errors: [] as string[]
    };

    try {
      // Get all active websites with payment tracking
      const websites = await this.getAllWebsitesWithPaymentStatus();
      
      for (const website of websites) {
        try {
          await this.processWebsitePaymentStatus(website, results);
          results.processed++;
        } catch (error) {
          results.errors.push(`Error processing ${website.domain}: ${error}`);
        }
      }

      // Log results
      console.log('Payment monitoring completed:', results);
      
      // Send admin notification if any actions were taken
      if (results.remindersSent > 0 || results.websitesSuspended > 0 || results.websitesDisabled > 0) {
        await this.sendAdminNotification(results);
      }

      return results;
    } catch (error) {
      console.error('Error in payment monitoring:', error);
      throw error;
    }
  }

  /**
   * Process individual website payment status
   */
  private async processWebsitePaymentStatus(
    website: PaymentStatus, 
    results: any
  ): Promise<void> {
    if (!website.autoSuspendEnabled) {
      return; // Skip if auto-suspend is disabled
    }

    const daysOverdue = this.calculateDaysOverdue(website.nextPaymentDue);
    
    if (daysOverdue <= 0) {
      return; // Payment not overdue
    }

    // Update website overdue days
    await this.updateWebsiteOverdueDays(website.websiteId, daysOverdue);

    // Check and apply suspension rules
    for (const rule of this.suspensionRules.filter(r => r.isActive)) {
      if (daysOverdue >= rule.daysAfterDue) {
        await this.applyRule(website, rule, results);
      }
    }
  }

  /**
   * Apply suspension rule to website
   */
  private async applyRule(
    website: PaymentStatus, 
    rule: SuspensionRule, 
    results: any
  ): Promise<void> {
    switch (rule.action) {
      case 'send_reminder':
        if (website.remindersSent < this.getMaxRemindersForDays(rule.daysAfterDue)) {
          await this.sendPaymentReminder(website, rule);
          results.remindersSent++;
        }
        break;

      case 'suspend_website':
        if (website.status === 'active' || website.status === 'pending_payment') {
          await this.suspendWebsite(website, rule);
          results.websitesSuspended++;
        }
        break;

      case 'disable_website':
        if (website.status !== 'disabled') {
          await this.disableWebsite(website, rule);
          results.websitesDisabled++;
        }
        break;
    }
  }

  /**
   * Send payment reminder email
   */
  private async sendPaymentReminder(
    website: PaymentStatus, 
    rule: SuspensionRule
  ): Promise<void> {
    try {
      const emailData = {
        to: website.clientEmail,
        subject: this.getReminderSubject(website.daysOverdue),
        template: 'payment-reminder',
        data: {
          domain: website.domain,
          daysOverdue: website.daysOverdue,
          nextPaymentDue: website.nextPaymentDue,
          paymentUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment?website=${website.websiteId}`,
          isUrgent: website.daysOverdue >= 7
        }
      };

      // Send email (implement your email service)
      await this.sendEmail(emailData);

      // Update reminder count
      await this.updateReminderCount(website.websiteId);

      console.log(`Payment reminder sent to ${website.clientEmail} for ${website.domain}`);
    } catch (error) {
      console.error(`Error sending reminder for ${website.domain}:`, error);
      throw error;
    }
  }

  /**
   * Suspend website
   */
  private async suspendWebsite(
    website: PaymentStatus, 
    rule: SuspensionRule
  ): Promise<void> {
    try {
      // Update website status
      await this.updateWebsiteStatus(website.websiteId, 'suspended', {
        reason: `Automatic suspension: ${website.daysOverdue} days overdue`,
        suspendedBy: 'system',
        suspensionDate: new Date(),
        ruleApplied: rule.name
      });

      // Implement actual website suspension (DNS, server config, etc.)
      await this.implementWebsiteSuspension(website.domain);

      // Send suspension notification
      await this.sendSuspensionNotification(website, rule);

      console.log(`Website suspended: ${website.domain} (${website.daysOverdue} days overdue)`);
    } catch (error) {
      console.error(`Error suspending ${website.domain}:`, error);
      throw error;
    }
  }

  /**
   * Disable website permanently
   */
  private async disableWebsite(
    website: PaymentStatus, 
    rule: SuspensionRule
  ): Promise<void> {
    try {
      // Update website status
      await this.updateWebsiteStatus(website.websiteId, 'disabled', {
        reason: `Automatic disable: ${website.daysOverdue} days overdue`,
        disabledBy: 'system',
        disableDate: new Date(),
        ruleApplied: rule.name
      });

      // Implement actual website disable (remove files, disable DNS, etc.)
      await this.implementWebsiteDisable(website.domain);

      // Send disable notification
      await this.sendDisableNotification(website, rule);

      console.log(`Website disabled: ${website.domain} (${website.daysOverdue} days overdue)`);
    } catch (error) {
      console.error(`Error disabling ${website.domain}:`, error);
      throw error;
    }
  }

  /**
   * Calculate days overdue from payment due date
   */
  private calculateDaysOverdue(nextPaymentDue: Date): number {
    const today = new Date();
    const dueDate = new Date(nextPaymentDue);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Get reminder subject based on days overdue
   */
  private getReminderSubject(daysOverdue: number): string {
    if (daysOverdue <= 3) {
      return 'Payment Reminder - Your Website Subscription';
    } else if (daysOverdue <= 7) {
      return 'Urgent: Payment Required - Website Suspension Warning';
    } else {
      return 'Final Notice: Immediate Payment Required';
    }
  }

  /**
   * Get maximum reminders for specific days
   */
  private getMaxRemindersForDays(days: number): number {
    if (days <= 3) return 1;
    if (days <= 7) return 2;
    return 3;
  }

  /**
   * Manual website suspension by admin
   */
  async manualSuspendWebsite(
    websiteId: string, 
    reason: string, 
    adminId: string
  ): Promise<void> {
    try {
      const website = await this.getWebsiteById(websiteId);
      
      await this.updateWebsiteStatus(websiteId, 'suspended', {
        reason: reason,
        suspendedBy: adminId,
        suspensionDate: new Date(),
        ruleApplied: 'manual'
      });

      await this.implementWebsiteSuspension(website.domain);
      
      console.log(`Website manually suspended: ${website.domain} by admin ${adminId}`);
    } catch (error) {
      console.error(`Error manually suspending website ${websiteId}:`, error);
      throw error;
    }
  }

  /**
   * Manual website activation by admin
   */
  async manualActivateWebsite(
    websiteId: string, 
    adminId: string
  ): Promise<void> {
    try {
      const website = await this.getWebsiteById(websiteId);
      
      await this.updateWebsiteStatus(websiteId, 'active', {
        reason: 'Manual activation by admin',
        activatedBy: adminId,
        activationDate: new Date()
      });

      await this.implementWebsiteActivation(website.domain);
      
      console.log(`Website manually activated: ${website.domain} by admin ${adminId}`);
    } catch (error) {
      console.error(`Error manually activating website ${websiteId}:`, error);
      throw error;
    }
  }

  /**
   * Get suspension rules
   */
  getSuspensionRules(): SuspensionRule[] {
    return this.suspensionRules;
  }

  /**
   * Update suspension rule
   */
  async updateSuspensionRule(ruleId: string, updates: Partial<SuspensionRule>): Promise<void> {
    const ruleIndex = this.suspensionRules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex !== -1) {
      this.suspensionRules[ruleIndex] = { ...this.suspensionRules[ruleIndex], ...updates };
    }
  }

  // Private helper methods (implement based on your database/infrastructure)

  private async getAllWebsitesWithPaymentStatus(): Promise<PaymentStatus[]> {
    // Implement database query to get all websites with payment status
    // This should return websites with their payment information
    return [];
  }

  private async getWebsiteById(websiteId: string): Promise<PaymentStatus> {
    // Implement database query to get specific website
    throw new Error('Not implemented');
  }

  private async updateWebsiteOverdueDays(websiteId: string, days: number): Promise<void> {
    // Update website overdue days in database
  }

  private async updateWebsiteStatus(
    websiteId: string, 
    status: string, 
    metadata: any
  ): Promise<void> {
    // Update website status in database
  }

  private async updateReminderCount(websiteId: string): Promise<void> {
    // Increment reminder count in database
  }

  private async sendEmail(emailData: any): Promise<void> {
    // Implement email sending (SendGrid, AWS SES, etc.)
  }

  private async implementWebsiteSuspension(domain: string): Promise<void> {
    // Implement actual website suspension
    // This could involve:
    // - Updating DNS records
    // - Modifying server configuration
    // - Showing suspension page
    console.log(`Implementing suspension for ${domain}`);
  }

  private async implementWebsiteDisable(domain: string): Promise<void> {
    // Implement actual website disable
    // This could involve:
    // - Removing files
    // - Disabling DNS
    // - Archiving data
    console.log(`Implementing disable for ${domain}`);
  }

  private async implementWebsiteActivation(domain: string): Promise<void> {
    // Implement website activation
    // This could involve:
    // - Restoring DNS records
    // - Enabling server configuration
    // - Removing suspension page
    console.log(`Implementing activation for ${domain}`);
  }

  private async sendSuspensionNotification(
    website: PaymentStatus, 
    rule: SuspensionRule
  ): Promise<void> {
    // Send suspension notification email
  }

  private async sendDisableNotification(
    website: PaymentStatus, 
    rule: SuspensionRule
  ): Promise<void> {
    // Send disable notification email
  }

  private async sendAdminNotification(results: any): Promise<void> {
    // Send admin notification about daily monitoring results
  }
}

// Export singleton instance
export const paymentMonitoringService = PaymentMonitoringService.getInstance();
