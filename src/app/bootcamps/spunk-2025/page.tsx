import { Metadata } from "next";
import Spunk2025Content from "./SpunkContent";

export const metadata: Metadata = {
    title: "SPUNK 2025: Premium Product Design Bootcamp | UI/UX Training by Shivkara",
    description: "Join SPUNK 2025, a premier Product Design Bootcamp by Shivkara Digital & Tech Lab. Master modern UI/UX workflows, design thinking, and practical problem-solving skills in this focused training initiative.",
    keywords: [
        "SPUNK 2025",
        "Product Design Bootcamp",
        "UI/UX Bootcamp",
        "User Experience Design Course",
        "Shivkara Digital",
        "Design Thinking Workshop",
        "UI/UX Training",
        "Product Design Workshop",
        "Shivkara Tech Lab"
    ],
    authors: [{ name: "Shivkara Digital & Tech Lab", url: "https://shivkara.com" }],
    creator: "Shivkara Digital",
    publisher: "Shivkara Digital",
    openGraph: {
        title: "SPUNK 2025: Premium Product Design Bootcamp",
        description: "Master modern product design with field-tested workflows. A focused initiative by Shivkara Digital & Tech Lab.",
        url: "https://shivkara.com/bootcamps/spunk-2025",
        siteName: "Shivkara Digital",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/bootcamp/bootcampheader.jpeg", // Ensure this path is accessible publicly in prod
                width: 1200,
                height: 630,
                alt: "SPUNK 2025 Product Design Bootcamp",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "SPUNK 2025: Product Design Bootcamp",
        description: "Join the next generation of design leaders at SPUNK 2025.",
        images: ["/bootcamp/bootcampheader.jpeg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "name": "SPUNK 2025 Product Design Bootcamp",
    "startDate": "2025-01-01", // Approximate/Placeholder date
    "endDate": "2025-01-05",   // Approximate/Placeholder date
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
        "@type": "Place",
        "name": "Shivkara Digital & Tech Lab HQ", // Or specific venue if known
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
        }
    },
    "image": [
        "https://shivkara.com/bootcamp/bootcampheader.jpeg"
    ],
    "description": "A focused product design bootcamp emphasizing modern design thinking, UI/UX workflows, and practical problem solving.",
    "organizer": {
        "@type": "Organization",
        "name": "Shivkara Digital & Tech Lab",
        "url": "https://shivkara.com"
    },
    "performer": {
        "@type": "Organization",
        "name": "Shivkara Digital & Tech Lab"
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Spunk2025Content />
        </>
    );
}
