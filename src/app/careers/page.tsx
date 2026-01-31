import { Metadata } from "next";
import CareersContent from "./CareersContent";

export const metadata: Metadata = {
    title: "Careers & Student Internships | Shivkara Digital | Industrial Training Jodhpur",
    description: "Launch your career with Shivkara Digital. We offer premium Summer Internships, Industrial Training, and Live Project experience in Web Development, UI/UX, and AI.",
    keywords: ["Student Internship", "Summer Training Jodhpur", "Industrial Training", "Web Development Internship", "UI/UX Course", "Shivkara Careers"],
    alternates: {
        canonical: "https://www.shivkaradigital.com/careers",
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": "Summer Internship & Industrial Training '26",
    "description": "A comprehensive 3-month industrial training program for students in Web Development, UI/UX Design, and AI.",
    "provider": {
        "@type": "Organization",
        "name": "Shivkara Digital",
        "url": "https://www.shivkaradigital.com"
    },
    "educationalProgramMode": "https://schema.org/Hybrid",
    "startDate": "2026-05-01",
    "endDate": "2026-07-30",
    "occupationalCategory": "Software Developer"
};

export default function CareersPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CareersContent />
        </>
    );
}
