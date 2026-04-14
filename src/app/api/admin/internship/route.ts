import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin-config";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth-admin";

// GET - list internship applications with pagination and optional filtering
export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorizedResponse();

    try {
        if (!db) {
            return NextResponse.json({ success: false, error: "Database not initialized" }, { status: 500 });
        }

        // Get query parameters
        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
        const limit = Math.min(50, parseInt(url.searchParams.get("limit") || "20")); // Max 50 per page
        const search = url.searchParams.get("search")?.toLowerCase() || "";
        const offset = (page - 1) * limit;

        // Fetch only primary internship applications (much faster)
        const snapshot = await db
            .collection(COLLECTIONS.INTERNSHIP_APPLICATIONS)
            .orderBy("createdAt", "desc")
            .limit(limit * 3) // Fetch extra to account for filtering
            .get();

        let data = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString?.() || doc.data().updatedAt,
        }));

        // Apply search filter if provided
        if (search) {
            data = data.filter((item: any) => {
                const searchFields = `${item.name || ""} ${item.email || ""} ${item.domain || ""} ${item.timeline || ""}`.toLowerCase();
                return searchFields.includes(search);
            });
        }

        // Apply pagination
        const total = data.length;
        const paginatedData = data.slice(offset, offset + limit);

        return NextResponse.json({
            success: true,
            data: paginatedData,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error("Error fetching internship applications:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
