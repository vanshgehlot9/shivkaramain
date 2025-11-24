import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Return and Refund Policy | Shivkara Digital",
    description: "Understand Shivkara Digital's policy regarding returns and refunds for our services.",
    openGraph: {
        title: "Return and Refund Policy | Shivkara Digital",
        description: "Our policies on refunds and cancellations.",
        url: "https://shivkaradigital.com/return-and-refund",
    },
};

export default function RefundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
