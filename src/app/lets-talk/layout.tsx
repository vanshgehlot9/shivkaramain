import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Start a Project | Shivkara Digital",
    description: "Ready to transform your digital presence? Contact Shivkara Digital for premium web development, app creation, and digital marketing services.",
    openGraph: {
        title: "Start a Project | Shivkara Digital",
        description: "Let's build the future together. Get in touch for custom software solutions.",
        url: "https://shivkaradigital.com/lets-talk",
    },
};

export default function LetsTalkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
