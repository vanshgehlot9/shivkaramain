import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Income } from '@/types/admin';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

// GET - Fetch all income records with filtering and pagination
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
    const clientName = searchParams.get('clientName');
    const paymentMode = searchParams.get('paymentMode');

    let query: any = db.collection(COLLECTIONS.INCOME).orderBy('date', 'desc');

    // Apply filters
    if (startDate && endDate) {
      query = query.where('date', '>=', new Date(startDate));
      query = query.where('date', '<=', new Date(endDate));
    }

    if (clientName) {
      query = query.where('clientName', '==', clientName);
    }

    if (paymentMode) {
      query = query.where('paymentMode', '==', paymentMode);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const income: Income[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    })) as Income[];

    // Calculate statistics
    const total = income.reduce((sum, item) => sum + (item.amount || 0), 0);
    const byClient = income.reduce((acc, item) => {
      const client = item.clientName || 'Unknown';
      acc[client] = (acc[client] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    const byPaymentMode = income.reduce((acc, item) => {
      const mode = item.paymentMode || 'unknown';
      acc[mode] = (acc[mode] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        data: income,
        total,
        count: income.length,
        byClient,
        byPaymentMode,
      },
    });
  } catch (error: any) {
    console.error('Error fetching income:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new income record
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
    const { date, clientName, projectName, paymentMode, amount, billProofUrl, invoiceId, description } = body;

    // Validate required fields
    if (!date || !clientName || !projectName || !paymentMode || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, clientName, projectName, paymentMode, amount' },
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

    // Create income record
    const incomeData: Income = {
      date: new Date(date),
      clientName,
      projectName,
      paymentMode,
      amount: parseFloat(amount),
      billProofUrl: billProofUrl || null,
      invoiceId: invoiceId || null,
      description: description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection(COLLECTIONS.INCOME).add(incomeData);

    // Create transaction record for cashbook
    const lastTransactionSnapshot = await db
      .collection(COLLECTIONS.TRANSACTIONS)
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    let runningBalance = parseFloat(amount);
    if (!lastTransactionSnapshot.empty) {
      const lastTransaction = lastTransactionSnapshot.docs[0].data();
      runningBalance = (lastTransaction.runningBalance || 0) + parseFloat(amount);
    }

    await db.collection(COLLECTIONS.TRANSACTIONS).add({
      date: new Date(date),
      type: 'income',
      cashIn: parseFloat(amount),
      cashOut: 0,
      runningBalance,
      note: `Income: ${clientName} - ${projectName}`,
      incomeId: docRef.id,
      invoiceId: invoiceId || null,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...incomeData },
      message: 'Income created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating income:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update income record
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
        { success: false, error: 'Income ID is required' },
        { status: 400 }
      );
    }

    // Check if income exists
    const incomeDoc = await db.collection(COLLECTIONS.INCOME).doc(id).get();
    if (!incomeDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Income record not found' },
        { status: 404 }
      );
    }

    // Update income
    const updatedData = {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : incomeDoc.data()?.date,
      amount: updateData.amount ? parseFloat(updateData.amount) : incomeDoc.data()?.amount,
      updatedAt: new Date(),
    };

    await db.collection(COLLECTIONS.INCOME).doc(id).update(updatedData);

    return NextResponse.json({
      success: true,
      data: { id, ...updatedData },
      message: 'Income updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating income:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete income record
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
        { success: false, error: 'Income ID is required' },
        { status: 400 }
      );
    }

    // Check if income exists
    const incomeDoc = await db.collection(COLLECTIONS.INCOME).doc(id).get();
    if (!incomeDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Income record not found' },
        { status: 404 }
      );
    }

    // Delete income
    await db.collection(COLLECTIONS.INCOME).doc(id).delete();

    // Delete associated transaction
    const transactionSnapshot = await db
      .collection(COLLECTIONS.TRANSACTIONS)
      .where('incomeId', '==', id)
      .get();

    const deletePromises = transactionSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: 'Income deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting income:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
