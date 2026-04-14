import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin-config";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { sendLeadNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        if (!db) {
            return NextResponse.json(
                { success: false, error: "Database not initialized" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const {
            name,
            email,
            phone,
            domain,
            timeline,
            collegeOrCompany,
            city,
            message,
        } = body;

        if (!name || !email || !phone || !domain || !timeline) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const internshipApplication = {
            name,
            email,
            phone,
            domain,
            timeline,
            collegeOrCompany: collegeOrCompany || "",
            city: city || "",
            message: message || "Internship application submitted from website.",
            status: "pending",
            source: "website_internship_2026",
            createdAt: new Date(),
        };

        const docRef = await db.collection(COLLECTIONS.INTERNSHIP_APPLICATIONS).add(internshipApplication);

        // Optional mirror entry to lead pipeline for existing admin workflows
        await db.collection(COLLECTIONS.LEADS).add({
            name,
            email,
            phone,
            company: collegeOrCompany || "",
            budget: `${domain} | ${timeline}`,
            domain,
            timeline,
            city: city || "",
            message: message || "Internship application submitted from website.",
            status: "new",
            source: "website_internship_2026",
            internshipApplicationId: docRef.id,
            createdAt: new Date(),
        });

        await sendLeadNotification({
            name: internshipApplication.name,
            email: internshipApplication.email,
            company: `${internshipApplication.collegeOrCompany || "N/A"} | ${internshipApplication.city || "N/A"}`,
            budget: `${internshipApplication.domain} | ${internshipApplication.timeline}`,
            message: internshipApplication.message,
            source: internshipApplication.source,
        });

        return NextResponse.json(
            {
                success: true,
                data: { id: docRef.id, ...internshipApplication },
                message: "Internship application submitted successfully",
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error submitting internship form:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
