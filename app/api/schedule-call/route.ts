import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, slot, notes } = data;

    // Validate required fields
    if (!name || !email || !slot) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // Save to Firestore
    const submission = {
      type: "schedule_call",
      name,
      email,
      phone,
      slot,
      notes,
      timestamp: Timestamp.fromDate(new Date()),
      status: "pending"
    };

    await adminDb.collection("submissions").add(submission);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection("submissions")
      .where("type", "==", "schedule_call")
      .orderBy("timestamp", "desc")
      .get();

    const calls = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return new Response(JSON.stringify(calls), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
