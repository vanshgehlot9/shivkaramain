"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Code, 
  Smartphone, 
  Palette, 
  Zap, 
  Shield, 
  Users, 
  Star,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  CheckCircle,
  Award,
  Globe,
  Database,
  Cloud,
  Lock,
  BarChart3,
  Target,
  Lightbulb,
  Settings,
  Cpu,
  Monitor,
  Server,
  Heart,
  Eye,
  Calendar,
  MessageSquare,
  Quote,
  ThumbsUp,
  Menu,
  PlayCircle
} from "lucide-react";
import Image from 'next/image';
import { projects } from "../lib/projects";
import TrackableLink from '../components/TrackableLink';
import { trackCTAClick } from "../lib/analytics";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaAws, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiMongodb, SiPostgresql, SiRedis, SiKubernetes, SiNextdotjs, SiFlutter } from 'react-icons/si';
import { Modal } from "../components/ui/modal";
import { ContactForm } from "../components/ContactForm";
import { OfferClaimForm, PlanSelectionForm } from "../components/SpecialForms";
import { LeadCapturePopup, useLeadCapturePopup } from "../components/LeadCapturePopup";
import { WhatsAppChat } from "../components/WhatsAppChat";
import Footer from "../components/Footer";
import FloatingActionButton from "../components/FloatingActionButton";
import Header from "../components/Header";

const services = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Custom Software Development",
    description: "Tailored software solutions designed to meet your specific business requirements and drive growth.",
    features: ["Enterprise Applications", "Custom APIs", "Database Design", "System Integration"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that enhance customer engagement and business efficiency.",
    features: ["iOS & Android Apps", "Cross-platform Solutions", "App Maintenance", "Performance Optimization"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Web Design & Development",
    description: "Professional websites and web applications that establish your brand and convert visitors to customers.",
    features: ["Responsive Design", "E-commerce Solutions", "CMS Development", "SEO Optimization"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Digital Transformation",
    description: "Comprehensive digital solutions to modernize your business processes and improve operational efficiency.",
    features: ["Process Automation", "Cloud Migration", "Legacy System Updates", "Digital Strategy"],
    color: "from-orange-500 to-red-500"
  }
];

const technologies = [
  { name: "React", icon: <FaReact className="w-6 h-6" />, color: "text-blue-500" },
  { name: "TypeScript", icon: <SiTypescript className="w-6 h-6" />, color: "text-blue-600" },
  { name: "Node.js", icon: <FaNodeJs className="w-6 h-6" />, color: "text-green-500" },
  { name: "Python", icon: <FaPython className="w-6 h-6" />, color: "text-yellow-500" },
  { name: "Java", icon: <FaJava className="w-6 h-6" />, color: "text-red-500" },
  { name: "MongoDB", icon: <SiMongodb className="w-6 h-6" />, color: "text-green-600" },
  { name: "PostgreSQL", icon: <SiPostgresql className="w-6 h-6" />, color: "text-blue-700" },
  { name: "AWS", icon: <FaAws className="w-6 h-6" />, color: "text-orange-500" },
  { name: "Google Cloud", icon: <FaGoogle className="w-6 h-6" />, color: "text-blue-400" },
  { name: "Docker", icon: <FaDocker className="w-6 h-6" />, color: "text-blue-400" },
  { name: "Kubernetes", icon: <SiKubernetes className="w-6 h-6" />, color: "text-blue-600" },
  { name: "Next.js", icon: <SiNextdotjs className="w-6 h-6" />, color: "text-black" }
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "We analyze your requirements, define project scope, and create a comprehensive roadmap.",
    icon: <Lightbulb className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: "02", 
    title: "Design & Prototyping",
    description: "Our team creates intuitive designs and interactive prototypes for your approval.",
    icon: <Palette className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    step: "03",
    title: "Development & Testing", 
    description: "We build your solution using modern technologies with rigorous testing throughout.",
    icon: <Code className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500"
  },
  {
    step: "04",
    title: "Deployment & Support",
    description: "We deploy your solution and provide ongoing maintenance and support.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-orange-500 to-red-500"
  }
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechCorp India",
    image: "/placeholder-user.jpg",
    rating: 5,
    text: "Shivkara Digitals transformed our business with their exceptional software development. Their team delivered beyond expectations!"
  },
  {
    name: "Priya Sharma",
    company: "StartupVenture",
    image: "/placeholder-user.jpg", 
    rating: 5,
    text: "Professional, reliable, and innovative. The mobile app they developed has significantly boosted our customer engagement."
  },
  {
    name: "Amit Patel",
    company: "E-commerce Solutions",
    image: "/placeholder-user.jpg",
    rating: 5,
    text: "Outstanding web development services. Our new e-commerce platform has increased sales by 300% in just 6 months."
  }
];

// Clean Hero Component
function Hero({ onContact }: { onContact: () => void }) {
  const [counts, setCounts] = useState({ projects: 0, clients: 0, experience: 0, satisfaction: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
      animateCounts();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const animateCounts = () => {
    const targets = { projects: 75, clients: 40, experience: 5, satisfaction: 99 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        projects: Math.floor(targets.projects * easeOut),
        clients: Math.floor(targets.clients * easeOut),
        experience: Math.floor(targets.experience * easeOut),
        satisfaction: Math.floor(targets.satisfaction * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, stepDuration);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Simple animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-blue-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/20 mb-6"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Leading Software Development Company</span>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight">
            <span className="block">Professional Software</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Development Company
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-gray-300 mt-2">
              in Jodhpur, Rajasthan
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          We deliver enterprise-grade software development services and mobile apps that scale with your business. 
          From custom websites to complex solutions—ISO 27001 certified with 24/7 support.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            onClick={() => {
              trackCTAClick("Get Free Quote", "hero");
              onContact();
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-5 h-5" />
            <span>Get Free Quote in 24hrs</span>
          </motion.button>
          
          <motion.button
            onClick={() => {
              trackCTAClick("View Our Work", "hero");
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-5 h-5" />
            <span>View Our Work</span>
          </motion.button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{counts.projects}+</div>
            <div className="text-sm text-gray-400">Projects Completed</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{counts.clients}+</div>
            <div className="text-sm text-gray-400">Happy Clients</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{counts.experience}+</div>
            <div className="text-sm text-gray-400">Years Experience</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{counts.satisfaction}%</div>
            <div className="text-sm text-gray-400">Client Satisfaction</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <ChevronDown className="w-6 h-6 text-blue-400" />
        </div>
      </motion.div>
    </section>
  );
}

// Services Section
function Services() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive software development solutions to help your business thrive in the digital age
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Technology Stack
function TechnologyStack() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Technology Stack
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We use cutting-edge technologies to build robust, scalable solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center group"
              whileHover={{ y: -5 }}
            >
              <div className={`${tech.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {tech.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Process Section
function Process() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Development Process
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            A streamlined approach that ensures quality, efficiency, and client satisfaction
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative text-center group"
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <div className="absolute top-8 left-4 w-8 h-8 bg-white rounded-full border-4 border-gray-900 flex items-center justify-center z-10">
                <span className="text-xs font-bold text-gray-900">{step.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function Contact({ onContact }: { onContact: () => void }) {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Let's discuss how we can help transform your business with our software development expertise.
          </p>
          <motion.button
            onClick={onContact}
            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" />
            <span>Get Free Consultation</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// Main Component
export default function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { isPopupOpen, closePopup, handleSubmit } = useLeadCapturePopup();

  return (
    <div className="min-h-screen">
      <WhatsAppChat phoneNumber="919521699090" />
      <Header onGetStarted={() => setIsContactModalOpen(true)} />
      
      <main>
        <Hero onContact={() => setIsContactModalOpen(true)} />
        <Services />
        <TechnologyStack />
        <Process />
        <Testimonials />
        <Contact onContact={() => setIsContactModalOpen(true)} />
      </main>
      
      <Footer currentPage="home" />
      <FloatingActionButton />

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Contact Us"
        size="lg"
      >
        <ContactForm onClose={() => setIsContactModalOpen(false)} />
      </Modal>

      {/* Lead Capture Popup */}
      <LeadCapturePopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
