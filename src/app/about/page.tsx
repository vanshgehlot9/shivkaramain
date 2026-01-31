import Navbar from "@/components/Navbar";
import FoundersNote from "@/components/FoundersNote";
import Team from "@/components/Team";
import Values from "@/components/Values";
import Methodology from "@/components/Methodology";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import NoiseBackground from "@/components/ui/NoiseBackground";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Shivkara Digital | Our Mission, Team & Methodology",
    description: "Learn about Shivkara Digital's mission to architect digital excellence. Meet our team of experts and discover our execution-led methodology.",
    alternates: {
        canonical: "https://www.shivkaradigital.com/about",
    },
    openGraph: {
        title: "About Shivkara Digital | Our Mission, Team & Methodology",
        description: "Learn about Shivkara Digital's mission to architect digital excellence. Meet our team of experts and discover our execution-led methodology.",
        url: "https://www.shivkaradigital.com/about",
        images: [
            {
                url: "/shivkaralogo.jpg",
                width: 1200,
                height: 630,
                alt: "About Shivkara Digital",
            },
        ],
    }
};

export default function AboutPage() {
    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <NoiseBackground />
            <Navbar />
            <div className="pt-32">
                <FoundersNote />
                <Values />
                <Methodology />
                <Team />
            </div>
            <Contact />
            <Footer />
        </main>
    );
}
