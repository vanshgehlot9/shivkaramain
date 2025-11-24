import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

export async function GET(request: Request) {
  try {
    // Check if Admin SDK is available
    if (!adminDb) {
      // If Firebase Admin is not configured, return empty/default data
      // To enable full functionality, please configure Firebase Admin credentials
      // See: https://firebase.google.com/docs/admin/setup
      return NextResponse.json({
        success: true,
        data: {
          totalIncome: 0,
          totalExpense: 0,
          netProfit: 0,
          cashInHand: 0,
          activeProjects: 0,
          recentTransactions: [],
          monthlyData: [],
        },
        message: 'Firebase Admin not configured. Please set up FIREBASE_ADMIN_CREDENTIALS or FIREBASE_PROJECT_ID environment variables.',
      });
    }

    // Verify Authentication
    const user = await verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    // Get current month's date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Use Admin SDK
    const incomeSnapshot = await adminDb
      .collection(COLLECTIONS.INCOME)
      .where('date', '>=', startOfMonth)
      .where('date', '<=', endOfMonth)
      .get();

    const totalIncome = incomeSnapshot.docs.reduce((sum, doc: any) => {
      const data = doc.data();
      return sum + (data.amount || 0);
    }, 0);

    // Fetch expenses for current month
    const expensesSnapshot = await adminDb
      .collection(COLLECTIONS.EXPENSES)
      .where('date', '>=', startOfMonth)
      .where('date', '<=', endOfMonth)
      .get();

    const totalExpense = expensesSnapshot.docs.reduce((sum, doc: any) => {
      const data = doc.data();
      return sum + (data.amount || 0);
    }, 0);

    // Calculate net profit
    const netProfit = totalIncome - totalExpense;

    // Get cash in hand (from cashbook or calculate from transactions)
    const transactionsSnapshot = await adminDb
      .collection(COLLECTIONS.TRANSACTIONS)
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    let cashInHand = 0;
    if (!transactionsSnapshot.empty) {
      const lastTransaction = transactionsSnapshot.docs[0].data();
      cashInHand = lastTransaction.runningBalance || 0;
    }

    // Get active projects count (from clients with active invoices)
    const clientsSnapshot = await adminDb.collection(COLLECTIONS.CLIENTS).get();
    const activeProjects = clientsSnapshot.size;

    // Get recent transactions
    const recentTransactionsSnapshot = await adminDb
      .collection(COLLECTIONS.TRANSACTIONS)
      .orderBy('date', 'desc')
      .limit(5)
      .get();

    const recentTransactions = recentTransactionsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
    }));

    // Get monthly income vs expense data for last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthIncomeSnapshot = await adminDb
        .collection(COLLECTIONS.INCOME)
        .where('date', '>=', monthStart)
        .where('date', '<=', monthEnd)
        .get();

      const monthExpenseSnapshot = await adminDb
        .collection(COLLECTIONS.EXPENSES)
        .where('date', '>=', monthStart)
        .where('date', '<=', monthEnd)
        .get();

      const monthIncome = monthIncomeSnapshot.docs.reduce((sum, doc: any) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      const monthExpense = monthExpenseSnapshot.docs.reduce((sum, doc: any) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: monthIncome,
        expense: monthExpense,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netProfit,
        cashInHand,
        activeProjects,
        recentTransactions,
        monthlyData,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

