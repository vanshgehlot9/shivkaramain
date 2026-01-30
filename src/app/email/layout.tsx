import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Email Us | Shivkara Digital",
    description: "Get in touch with Shivkara Digital via email. We are here to answer your queries about web development and digital services.",
    openGraph: {
        title: "Email Us | Shivkara Digital",
        description: "Contact our team directly via email for project inquiries.",
        url: "https://shivkaradigital.com/email",
    },
};

export default function EmailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
