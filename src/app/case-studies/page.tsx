import Navbar from "@/components/Navbar";
import Results from "@/components/Results";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import NoiseBackground from "@/components/ui/NoiseBackground";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Case Studies | Shivkara Digital | Proven Results & Portfolio",
    description: "See how Shivkara Digital delivers proven results. Browse our portfolio of high-impact websites, mobile apps, and digital transformation projects.",
    alternates: {
        canonical: "https://www.shivkaradigital.com/case-studies",
    },
    openGraph: {
        title: "Case Studies | Shivkara Digital | Proven Results & Portfolio",
        description: "See how Shivkara Digital delivers proven results. Browse our portfolio of high-impact websites, mobile apps, and digital transformation projects.",
        url: "https://www.shivkaradigital.com/case-studies",
        images: [
            {
                url: "/shivkaralogo.jpg",
                width: 1200,
                height: 630,
                alt: "Shivkara Digital Case Studies",
            },
        ],
    }
};

export default function CaseStudiesPage() {
    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <NoiseBackground />
            <Navbar />
            <div className="pt-32">
                <Results />
                <Testimonials />
            </div>
            <Contact />
            <Footer />
        </main>
    );
}
