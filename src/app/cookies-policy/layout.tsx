import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookies Policy | Shivkara Digital",
    description: "Learn about how Shivkara Digital uses cookies to enhance your browsing experience.",
    openGraph: {
        title: "Cookies Policy | Shivkara Digital",
        description: "Information about our use of cookies and tracking technologies.",
        url: "https://shivkaradigital.com/cookies-policy",
    },
};

export default function CookiesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
