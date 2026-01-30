import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cancellation & Refunds Policy | Shivkara Digital",
    description: "Understand Shivkara Digital's policy regarding cancellations and refunds for our services.",
    openGraph: {
        title: "Cancellation & Refunds Policy | Shivkara Digital",
        description: "Our policies on refunds and cancellations.",
        url: "https://shivkaradigital.com/cancellation-and-refunds",
    },
};

export default function RefundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
