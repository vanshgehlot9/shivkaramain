import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";



import TechStack from "@/components/TechStack";
import CoreCapabilities from "@/components/CoreCapabilities";
import WhyUs from "@/components/WhyUs";
import CallToAction from "@/components/CallToAction";
import Insights from "@/components/Insights";

import Certifications from "@/components/Certifications";

import Results from "@/components/Results";
import CostEstimator from "@/components/CostEstimator";
import UnifiedProcess from "@/components/UnifiedProcess";

import FutureEngineering from "@/components/FutureEngineering";
import BootcampsHighlight from "@/components/BootcampsHighlight";

import Footer from "@/components/Footer";
import Stats from "@/components/Stats";

import Testimonials from "@/components/Testimonials";
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
