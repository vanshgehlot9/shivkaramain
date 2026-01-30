
/**
 * Shivkara Digital - Payment System Configuration
 * This file contains the logic for the "Self-Driving" payment strategy.
 */

export const PAYMENT_CONFIG = {
    CURRENCY: "INR",
    GST_RATE: 0.18,
    LATE_FEE_PERCENTAGE: 0.05, // 5% per week
    COMPANY_DETAILS: {
        name: "Shivkara Digital",
        upiId: "shivkara@upi", // Placeholder
        accountName: "Shivkara Digital Solutions",
    }
};

export type ServiceType =
    | "WEBSITE"
    | "WEB_APP"
    | "MOBILE_APP"
    | "AMC"
    | "HOSTING"
    | "MARKETING"
    | "CONSULTING";

export type PaymentTerm =
    | "100_ADVANCE"
    | "70_30_SPLIT"
    | "50_50_SPLIT"
    | "MILESTONE_BASED"
    | "SUBSCRIPTION";

/**
 * Determines the best payment term based on Project Value and Service Type.
 * Implements the "Risk-Adjusted" Advance Percentage strategy.
 */
export function getRecommendedPaymentTerm(totalValue: number, serviceType: ServiceType): PaymentTerm {
    // Recurring services are always Subscription or 100% Advance
    if (["AMC", "HOSTING", "MARKETING"].includes(serviceType)) {
        return "SUBSCRIPTION"; // Or 100_ADVANCE if one-time
    }

    // Micro Projects (< ₹20k)
    if (totalValue < 20000) {
        return "100_ADVANCE";
    }

    // Small Projects (₹20k - ₹50k)
    if (totalValue >= 20000 && totalValue < 50000) {
        return "70_30_SPLIT";
    }

    // Medium Projects (₹50k - ₹2L)
    if (totalValue >= 50000 && totalValue < 200000) {
        return "50_50_SPLIT";
    }

    // Large Projects (₹2L+)
    return "MILESTONE_BASED";
}

/**
 * Calculates the advance amount required based on the payment term.
 */
export function calculateAdvanceAmount(totalValue: number, term: PaymentTerm): number {
    switch (term) {
        case "100_ADVANCE":
        case "SUBSCRIPTION":
            return totalValue;
        case "70_30_SPLIT":
            return totalValue * 0.70;
        case "50_50_SPLIT":
            return totalValue * 0.50;
        case "MILESTONE_BASED":
            return totalValue * 0.40; // 40% Start for large projects
        default:
            return totalValue;
    }
}

/**
 * Generates a breakdown of milestones for a given project.
 */
export function generateMilestoneBreakdown(totalValue: number, term: PaymentTerm) {
    const advance = calculateAdvanceAmount(totalValue, term);
    const remaining = totalValue - advance;

    if (term === "100_ADVANCE" || term === "SUBSCRIPTION") {
        return [
            { name: "Full Payment", amount: totalValue, percentage: 100, due: "Immediate" }
        ];
    }

    if (term === "70_30_SPLIT") {
        return [
            { name: "Advance / Kickoff", amount: advance, percentage: 70, due: "Immediate" },
            { name: "Project Completion", amount: remaining, percentage: 30, due: "On Delivery" }
        ];
    }

    if (term === "50_50_SPLIT") {
        return [
            { name: "Advance / Kickoff", amount: advance, percentage: 50, due: "Immediate" },
            { name: "Project Completion", amount: remaining, percentage: 50, due: "On Delivery" }
        ];
    }

    if (term === "MILESTONE_BASED") {
        // 40 - 30 - 30 Split
        const milestone2 = totalValue * 0.30;
        const milestone3 = totalValue * 0.30;
        return [
            { name: "Kickoff & Strategy", amount: advance, percentage: 40, due: "Immediate" },
            { name: "Design Approval / Alpha", amount: milestone2, percentage: 30, due: "Mid-Project" },
            { name: "Final Delivery & Go-Live", amount: milestone3, percentage: 30, due: "Pre-Handover" }
        ];
    }

    return [];
}

export const MINIMUM_BOOKING_AMOUNT = 4000;

/**
 * Generates a specific breakdown for the "Booking Mode" (₹4000 Advance).
 */
export function generateBookingBreakdown(totalValue: number) {
    // If total value is less than booking amount, just charge full
    if (totalValue <= MINIMUM_BOOKING_AMOUNT) {
        return [
            { name: "Full Project Payment", amount: totalValue, percentage: 100, due: "Immediate" }
        ];
    }

    const remaining = totalValue - MINIMUM_BOOKING_AMOUNT;
    const remainingPercentage = Math.round((remaining / totalValue) * 100);
    const bookingPercentage = 100 - remainingPercentage; // Approx

    return [
        { name: "Booking & Commitment Fee", amount: MINIMUM_BOOKING_AMOUNT, percentage: bookingPercentage, due: "Immediate (Non-Refundable)" },
        { name: "Project Completion Balance", amount: remaining, percentage: remainingPercentage, due: "On Delivery" }
    ];
}
