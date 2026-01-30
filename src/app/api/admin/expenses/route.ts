import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Expense } from '@/types/admin';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

// In-memory fallback if DB is not available
let mockExpenses: Expense[] = [];

// GET - Fetch all expense records with filtering and pagination
export async function GET(request: NextRequest) {
  // Use mock auth if DB is not available (dev mode fallback)
  const auth = await verifyAuth(request);
  if (!auth && db) {
    return unauthorizedResponse();
  }

  try {
    if (!db) {
      console.warn("Database not initialized, returning mock data");
      // Return mock data
      const total = mockExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
      return NextResponse.json({
        success: true,
        data: mockExpenses,
        total,
        count: mockExpenses.length,
        categoryBreakdown: {}
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const paymentMode = searchParams.get('paymentMode');

    let query: any = db.collection(COLLECTIONS.EXPENSES).orderBy('date', 'desc');

    // Apply filters
    if (startDate && endDate) {
      query = query.where('date', '>=', new Date(startDate));
      query = query.where('date', '<=', new Date(endDate));
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    if (paymentMode) {
      query = query.where('paymentMode', '==', paymentMode);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const expenses: Expense[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    })) as Expense[];

    // Calculate statistics
    const total = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const cat = expense.category || 'other';
      acc[cat] = (acc[cat] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: expenses,
      total,
      count: expenses.length,
      categoryBreakdown,
    });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new expense record
export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth && db) {
    return unauthorizedResponse();
  }

  try {
    if (!db) {
      console.warn("Database not initialized, storing in memory");
      // Fallback to in-memory
      const body = await request.json();
      const { date, purpose, category, paymentMode, amount, billProofUrl, description, vendorName } = body;

      const newExpense: Expense = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(date),
        purpose,
        category,
        paymentMode,
        amount: parseFloat(amount),
        billProofUrl: billProofUrl || null,
        description: description || null,
        vendorName: vendorName || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockExpenses.push(newExpense);

      return NextResponse.json({
        success: true,
        data: newExpense,
        message: 'Expense created successfully (Mock)',
      }, { status: 201 });
    }

    const body = await request.json();
    const { date, purpose, category, paymentMode, amount, billProofUrl, description, vendorName } = body;

    // Validate required fields
    if (!date || !purpose || !category || !paymentMode || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, purpose, category, paymentMode, amount' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['office', 'marketing', 'salary', 'utilities', 'software', 'travel', 'other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate payment mode
    const validPaymentModes = ['cash', 'upi', 'bank_transfer', 'cheque', 'card'];
    if (!validPaymentModes.includes(paymentMode)) {
      return NextResponse.json(
        { success: false, error: `Invalid payment mode. Must be one of: ${validPaymentModes.join(', ')}` },
        { status: 400 }
      );
    }

    // Create expense record
    const expenseData: Expense = {
      date: new Date(date),
      purpose,
      category,
      paymentMode,
      amount: parseFloat(amount),
      billProofUrl: billProofUrl || null,
      description: description || null,
      vendorName: vendorName || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection(COLLECTIONS.EXPENSES).add(expenseData);

    // Create transaction record for cashbook
    const lastTransactionSnapshot = await db
      .collection(COLLECTIONS.TRANSACTIONS)
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    let runningBalance = 0;
    if (!lastTransactionSnapshot.empty) {
      const lastTransaction = lastTransactionSnapshot.docs[0].data();
      runningBalance = (lastTransaction.runningBalance || 0) - parseFloat(amount);
    } else {
      runningBalance = -parseFloat(amount);
    }

    await db.collection(COLLECTIONS.TRANSACTIONS).add({
      date: new Date(date),
      type: 'expense',
      cashIn: 0,
      cashOut: parseFloat(amount),
      runningBalance: Math.max(0, runningBalance),
      note: `Expense: ${purpose}${vendorName ? ` - ${vendorName}` : ''}`,
      expenseId: docRef.id,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...expenseData },
      message: 'Expense created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update expense record
export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    // Check if expense exists
    const expenseDoc = await db.collection(COLLECTIONS.EXPENSES).doc(id).get();
    if (!expenseDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Update expense
    const updatedData = {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : expenseDoc.data()?.date,
      amount: updateData.amount ? parseFloat(updateData.amount) : expenseDoc.data()?.amount,
      updatedAt: new Date(),
    };

    await db.collection(COLLECTIONS.EXPENSES).doc(id).update(updatedData);

    return NextResponse.json({
      success: true,
      data: { id, ...updatedData },
      message: 'Expense updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense record
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
        { success: false, error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    // Check if expense exists
    const expenseDoc = await db.collection(COLLECTIONS.EXPENSES).doc(id).get();
    if (!expenseDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Delete expense
    await db.collection(COLLECTIONS.EXPENSES).doc(id).delete();

    // Delete associated transaction
    const transactionSnapshot = await db
      .collection(COLLECTIONS.TRANSACTIONS)
      .where('expenseId', '==', id)
      .get();

    const deletePromises = transactionSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
