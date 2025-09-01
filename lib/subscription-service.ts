import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Subscription, 
  Client, 
  Invoice, 
  PaymentSession, 
  AdminAnalytics 
} from './subscription-types';

// Collections
export const COLLECTIONS = {
  SUBSCRIPTIONS: 'subscriptions',
  CLIENTS: 'clients',
  INVOICES: 'invoices',
  PAYMENT_SESSIONS: 'payment_sessions',
  ANALYTICS: 'analytics'
};

// Subscription Management
export class SubscriptionService {
  
  // Create new subscription
  static async createSubscription(subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = doc(collection(db, COLLECTIONS.SUBSCRIPTIONS));
      const subscription: Subscription = {
        ...subscriptionData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(docRef, {
        ...subscription,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Get subscription by domain
  static async getSubscriptionByDomain(domain: string): Promise<Subscription | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.SUBSCRIPTIONS),
        where('domain', '==', domain),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Subscription;
    } catch (error) {
      console.error('Error getting subscription by domain:', error);
      throw error;
    }
  }

  // Update subscription status
  static async updateSubscriptionStatus(
    subscriptionId: string, 
    status: Subscription['status'],
    metadata?: Partial<Subscription['metadata']>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, subscriptionId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (metadata) {
        updateData.metadata = metadata;
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  // Extend subscription
  static async extendSubscription(
    subscriptionId: string, 
    newEndDate: Date,
    paymentId?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, subscriptionId);
      const updateData: any = {
        endDate: Timestamp.fromDate(newEndDate),
        status: 'ACTIVE' as const,
        updatedAt: serverTimestamp()
      };
      
      if (paymentId) {
        updateData['metadata.lastPaymentId'] = paymentId;
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error extending subscription:', error);
      throw error;
    }
  }

  // Get all subscriptions with filters
  static async getSubscriptions(
    filters?: {
      status?: Subscription['status'];
      expiringBefore?: Date;
      limit?: number;
    }
  ): Promise<Subscription[]> {
    try {
      let q = query(collection(db, COLLECTIONS.SUBSCRIPTIONS));
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      if (filters?.expiringBefore) {
        q = query(q, where('endDate', '<=', Timestamp.fromDate(filters.expiringBefore)));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      throw error;
    }
  }

  // Check if subscription is valid
  static isSubscriptionValid(subscription: Subscription): boolean {
    if (!subscription) return false;
    
    const now = new Date();
    const endDate = subscription.endDate instanceof Date ? subscription.endDate : subscription.endDate.toDate();
    
    if (subscription.status === 'ACTIVE' && endDate > now) {
      return true;
    }
    
    // Check grace period
    if (subscription.status === 'EXPIRED' && subscription.graceEndsAt) {
      const graceEnd = subscription.graceEndsAt instanceof Date ? subscription.graceEndsAt : subscription.graceEndsAt.toDate();
      return graceEnd > now;
    }
    
    return false;
  }
}

// Client Management
export class ClientService {
  
  // Create new client
  static async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = doc(collection(db, COLLECTIONS.CLIENTS));
      const client: Client = {
        ...clientData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(docRef, {
        ...client,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Get client by domain
  static async getClientByDomain(domain: string): Promise<Client | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CLIENTS),
        where('domain', '==', domain),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Client;
    } catch (error) {
      console.error('Error getting client by domain:', error);
      throw error;
    }
  }

  // Get all clients
  static async getAllClients(): Promise<Client[]> {
    try {
      const q = query(collection(db, COLLECTIONS.CLIENTS), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    } catch (error) {
      console.error('Error getting all clients:', error);
      throw error;
    }
  }
}

// Invoice Management
export class InvoiceService {
  
  // Create new invoice
  static async createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = doc(collection(db, COLLECTIONS.INVOICES));
      const invoice: Invoice = {
        ...invoiceData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(docRef, {
        ...invoice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Get invoices by subscription
  static async getInvoicesBySubscription(subscriptionId: string): Promise<Invoice[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.INVOICES),
        where('subscriptionId', '==', subscriptionId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
    } catch (error) {
      console.error('Error getting invoices by subscription:', error);
      throw error;
    }
  }

  // Update invoice status
  static async updateInvoiceStatus(invoiceId: string, status: Invoice['status'], paidAt?: Date): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.INVOICES, invoiceId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (paidAt) {
        updateData.paidAt = Timestamp.fromDate(paidAt);
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }
}

// Analytics Service
export class AnalyticsService {
  
  // Get admin analytics
  static async getAdminAnalytics(): Promise<AdminAnalytics> {
    try {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Get all subscriptions
      const allSubscriptions = await SubscriptionService.getSubscriptions();
      
      // Get active subscriptions
      const activeSubscriptions = allSubscriptions.filter(sub => sub.status === 'ACTIVE');
      
      // Get expiring soon (next 7 days)
      const expiringSoon = allSubscriptions.filter(sub => {
        const endDate = sub.endDate instanceof Date ? sub.endDate : sub.endDate.toDate();
        return sub.status === 'ACTIVE' && endDate <= sevenDaysFromNow && endDate > now;
      });
      
      // Get overdue
      const overdue = allSubscriptions.filter(sub => {
        const endDate = sub.endDate instanceof Date ? sub.endDate : sub.endDate.toDate();
        return endDate < now && (sub.status === 'EXPIRED' || sub.status === 'SUSPENDED');
      });
      
      // Get this month's subscriptions
      const thisMonthSubscriptions = allSubscriptions.filter(sub => {
        const createdAt = sub.createdAt instanceof Date ? sub.createdAt : sub.createdAt.toDate();
        return createdAt >= thisMonth;
      });
      
      // Calculate revenue (this would typically come from paid invoices)
      const totalRevenue = 0; // Calculate from invoices
      const monthlyRevenue = 0; // Calculate from this month's invoices
      
      return {
        totalRevenue,
        monthlyRevenue,
        activeSubscriptions: activeSubscriptions.length,
        expiringSoon: expiringSoon.length,
        overdue: overdue.length,
        newSignups: thisMonthSubscriptions.length,
        churnRate: 0, // Calculate based on cancellations
        averageRevenuePerUser: activeSubscriptions.length > 0 ? totalRevenue / activeSubscriptions.length : 0
      };
    } catch (error) {
      console.error('Error getting admin analytics:', error);
      throw error;
    }
  }
}
