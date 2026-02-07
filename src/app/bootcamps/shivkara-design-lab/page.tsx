import { Metadata } from "next";
import DesignLabContent from "./DesignLabContent";

export const metadata: Metadata = {
    title: "Shivkara Design Lab: Premier Virtual UI/UX Bootcamp",
    description: "A studio-style industry simulation designed to make students deployable on real projects. Learn complete UI/UX in 4 weeks.",
    keywords: [
        "Shivkara Design Lab",
        "UI/UX Bootcamp",
        "Product Design Course",
        "Virtual Design Internship",
        "Figma Training",
        "Industrial Training",
        "Design System"
    ],
    authors: [{ name: "Shivkara Digital & Tech Lab", url: "https://www.shivkaradigital.com" }],
    openGraph: {
        title: "Shivkara Design Lab: Only Access, Status, Priority.",
        description: "Not a typical course. An industry simulation for serious designers.",
        url: "https://www.shivkaradigital.com/bootcamps/shivkara-design-lab",
        siteName: "Shivkara Digital",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://www.shivkaradigital.com/bootcamp/bootcampheader.jpeg", // Using generic for now, ideally specific
                width: 1200,
                height: 630,
                alt: "Shivkara Design Lab",
            },
        ],
    },
};

export default function Page() {
    return <DesignLabContent />;
}
