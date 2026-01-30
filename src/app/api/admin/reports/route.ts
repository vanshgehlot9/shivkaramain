import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

// GET - Generate various reports
export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth) {
        return unauthorizedResponse();
    }

    try {
        if (!db) {
            return NextResponse.json(
                { success: false, error: 'Database not initialized' },
                { status: 500 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const reportType = searchParams.get('type'); // 'income', 'expense', 'profit_loss', 'client', 'tax'
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!reportType) {
            return NextResponse.json(
                { success: false, error: 'Report type is required' },
                { status: 400 }
            );
        }

        if (!startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: 'Start date and end date are required' },
                { status: 400 }
            );
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        let reportData: any = {};

        switch (reportType) {
            case 'income':
                reportData = await generateIncomeReport(start, end);
                break;
            case 'expense':
                reportData = await generateExpenseReport(start, end);
                break;
            case 'profit_loss':
                reportData = await generateProfitLossReport(start, end);
                break;
            case 'client':
                reportData = await generateClientReport(start, end);
                break;
            case 'tax':
                reportData = await generateTaxReport(start, end);
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid report type' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            reportType,
            startDate,
            endDate,
            generatedAt: new Date().toISOString(),
            data: reportData,
        });
    } catch (error: any) {
        console.error('Error generating report:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// Income Report
async function generateIncomeReport(startDate: Date, endDate: Date) {
    const incomeSnapshot = await db!
        .collection(COLLECTIONS.INCOME)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .orderBy('date', 'desc')
        .get();

    const incomeRecords = incomeSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
    }));

    const totalIncome = incomeRecords.reduce((sum, record: any) => sum + (record.amount || 0), 0);

    // Group by client
    const byClient = incomeRecords.reduce((acc: any, record: any) => {
        const client = record.clientName || 'Unknown';
        if (!acc[client]) {
            acc[client] = { count: 0, total: 0, records: [] };
        }
        acc[client].count++;
        acc[client].total += record.amount || 0;
        acc[client].records.push(record);
        return acc;
    }, {});

    // Group by payment mode
    const byPaymentMode = incomeRecords.reduce((acc: any, record: any) => {
        const mode = record.paymentMode || 'unknown';
        acc[mode] = (acc[mode] || 0) + (record.amount || 0);
        return acc;
    }, {});

    // Group by month
    const byMonth = incomeRecords.reduce((acc: any, record: any) => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + (record.amount || 0);
        return acc;
    }, {});

    return {
        totalIncome,
        recordCount: incomeRecords.length,
        byClient,
        byPaymentMode,
        byMonth,
        records: incomeRecords,
    };
}

// Expense Report
async function generateExpenseReport(startDate: Date, endDate: Date) {
    const expenseSnapshot = await db!
        .collection(COLLECTIONS.EXPENSES)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .orderBy('date', 'desc')
        .get();

    const expenseRecords = expenseSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
    }));

    const totalExpense = expenseRecords.reduce((sum, record: any) => sum + (record.amount || 0), 0);

    // Group by category
    const byCategory = expenseRecords.reduce((acc: any, record: any) => {
        const category = record.category || 'other';
        if (!acc[category]) {
            acc[category] = { count: 0, total: 0, records: [] };
        }
        acc[category].count++;
        acc[category].total += record.amount || 0;
        acc[category].records.push(record);
        return acc;
    }, {});

    // Group by payment mode
    const byPaymentMode = expenseRecords.reduce((acc: any, record: any) => {
        const mode = record.paymentMode || 'unknown';
        acc[mode] = (acc[mode] || 0) + (record.amount || 0);
        return acc;
    }, {});

    // Group by month
    const byMonth = expenseRecords.reduce((acc: any, record: any) => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + (record.amount || 0);
        return acc;
    }, {});

    return {
        totalExpense,
        recordCount: expenseRecords.length,
        byCategory,
        byPaymentMode,
        byMonth,
        records: expenseRecords,
    };
}

// Profit & Loss Report
async function generateProfitLossReport(startDate: Date, endDate: Date) {
    const incomeReport = await generateIncomeReport(startDate, endDate);
    const expenseReport = await generateExpenseReport(startDate, endDate);

    const netProfit = incomeReport.totalIncome - expenseReport.totalExpense;
    const profitMargin = incomeReport.totalIncome > 0
        ? ((netProfit / incomeReport.totalIncome) * 100).toFixed(2)
        : 0;

    // Monthly breakdown
    const allMonths = new Set([
        ...Object.keys(incomeReport.byMonth),
        ...Object.keys(expenseReport.byMonth),
    ]);

    const monthlyBreakdown = Array.from(allMonths).sort().map(month => ({
        month,
        income: incomeReport.byMonth[month] || 0,
        expense: expenseReport.byMonth[month] || 0,
        profit: (incomeReport.byMonth[month] || 0) - (expenseReport.byMonth[month] || 0),
    }));

    return {
        summary: {
            totalIncome: incomeReport.totalIncome,
            totalExpense: expenseReport.totalExpense,
            netProfit,
            profitMargin: `${profitMargin}%`,
        },
        monthlyBreakdown,
        incomeByClient: incomeReport.byClient,
        expenseByCategory: expenseReport.byCategory,
    };
}

// Client Report
async function generateClientReport(startDate: Date, endDate: Date) {
    const clientsSnapshot = await db!.collection(COLLECTIONS.CLIENTS).get();
    const clients = clientsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
    }));

    const clientReports = await Promise.all(
        clients.map(async (client: any) => {
            // Get income for this client
            const incomeSnapshot = await db!
                .collection(COLLECTIONS.INCOME)
                .where('clientName', '==', client.name)
                .where('date', '>=', startDate)
                .where('date', '<=', endDate)
                .get();

            const totalRevenue = incomeSnapshot.docs.reduce((sum, doc) => {
                return sum + (doc.data().amount || 0);
            }, 0);

            // Get invoices for this client
            const invoicesSnapshot = await db!
                .collection(COLLECTIONS.INVOICES)
                .where('clientId', '==', client.id)
                .where('date', '>=', startDate)
                .where('date', '<=', endDate)
                .get();

            const invoices = invoicesSnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length;
            const pendingInvoices = invoices.filter((inv: any) => inv.status === 'sent' || inv.status === 'overdue').length;

            return {
                clientId: client.id,
                clientName: client.name,
                email: client.email,
                company: client.company,
                totalRevenue,
                totalInvoices: invoices.length,
                paidInvoices,
                pendingInvoices,
                status: client.status,
            };
        })
    );

    // Sort by revenue
    clientReports.sort((a, b) => b.totalRevenue - a.totalRevenue);

    const totalRevenue = clientReports.reduce((sum, client) => sum + client.totalRevenue, 0);
    const activeClients = clientReports.filter(c => c.totalRevenue > 0).length;

    return {
        summary: {
            totalClients: clients.length,
            activeClients,
            totalRevenue,
        },
        clients: clientReports,
    };
}

// Tax Report
async function generateTaxReport(startDate: Date, endDate: Date) {
    const incomeReport = await generateIncomeReport(startDate, endDate);
    const expenseReport = await generateExpenseReport(startDate, endDate);

    // Get all invoices with tax
    const invoicesSnapshot = await db!
        .collection(COLLECTIONS.INVOICES)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .get();

    const invoices = invoicesSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
    }));

    const totalTaxCollected = invoices.reduce((sum, inv: any) => sum + (inv.tax || 0), 0);
    const totalTaxableAmount = invoices.reduce((sum, inv: any) => sum + (inv.subtotal || 0), 0);

    // Group by tax percentage
    const byTaxRate = invoices.reduce((acc: any, inv: any) => {
        const rate = inv.taxPercentage || 0;
        if (!acc[rate]) {
            acc[rate] = { count: 0, taxableAmount: 0, taxAmount: 0 };
        }
        acc[rate].count++;
        acc[rate].taxableAmount += inv.subtotal || 0;
        acc[rate].taxAmount += inv.tax || 0;
        return acc;
    }, {});

    return {
        summary: {
            totalIncome: incomeReport.totalIncome,
            totalExpense: expenseReport.totalExpense,
            netProfit: incomeReport.totalIncome - expenseReport.totalExpense,
            totalTaxCollected,
            totalTaxableAmount,
        },
        byTaxRate,
        invoices: invoices.map((inv: any) => ({
            invoiceNumber: inv.invoiceNumber,
            clientName: inv.clientName,
            date: inv.date?.toDate?.()?.toISOString() || inv.date,
            subtotal: inv.subtotal,
            taxPercentage: inv.taxPercentage,
            taxAmount: inv.tax,
            total: inv.total,
        })),
    };
}
