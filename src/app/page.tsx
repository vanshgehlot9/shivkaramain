import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Team from "@/components/Team";

import TechStack from "@/components/TechStack";
import Industries from "@/components/Industries";
import WhyUs from "@/components/WhyUs";
import CallToAction from "@/components/CallToAction";
import Insights from "@/components/Insights";
import Clients from "@/components/Clients";
import Certifications from "@/components/Certifications";
import EngagementModels from "@/components/EngagementModels";
import Values from "@/components/Values";
import Security from "@/components/Security";
import Methodology from "@/components/Methodology";
import Results from "@/components/Results";
import FoundersNote from "@/components/FoundersNote";
import CostEstimator from "@/components/CostEstimator";
import OnboardingRoadmap from "@/components/OnboardingRoadmap";
import TechGlossary from "@/components/TechGlossary";

import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
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
      <Clients />
      <Results />
      <Stats />
      <Values />
      <WhyUs />
      <Certifications />
      <Services />
      <Industries />
      <EngagementModels />
      <OnboardingRoadmap />
      <Methodology />
      <Security />
      <TechStack />
      <TechGlossary />
      <Work />
      <Process />
      <Testimonials />
      <CostEstimator />
      <FoundersNote />
      <Team />
      <Insights />
      <FAQ />
      <CallToAction />
      <Contact />
      <Footer />
    </main>
  );
}
