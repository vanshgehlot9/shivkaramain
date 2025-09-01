import { Timestamp } from 'firebase/firestore';

// Subscription Management Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'yearly';
  price: number;
  currency: 'INR' | 'USD';
  services: string[];
  features: string[];
  popular?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  razorpayPlanId?: string;
}

export interface Subscription {
  id: string;
  domain: string;
  planId: string;
  plan: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'PENDING' | 'CANCELLED';
  services: string[];
  graceEndsAt?: Date | Timestamp;
  metadata: {
    gateway: 'stripe' | 'razorpay';
    customerId?: string;
    subscriptionId?: string;
    lastPaymentId?: string;
  };
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  domain: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: Date | Timestamp;
  paidAt?: Date | Timestamp;
  invoiceNumber: string;
  downloadUrl?: string;
  gateway: 'stripe' | 'razorpay';
  gatewayInvoiceId?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface PaymentSession {
  id: string;
  domain: string;
  planId: string;
  amount: number;
  currency: 'INR' | 'USD';
  gateway: 'stripe' | 'razorpay';
  sessionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  metadata?: Record<string, any>;
  createdAt: Date | Timestamp;
  expiresAt: Date | Timestamp;
}

export interface Client {
  id: string;
  domain: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionId?: string;
  isActive: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface AdminAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  expiringSoon: number; // expiring in next 7 days
  overdue: number;
  newSignups: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

// Notification Types
export interface NotificationTemplate {
  id: string;
  type: 'EXPIRY_REMINDER' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'SUSPENSION_WARNING' | 'RENEWAL_REMINDER';
  subject: string;
  emailBody: string;
  whatsappMessage?: string;
  scheduleOffset: number; // days before/after trigger event
}

// Middleware Types
export interface MiddlewareConfig {
  domain: string;
  redirectUrl: string;
  gracePeriod: number; // days
  allowedPaths?: string[]; // paths that bypass subscription check
}
