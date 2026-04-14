import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin-config";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth-admin";

interface Params {
    params: Promise<{ id: string }>;
}

// PATCH - update internship application status
export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorizedResponse();

    try {
        if (!db) {
            return NextResponse.json({ success: false, error: "Database not initialized" }, { status: 500 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!id || !status) {
            return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
        }

        if (!["pending", "approved", "declined"].includes(status)) {
            return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
        }

        // Handle legacy entries that were stored only in leads
        if (id.startsWith("legacy-")) {
            const leadId = id.replace("legacy-", "");
            await db.collection(COLLECTIONS.LEADS).doc(leadId).update({
                status: status === "pending" ? "new" : status,
                updatedAt: new Date(),
            });
        } else {
            await db.collection(COLLECTIONS.INTERNSHIP_APPLICATIONS).doc(id).update({
                status,
                updatedAt: new Date(),
            });
        }

        return NextResponse.json({ success: true, message: "Application status updated" });
    } catch (error: any) {
        console.error("Error updating internship application:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
