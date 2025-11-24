import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Transaction } from '@/types/admin';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

// GET - Fetch cashbook transactions with filtering
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
    const limit = parseInt(searchParams.get('limit') || '100');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type'); // 'income' or 'expense'

    let query: any = db.collection(COLLECTIONS.TRANSACTIONS).orderBy('date', 'desc');

    // Apply filters
    if (startDate && endDate) {
      query = query.where('date', '>=', new Date(startDate));
      query = query.where('date', '<=', new Date(endDate));
    }

    if (type) {
      query = query.where('type', '==', type);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const transactions: Transaction[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    })) as Transaction[];

    // Calculate statistics
    const totalCashIn = transactions.reduce((sum, t) => sum + (t.cashIn || 0), 0);
    const totalCashOut = transactions.reduce((sum, t) => sum + (t.cashOut || 0), 0);
    const currentBalance = transactions.length > 0 ? transactions[0].runningBalance : 0;

    return NextResponse.json({
      success: true,
      data: {
        data: transactions,
        count: transactions.length,
        totalCashIn,
        totalCashOut,
        currentBalance,
        netFlow: totalCashIn - totalCashOut,
      },
    });
  } catch (error: any) {
    console.error('Error fetching cashbook:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create manual cashbook entry
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { date, type, amount, note } = body;

    // Validate required fields
    if (!date || !type || !amount || !note) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, type, amount, note' },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { success: false, error: 'Type must be either "income" or "expense"' },
        { status: 400 }
      );
    }

    // Get last transaction to calculate running balance
    const lastTransactionSnapshot = await db
      .collection(COLLECTIONS.TRANSACTIONS)
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    let runningBalance = 0;
    if (!lastTransactionSnapshot.empty) {
      const lastTransaction = lastTransactionSnapshot.docs[0].data();
      runningBalance = lastTransaction.runningBalance || 0;
    }

    // Calculate new balance
    const cashIn = type === 'income' ? parseFloat(amount) : 0;
    const cashOut = type === 'expense' ? parseFloat(amount) : 0;
    runningBalance = runningBalance + cashIn - cashOut;

    // Create transaction
    const transactionData: Transaction = {
      date: new Date(date),
      type,
      cashIn,
      cashOut,
      runningBalance: Math.max(0, runningBalance),
      note,
      createdAt: new Date(),
    };

    const docRef = await db.collection(COLLECTIONS.TRANSACTIONS).add(transactionData);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...transactionData },
      message: 'Transaction created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete transaction (admin only, use with caution)
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Check if transaction exists
    const transactionDoc = await db.collection(COLLECTIONS.TRANSACTIONS).doc(id).get();
    if (!transactionDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transaction = transactionDoc.data() as Transaction;

    // Don't allow deletion if linked to income/expense/invoice
    if (transaction.incomeId || transaction.expenseId || transaction.invoiceId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete transaction linked to income, expense, or invoice. Delete the source record instead.'
        },
        { status: 409 }
      );
    }

    // Delete transaction
    await db.collection(COLLECTIONS.TRANSACTIONS).doc(id).delete();

    // Note: In a production system, you'd want to recalculate all running balances
    // after this transaction. For now, we'll just delete it.

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully. Note: Running balances may need recalculation.',
    });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
