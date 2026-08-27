import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin-config";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth-admin";
import { generateUUID } from "@/lib/certificate-crypto";

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

        const sourceCollection = id.startsWith("legacy-") ? COLLECTIONS.LEADS : COLLECTIONS.INTERNSHIP_APPLICATIONS;
        const sourceId = id.startsWith("legacy-") ? id.replace("legacy-", "") : id;
        const sourceDocRef = db.collection(sourceCollection).doc(sourceId);
        const sourceDoc = await sourceDocRef.get();

        if (!sourceDoc.exists) {
            return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
        }

        const sourceData = sourceDoc.data() || {};
        const fullName = String(sourceData.name || sourceData.fullName || "").trim();
        const email = String(sourceData.email || "").trim().toLowerCase();
        const phone = String(sourceData.phone || "").trim();

        let existingStudentId: string | null = null;
        if (status === "approved") {
            if (!fullName || !email || !phone) {
                return NextResponse.json({
                    success: false,
                    error: "Approved internship candidate is missing required student fields",
                }, { status: 400 });
            }

            const existingStudents = await db
                .collection(COLLECTIONS.STUDENTS)
                .where("email", "==", email)
                .limit(1)
                .get();

            existingStudentId = existingStudents.empty ? null : existingStudents.docs[0].id;
        }

        await db.runTransaction(async (transaction) => {
            transaction.update(sourceDocRef, {
                status: status === "pending" ? (id.startsWith("legacy-") ? "new" : "pending") : status,
                updatedAt: new Date(),
            });

            if (status !== "approved") {
                return;
            }

            const studentPayload = {
                fullName,
                email,
                phone,
                externalId: sourceData.externalId || `INT-${sourceId.slice(0, 8).toUpperCase()}`,
                role: "student",
                enrolledAt: sourceData.approvedAt || new Date(),
                createdAt: sourceData.createdAt || new Date(),
                source: "internship_application",
                internshipApplicationId: sourceId,
                internshipDomain: sourceData.domain || "",
                internshipTimeline: sourceData.timeline || "",
                internshipCollegeOrCompany: sourceData.collegeOrCompany || "",
                internshipCity: sourceData.city || "",
                internshipStatus: "approved",
                approvedAt: new Date(),
                updatedAt: new Date(),
            };

            if (!existingStudentId) {
                const studentId = generateUUID();
                transaction.set(db!.collection(COLLECTIONS.STUDENTS).doc(studentId), {
                    id: studentId,
                    ...studentPayload,
                });
            } else {
                const studentDocRef = db!.collection(COLLECTIONS.STUDENTS).doc(existingStudentId);
                transaction.set(
                    studentDocRef,
                    {
                        ...studentPayload,
                        updatedAt: new Date(),
                    },
                    { merge: true }
                );
            }
        });

        return NextResponse.json({ success: true, message: "Application status updated" });
    } catch (error: unknown) {
        console.error("Error updating internship application:", error);
        const message = error instanceof Error ? error.message : "Failed to update internship application";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

// DELETE - delete internship application
export async function DELETE(request: NextRequest, { params }: Params) {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorizedResponse();

    try {
        if (!db) {
            return NextResponse.json({ success: false, error: "Database not initialized" }, { status: 500 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
        }

        // Handle legacy entries that were stored only in leads
        if (id.startsWith("legacy-")) {
            const leadId = id.replace("legacy-", "");
            await db.collection(COLLECTIONS.LEADS).doc(leadId).delete();
        } else {
            await db.collection(COLLECTIONS.INTERNSHIP_APPLICATIONS).doc(id).delete();
        }

        return NextResponse.json({ success: true, message: "Application deleted successfully" });
    } catch (error: unknown) {
        console.error("Error deleting internship application:", error);
        const message = error instanceof Error ? error.message : "Failed to delete internship application";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
