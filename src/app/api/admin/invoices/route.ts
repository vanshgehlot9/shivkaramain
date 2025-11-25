import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice } from '@/types/admin';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';
import { sendInvoiceEmail } from '@/lib/email';

// Helper function to generate invoice number
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');

  // Get the last invoice number for this month
  const snapshot = await db!
    .collection(COLLECTIONS.INVOICES)
    .orderBy('invoiceNumber', 'desc')
    .limit(1)
    .get();

  let sequence = 1;
  if (!snapshot.empty) {
    const lastInvoice = snapshot.docs[0].data().invoiceNumber;
    const lastSequence = parseInt(lastInvoice.split('-').pop() || '0');
    sequence = lastSequence + 1;
  }

  return `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
}

// GET - Fetch all invoices with filtering
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
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query: any = db.collection(COLLECTIONS.INVOICES).orderBy('date', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }

    if (clientId) {
      query = query.where('clientId', '==', clientId);
    }

    if (startDate && endDate) {
      query = query.where('date', '>=', new Date(startDate));
      query = query.where('date', '<=', new Date(endDate));
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const invoices: Invoice[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
      dueDate: doc.data().dueDate?.toDate?.()?.toISOString() || doc.data().dueDate,
      paidDate: doc.data().paidDate?.toDate?.()?.toISOString() || doc.data().paidDate,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    })) as Invoice[];

    // Calculate statistics
    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const paidAmount = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    const pendingAmount = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        data: invoices,
        count: invoices.length,
        stats: {
          totalAmount,
          paidAmount,
          pendingAmount,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new invoice
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
    const {
      clientId,
      clientName,
      date,
      dueDate,
      items,
      taxPercentage,
      discount,
      notes,
      terms,
      status,
    } = body;

    // Validate required fields
    if (!clientId || !clientName || !date || !dueDate || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: clientId, clientName, date, dueDate, items' },
        { status: 400 }
      );
    }

    // Validate client exists
    const clientDoc = await db.collection(COLLECTIONS.CLIENTS).doc(clientId).get();
    if (!clientDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Calculate amounts
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.rate);
    }, 0);

    const tax = (subtotal * (taxPercentage || 0)) / 100;
    const total = subtotal + tax - (discount || 0);

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Validate status
    const validStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
    const invoiceStatus = status || 'draft';
    if (!validStatuses.includes(invoiceStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Create invoice record
    const invoiceData: Invoice = {
      invoiceNumber,
      clientId,
      clientName,
      date: new Date(date),
      dueDate: new Date(dueDate),
      status: invoiceStatus,
      items,
      subtotal,
      tax,
      taxPercentage: taxPercentage || 0,
      discount: discount || 0,
      total,
      notes: notes || null,
      terms: terms || null,
      paidAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection(COLLECTIONS.INVOICES).add(invoiceData);

    // Send email if status is sent
    if (invoiceStatus === 'sent') {
      const clientData = clientDoc.data();
      if (clientData && clientData.email) {
        await sendInvoiceEmail(invoiceData, clientData.email);
      }
    }

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...invoiceData },
      message: 'Invoice created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update invoice
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
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Check if invoice exists
    const invoiceDoc = await db.collection(COLLECTIONS.INVOICES).doc(id).get();
    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const currentInvoice = invoiceDoc.data() as Invoice;

    // Recalculate amounts if items changed
    let updatedInvoiceData = { ...updateData };
    if (updateData.items) {
      const subtotal = updateData.items.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.rate);
      }, 0);

      const taxPercentage = updateData.taxPercentage !== undefined ? updateData.taxPercentage : currentInvoice.taxPercentage;
      const discount = updateData.discount !== undefined ? updateData.discount : currentInvoice.discount;
      const tax = (subtotal * taxPercentage) / 100;
      const total = subtotal + tax - discount;

      updatedInvoiceData = {
        ...updatedInvoiceData,
        subtotal,
        tax,
        total,
      };
    }

    // If status is being changed to 'paid', record payment
    if (updateData.status === 'paid' && currentInvoice.status !== 'paid') {
      updatedInvoiceData.paidDate = new Date();
      updatedInvoiceData.paidAmount = currentInvoice.total;

      // Create income record
      await db.collection(COLLECTIONS.INCOME).add({
        date: new Date(),
        clientName: currentInvoice.clientName,
        projectName: `Invoice ${currentInvoice.invoiceNumber}`,
        paymentMode: 'bank_transfer',
        amount: currentInvoice.total,
        invoiceId: id,
        description: `Payment for invoice ${currentInvoice.invoiceNumber}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create transaction record
      const lastTransactionSnapshot = await db
        .collection(COLLECTIONS.TRANSACTIONS)
        .orderBy('date', 'desc')
        .limit(1)
        .get();

      let runningBalance = currentInvoice.total;
      if (!lastTransactionSnapshot.empty) {
        const lastTransaction = lastTransactionSnapshot.docs[0].data();
        runningBalance = (lastTransaction.runningBalance || 0) + currentInvoice.total;
      }

      await db.collection(COLLECTIONS.TRANSACTIONS).add({
        date: new Date(),
        type: 'income',
        cashIn: currentInvoice.total,
        cashOut: 0,
        runningBalance,
        note: `Invoice Payment: ${currentInvoice.invoiceNumber} - ${currentInvoice.clientName}`,
        invoiceId: id,
        createdAt: new Date(),
      });
    }

    // Update invoice
    const finalUpdateData = {
      ...updatedInvoiceData,
      date: updatedInvoiceData.date ? new Date(updatedInvoiceData.date) : currentInvoice.date,
      dueDate: updatedInvoiceData.dueDate ? new Date(updatedInvoiceData.dueDate) : currentInvoice.dueDate,
      updatedAt: new Date(),
    };

    await db.collection(COLLECTIONS.INVOICES).doc(id).update(finalUpdateData);

    // Send email if status changed to sent
    if (updateData.status === 'sent' && currentInvoice.status !== 'sent') {
      const clientDocForEmail = await db.collection(COLLECTIONS.CLIENTS).doc(currentInvoice.clientId).get();
      const clientData = clientDocForEmail.data();
      if (clientData && clientData.email) {
        const fullInvoice = { ...currentInvoice, ...finalUpdateData };
        await sendInvoiceEmail(fullInvoice, clientData.email);
      }
    }

    return NextResponse.json({
      success: true,
      data: { id, ...finalUpdateData },
      message: 'Invoice updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete invoice
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
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Check if invoice exists
    const invoiceDoc = await db.collection(COLLECTIONS.INVOICES).doc(id).get();
    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoice = invoiceDoc.data() as Invoice;

    // Don't allow deletion of paid invoices
    if (invoice.status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete paid invoices. Please cancel it first.' },
        { status: 409 }
      );
    }

    // Delete invoice
    await db.collection(COLLECTIONS.INVOICES).doc(id).delete();

    // Delete associated transactions and income records
    const transactionSnapshot = await db
      .collection(COLLECTIONS.TRANSACTIONS)
      .where('invoiceId', '==', id)
      .get();

    const incomeSnapshot = await db
      .collection(COLLECTIONS.INCOME)
      .where('invoiceId', '==', id)
      .get();

    const deletePromises = [
      ...transactionSnapshot.docs.map(doc => doc.ref.delete()),
      ...incomeSnapshot.docs.map(doc => doc.ref.delete()),
    ];

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
