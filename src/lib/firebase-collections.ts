// Firebase Collections Constants for Admin Dashboard

export const COLLECTIONS = {
  // Existing collections
  INCOME: 'income',
  EXPENSES: 'expenses',
  CLIENTS: 'clients',
  INVOICES: 'invoices',
  TRANSACTIONS: 'transactions',
  ANALYTICS: 'analytics',
  VISITORS: 'visitors',
  PAGE_VIEWS: 'pageViews',
  VISITOR_STATS: 'visitorStats',
  LEADS: 'leads',

  // Certificate Verification System collections
  BOOTCAMPS: 'bootcamps',
  STUDENTS: 'students',
  CERTIFICATES: 'certificates',
  AUDIT_LOGS: 'audit_logs',
  VERIFICATION_STATS: 'verification_stats',

  // User Reviews
  REVIEWS: 'reviews',

  // Student Platform
  SESSIONS: 'sessions',
  ASSIGNMENTS: 'assignments',
  REFERRALS: 'referrals',
  BADGES: 'badges',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];


