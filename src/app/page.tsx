import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Team from "@/components/Team";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Marquee from "@/components/Marquee";
import FAQ from "@/components/FAQ";
import ScrollProgress from "@/components/ScrollProgress";
import Contact from "@/components/Contact";
import NoiseBackground from "@/components/ui/NoiseBackground";
import LeadPopup from "@/components/LeadPopup";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
      <LeadPopup />
      <NoiseBackground />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Services />
      <Process />
      <Work />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <Team />
      <Footer />
    </main>
  );
}
