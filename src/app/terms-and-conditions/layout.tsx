import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms and Conditions | Shivkara Digital",
    description: "Review the Terms and Conditions for using Shivkara Digital's services and website.",
    openGraph: {
        title: "Terms and Conditions | Shivkara Digital",
        description: "Legal terms governing the use of our services.",
        url: "https://shivkaradigital.com/terms-and-conditions",
    },
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
