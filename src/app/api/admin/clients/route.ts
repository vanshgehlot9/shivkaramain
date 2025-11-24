import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client } from '@/types/admin';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

// GET - Fetch all clients with filtering and pagination
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
    const search = searchParams.get('search');

    let query: any = db.collection(COLLECTIONS.CLIENTS).orderBy('createdAt', 'desc');

    // Apply status filter
    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    let clients: Client[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    })) as Client[];

    // Apply search filter (client-side for now)
    if (search) {
      const searchLower = search.toLowerCase();
      clients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.company?.toLowerCase().includes(searchLower) ||
        client.phone?.includes(search)
      );
    }

    // Calculate revenue for each client
    for (const client of clients) {
      const incomeSnapshot = await db
        .collection(COLLECTIONS.INCOME)
        .where('clientName', '==', client.name)
        .get();

      const totalRevenue = incomeSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      client.totalRevenue = totalRevenue;
      client.totalProjects = incomeSnapshot.size;
    }

    // Calculate global summary
    const totalRevenue = clients.reduce((sum, client) => sum + (client.totalRevenue || 0), 0);
    const summary = {
      totalClients: clients.length,
      totalOutstanding: 0, // TODO: Calculate from invoices
      totalRevenue,
    };

    return NextResponse.json({
      success: true,
      data: {
        data: clients,
        summary,
      },
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new client
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
    const { name, email, phone, company, address, gstNumber, status } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if client with same email already exists
    const existingClientSnapshot = await db
      .collection(COLLECTIONS.CLIENTS)
      .where('email', '==', email)
      .get();

    if (!existingClientSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Client with this email already exists' },
        { status: 409 }
      );
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending'];
    const clientStatus = status || 'active';
    if (!validStatuses.includes(clientStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Create client record
    const clientData: Client = {
      name,
      email,
      phone,
      company: company || null,
      address: address || null,
      gstNumber: gstNumber || null,
      status: clientStatus,
      totalProjects: 0,
      totalRevenue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection(COLLECTIONS.CLIENTS).add(clientData);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...clientData },
      message: 'Client created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update client
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
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Check if client exists
    const clientDoc = await db.collection(COLLECTIONS.CLIENTS).doc(id).get();
    if (!clientDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // If email is being updated, check for duplicates
    if (updateData.email && updateData.email !== clientDoc.data()?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }

      const existingClientSnapshot = await db
        .collection(COLLECTIONS.CLIENTS)
        .where('email', '==', updateData.email)
        .get();

      if (!existingClientSnapshot.empty) {
        return NextResponse.json(
          { success: false, error: 'Client with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Update client
    const updatedData = {
      ...updateData,
      updatedAt: new Date(),
    };

    await db.collection(COLLECTIONS.CLIENTS).doc(id).update(updatedData);

    return NextResponse.json({
      success: true,
      data: { id, ...updatedData },
      message: 'Client updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete client
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
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Check if client exists
    const clientDoc = await db.collection(COLLECTIONS.CLIENTS).doc(id).get();
    if (!clientDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Check if client has associated invoices
    const invoicesSnapshot = await db
      .collection(COLLECTIONS.INVOICES)
      .where('clientId', '==', id)
      .limit(1)
      .get();

    if (!invoicesSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete client with existing invoices. Please delete or reassign invoices first.' },
        { status: 409 }
      );
    }

    // Delete client
    await db.collection(COLLECTIONS.CLIENTS).doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
