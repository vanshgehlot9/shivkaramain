// Admin Dashboard Types

export interface Income {
    id?: string;
    date: Date | string;
    clientName: string;
    projectName: string;
    paymentMode: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card';
    amount: number;
    billProofUrl?: string;
    invoiceId?: string;
    description?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Expense {
    id?: string;
    date: Date | string;
    purpose: string;
    category: 'office' | 'marketing' | 'salary' | 'utilities' | 'software' | 'travel' | 'other';
    paymentMode: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card';
    amount: number;
    billProofUrl?: string;
    description?: string;
    vendorName?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Client {
    id?: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    address?: string;
    gstNumber?: string;
    status: 'active' | 'inactive' | 'pending';
    totalProjects?: number;
    totalRevenue?: number;
    outstandingBalance?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Invoice {
    id?: string;
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    date: Date | string;
    dueDate: Date | string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    taxPercentage: number;
    discount: number;
    total: number;
    notes?: string;
    terms?: string;
    paidAmount?: number;
    paidDate?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Transaction {
    id?: string;
    date: Date | string;
    type: 'income' | 'expense';
    cashIn: number;
    cashOut: number;
    runningBalance: number;
    note: string;
    clientId?: string;
    clientName?: string;
    entityName?: string;
    category?: string;
    incomeId?: string;
    expenseId?: string;
    invoiceId?: string;
    createdAt?: Date | string;
}

export interface AnalyticsData {
    id?: string;
    date: Date | string;
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    topPages: PageStat[];
    trafficSources: TrafficSource[];
    deviceStats: DeviceStats;
    locationStats: LocationStat[];
}

export interface PageStat {
    path: string;
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
}

export interface TrafficSource {
    source: string;
    visitors: number;
    percentage: number;
}

export interface DeviceStats {
    desktop: number;
    mobile: number;
    tablet: number;
}

export interface LocationStat {
    country: string;
    city?: string;
    visitors: number;
}

export interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    cashInHand: number;
    activeProjects: number;
    totalClients: number;
    pendingInvoices: number;
    overdueInvoices: number;
    recentTransactions: Transaction[];
    monthlyData: MonthlyData[];
    topClients: TopClient[];
}

export interface MonthlyData {
    month: string;
    income: number;
    expense: number;
    profit: number;
}

export interface TopClient {
    id: string;
    name: string;
    revenue: number;
    projects: number;
}

export interface Report {
    id?: string;
    type: 'income' | 'expense' | 'profit_loss' | 'client' | 'tax';
    title: string;
    startDate: Date | string;
    endDate: Date | string;
    data: any;
    generatedAt: Date | string;
    generatedBy?: string;
}
