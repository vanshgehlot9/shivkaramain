import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Shivkara Digital",
    description: "Read our Privacy Policy to understand how Shivkara Digital collects, uses, and protects your personal information.",
    openGraph: {
        title: "Privacy Policy | Shivkara Digital",
        description: "Our commitment to protecting your privacy and data.",
        url: "https://shivkaradigital.com/privacy-policy",
    },
};

export default function PrivacyPolicyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
