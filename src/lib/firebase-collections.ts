// Firebase Collections Constants for Admin Dashboard

export const COLLECTIONS = {
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
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];


