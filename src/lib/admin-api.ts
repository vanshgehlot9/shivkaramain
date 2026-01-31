// Admin API utility functions for making API calls from frontend

import { auth } from "@/lib/firebase";

const API_BASE = '/api/admin';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Auth Token if user is logged in
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'An error occurred',
      };
    }

    return result;
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

// Dashboard API
export async function getDashboardStats() {
  return apiRequest<{
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    cashInHand: number;
    activeProjects: number;
    recentTransactions: any[];
    monthlyData: any[];
  }>('/dashboard');
}

// Income API
export async function getIncome(params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const query = queryParams.toString();
  return apiRequest<{
    data: any[];
    total: number;
    count: number;
    byClient: Record<string, number>;
    byPaymentMode: Record<string, number>;
  }>('/income' + (query ? `?${query}` : ''));
}

export async function createIncome(data: {
  date: string;
  clientName: string;
  projectName: string;
  paymentMode: string;
  amount: number;
  billProofUrl?: string;
}) {
  return apiRequest<any>('/income', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteIncome(id: string) {
  return apiRequest<any>(`/income?id=${id}`, {
    method: 'DELETE',
  });
}

// Expenses API
export async function getExpenses(params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const query = queryParams.toString();
  return apiRequest<any>('/expenses' + (query ? `?${query}` : ''));
}

export async function createExpense(data: {
  date: string;
  purpose: string;
  category: string;
  paymentMode: string;
  amount: number;
  billProofUrl?: string;
}) {
  return apiRequest<any>('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteExpense(id: string) {
  return apiRequest<any>(`/expenses?id=${id}`, {
    method: 'DELETE',
  });
}

// Cashbook API
export async function getCashbook(params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const query = queryParams.toString();
  return apiRequest<{
    data: any[];
    currentBalance: number;
    totalCashIn: number;
    totalCashOut: number;
  }>('/cashbook' + (query ? `?${query}` : ''));
}

// Clients API
export async function getClients() {
  return apiRequest<{
    data: any[];
    summary: {
      totalClients: number;
      totalOutstanding: number;
      totalRevenue: number;
    };
  }>('/clients');
}

export async function createClient(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}) {
  return apiRequest<any>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteClient(id: string) {
  return apiRequest<any>(`/clients?id=${id}`, {
    method: 'DELETE',
  });
}

// Invoices API
export async function getInvoices(params?: {
  limit?: number;
  clientId?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.clientId) queryParams.append('clientId', params.clientId);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return apiRequest<{
    data: any[];
    count: number;
    stats: {
      totalAmount: number;
      paidAmount: number;
      pendingAmount: number;
    };
  }>('/invoices' + (query ? `?${query}` : ''));
}

export async function createInvoice(data: {
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
  }>;
  taxPercentage?: number;
  discount?: number;
  notes?: string;
  terms?: string;
  status?: string;
}) {
  return apiRequest<any>('/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInvoice(id: string, data: {
  status?: string;
  paidAmount?: number;
}) {
  return apiRequest<any>('/invoices', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

// Analytics API
export async function getAnalytics(params?: {
  metric?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.metric) queryParams.append('metric', params.metric);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.days) queryParams.append('days', params.days.toString());

  const query = queryParams.toString();
  return apiRequest<any>('/analytics' + (query ? `?${query}` : ''));
}

// Leads API
export async function getLeads() {
  return apiRequest<any[]>('/leads');
}

export async function createLead(data: {
  name: string;
  email: string;
  phone: string;
}) {
  return apiRequest<any>('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Reports API
export async function getReport(type: string, startDate: string, endDate: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('type', type);
  queryParams.append('startDate', startDate);
  queryParams.append('endDate', endDate);

  const query = queryParams.toString();
  return apiRequest<any>('/reports' + (query ? `?${query}` : ''));
}
