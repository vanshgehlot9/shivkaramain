import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping Policy | Shivkara Digital",
    description: "Learn about Shivkara Digital's shipping policies, processing times, and delivery estimates.",
    openGraph: {
        title: "Shipping Policy | Shivkara Digital",
        description: "Our policies on shipping and delivery.",
        url: "https://shivkaradigital.com/shipping-policy",
    },
};

export default function ShippingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
