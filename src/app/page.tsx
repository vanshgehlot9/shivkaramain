import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import CoreCapabilities from "@/components/CoreCapabilities";
import WhyUs from "@/components/WhyUs";
import CallToAction from "@/components/CallToAction";
import Insights from "@/components/Insights";
import Certifications from "@/components/Certifications";
import Results from "@/components/Results";
import UnifiedProcess from "@/components/UnifiedProcess";
import FutureEngineering from "@/components/FutureEngineering";
import BootcampsHighlight from "@/components/BootcampsHighlight";
import Stats from "@/components/Stats";
import ScrollProgress from "@/components/ScrollProgress";
import NoiseBackground from "@/components/ui/NoiseBackground";
import LeadPopup from "@/components/LeadPopup";

// Dynamic imports for below-the-fold heavy components (code-splitting)
const CostEstimator = dynamic(() => import("@/components/CostEstimator"), {
  loading: () => <div className="min-h-[400px] bg-black" />
});
const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  loading: () => <div className="min-h-[400px] bg-black" />
});
const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => <div className="min-h-[300px] bg-black" />
});
const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div className="min-h-[300px] bg-black" />
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[200px] bg-black" />
});

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
      <LeadPopup />
      <NoiseBackground />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Stats />
      <TechStack />
      <Certifications />
      <CoreCapabilities />
      <UnifiedProcess />
      <Results />
      <BootcampsHighlight />
      <FutureEngineering />
      <Testimonials />
      <CostEstimator />
      <WhyUs />
      <Insights />
      <FAQ />
      <CallToAction />
      <Contact />
      <Footer />
    </main>
  );
}
