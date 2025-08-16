"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ThreeDBackground, ThreeDGlobe, FloatingTechCube } from "../components/ui/3d-background";
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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
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
  Smartphone as Mobile,
  Monitor,
  Server,
  GitBranch,
  Layers,
  Zap as Lightning,
  Heart,
  Eye,
  Download,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  DollarSign,
  Calendar,
  MessageSquare,
  FileText,
  Search,
  Filter,
  Plus,
  Minus,
  Quote,
  ThumbsUp,
  Award as Trophy,
  Clock as Time,
  Users as TeamIcon,
  Globe as World,
  Shield as Security,
  Zap as Speed,
  Check,
  X,
  Menu,
  X as Close,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  CheckCircle as CheckCircleIcon
} from "lucide-react";
import Image from 'next/image';
import { projects } from "../lib/projects";
import TrackableLink from '../components/TrackableLink';
import { trackCTAClick } from "../lib/analytics";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaAws, FaGoogle, FaMicrosoft, FaVuejs, FaAngular, FaPhp } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiMongodb, SiPostgresql, SiRedis, SiKubernetes, SiTerraform, SiJenkins, SiGithub, SiGitlab, SiSlack, SiJira, SiConfluence, SiFigma, SiAdobe, SiSketch, SiNextdotjs, SiLaravel, SiDjango, SiMysql, SiAmazon, SiFlutter, SiIonic } from 'react-icons/si';
import { usePathname } from 'next/navigation';
import { Modal } from "../components/ui/modal";
import { ContactForm } from "../components/ContactForm";
import { OfferClaimForm, PlanSelectionForm } from "../components/SpecialForms";
import { LeadCapturePopup, useLeadCapturePopup } from "../components/LeadCapturePopup";
import { WhatsAppChat } from "../components/WhatsAppChat";
import { app } from "../lib/firebase";
import { ParticleBackground, FloatingElements } from "../components/ui/particles";
import { EnhancedCard, GradientCard, GlassCard } from "../components/ui/enhanced-card";
import { TechSlider } from "../components/ui/tech-slider";
import FeaturedProjects from "../components/FeaturedProjects";
import { ScrollRevealSection, ScrollRevealItem } from "../components/ui/scroll-reveal";
import { ImmediateDisplay } from "../components/ui/immediate-display";
import { TypedTextAnimation, WordFadeIn, AnimatedGradientText, HighlightText } from "../components/ui/text-animations";
import { ParallaxSection, ParallaxBackgroundLayers, AnimatedBackgroundSection } from "../components/ui/parallax-effects";

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
    icon: <Zap className="w-8 h-8" />,
    title: "Digital Transformation",
    description: "Comprehensive digital solutions to modernize your business processes and improve operational efficiency.",
    features: ["Process Automation", "Cloud Migration", "Legacy System Updates", "Digital Strategy"],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "IT Consulting & Support",
    description: "Expert technology consulting and ongoing support to ensure your digital solutions perform optimally.",
    features: ["Technology Assessment", "System Maintenance", "24/7 Support", "Security Audits"],
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Business Solutions",
    description: "End-to-end business solutions including CRM, ERP, and custom management systems.",
    features: ["CRM Implementation", "ERP Systems", "Business Intelligence", "Workflow Automation"],
    color: "from-teal-500 to-cyan-500"
  }
];

const technologies = [
  { name: "React", icon: <FaReact className="w-8 h-8" />, category: "Frontend" },
  { name: "TypeScript", icon: <SiTypescript className="w-8 h-8" />, category: "Frontend" },
  { name: "Node.js", icon: <FaNodeJs className="w-8 h-8" />, category: "Backend" },
  { name: "Python", icon: <FaPython className="w-8 h-8" />, category: "Backend" },
  { name: "Java", icon: <FaJava className="w-8 h-8" />, category: "Backend" },
  { name: "MongoDB", icon: <SiMongodb className="w-8 h-8" />, category: "Database" },
  { name: "PostgreSQL", icon: <SiPostgresql className="w-8 h-8" />, category: "Database" },
  { name: "Redis", icon: <SiRedis className="w-8 h-8" />, category: "Database" },
  { name: "Docker", icon: <FaDocker className="w-8 h-8" />, category: "DevOps" },
  { name: "Kubernetes", icon: <SiKubernetes className="w-8 h-8" />, category: "DevOps" },
  { name: "AWS", icon: <FaAws className="w-8 h-8" />, category: "Cloud" },
  { name: "Google Cloud", icon: <FaGoogle className="w-8 h-8" />, category: "Cloud" },
  { name: "Azure", icon: <FaMicrosoft className="w-8 h-8" />, category: "Cloud" },
  { name: "Terraform", icon: <SiTerraform className="w-8 h-8" />, category: "DevOps" },
  { name: "Jenkins", icon: <SiJenkins className="w-8 h-8" />, category: "DevOps" },
  { name: "GitHub", icon: <SiGithub className="w-8 h-8" />, category: "Tools" },
  { name: "GitLab", icon: <SiGitlab className="w-8 h-8" />, category: "Tools" },
  { name: "Slack", icon: <SiSlack className="w-8 h-8" />, category: "Tools" },
  { name: "Jira", icon: <SiJira className="w-8 h-8" />, category: "Tools" },
  { name: "Figma", icon: <SiFigma className="w-8 h-8" />, category: "Design" },
  { name: "Adobe", icon: <SiAdobe className="w-8 h-8" />, category: "Design" },
  { name: "Sketch", icon: <SiSketch className="w-8 h-8" />, category: "Design" }
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
    title: "Design & Architecture",
    description: "Our team creates detailed designs, user interfaces, and technical architecture.",
    icon: <Palette className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    step: "03",
    title: "Development & Testing",
    description: "We build your solution using modern technologies with continuous testing and quality assurance.",
    icon: <Code className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500"
  },
  {
    step: "04",
    title: "Deployment & Launch",
    description: "We deploy your solution to production with monitoring and support systems in place.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-orange-500 to-red-500"
  },
  {
    step: "05",
    title: "Support & Maintenance",
    description: "Ongoing support, updates, and maintenance to ensure your solution continues to perform optimally.",
    icon: <Shield className="w-8 h-8" />,
    color: "from-indigo-500 to-purple-500"
  }
];

const statistics = [
  { number: "75+", label: "Projects Completed", icon: <CheckCircle className="w-6 h-6" /> },
  { number: "40+", label: "Happy Clients", icon: <Heart className="w-6 h-6" /> },
  { number: "5+", label: "Years Experience", icon: <Award className="w-6 h-6" /> },
  { number: "99%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> }
];

const testimonials = [
  {
    name: "Himanshu Jain",
    role: "Founder & CEO, Tree Nuts",
    content: "Shivkara Digitals transformed our agricultural business with their innovative e-commerce platform. Sales increased by 300% within 6 months. Their team's dedication and technical expertise are unmatched in Jodhpur.",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "Tree Nuts",
    location: "Jodhpur, Rajasthan",
    projectValue: "₹2,50,000",
    results: "300% increase in sales"
  },
  {
    name: "Nikki Moolchandani",
    role: "Creative Director, NikkiFashion",
    content: "The custom fashion e-commerce website exceeded all our expectations. Beautiful design, seamless user experience, and powerful admin features. Our online presence has never been stronger!",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "NikkiFashion",
    location: "Jodhpur, Rajasthan",
    projectValue: "₹1,75,000",
    results: "250% boost in online orders"
  },
  {
    name: "Sawai Singh",
    role: "Managing Director, Vehicle On Rent",
    content: "Their vehicle rental management system revolutionized our operations. Real-time booking, automated invoicing, and GPS tracking - everything we needed in one platform. Excellent ROI!",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "Vehicle On Rent",
    location: "Jodhpur, Rajasthan",
    projectValue: "₹3,00,000",
    results: "50% operational efficiency gain"
  },
  {
    name: "Dr. Rajesh Sharma",
    role: "Director, Sharma Healthcare",
    content: "Professional healthcare management system with patient portal and appointment booking. The team delivered on time and provided excellent training. Highly recommended!",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "Sharma Healthcare",
    location: "Jodhpur, Rajasthan",
    projectValue: "₹4,50,000",
    results: "40% faster patient processing"
  },
  {
    name: "Priya Kumari",
    role: "Principal, Modern Public School",
    content: "The school management system they built handles everything from admissions to fee collection seamlessly. Parents and teachers love the mobile app. Fantastic work!",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "Modern Public School",
    location: "Jodhpur, Rajasthan",
    projectValue: "₹6,00,000",
    results: "90% paperwork reduction"
  },
  {
    name: "Mahesh Agarwal",
    role: "CEO, Agarwal Textiles",
    content: "Their inventory management system with mobile app transformed our textile business. Real-time stock tracking and automated reordering saved us thousands. Worth every rupee!",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "Agarwal Textiles",
    location: "Jodhpur, Rajasthan",
    projectValue: "₹5,25,000",
    results: "35% cost reduction"
  }
];

const team = [
  {
    name: "Vansh Gehlot",
    role: "Lead Developer",
    avatar: "/placeholder-user.jpg",
    skills: ["Mobile Development", "Flutter", "AWS"],
    experience: "3+ years",
    linkedin: "#"
  },
  {
    name: "Shubham Dadhich",
    role: "Senior Developer",
    avatar: "/placeholder-user.jpg",
    skills: ["Full-Stack Development", "React", "Node.js", "Firebase", "UI/UX"],
    experience: "4+ years",
    linkedin: "#"
  },
  {
    name: "Virender Parihar",
    role: "Senior Developer",
    avatar: "/placeholder-user.jpg",
    skills: [ "UI/UX", "Graphic Design"],
    experience: "3+ years",
    linkedin: "#"
  },
];

const clientLogos = [
  { name: "Tree Nuts", logo: "🌰", category: "E-commerce" },
  { name: "NikkiFashion", logo: "👗", category: "Fashion" },
  { name: "Vehicle On Rent", logo: "🚗", category: "Transportation" },
  { name: "Jeerihaveli", logo: "🏨", category: "Hospitality" },
  { name: "Pigo Taxi", logo: "🚕", category: "Transportation" },
  { name: "Jodhpur Bombay Roadway", logo: "🚛", category: "Logistics" }
];

const pricingPlans = [
  {
    name: "Startup Package",
    price: "₹25,000",
    originalPrice: "₹35,000",
    period: "project",
    description: "Perfect for new businesses and startups looking to establish their digital presence",
    features: [
      "Professional responsive website (up to 7 pages)",
      "Mobile-optimized design",
      "Contact form with email notifications",
      "Basic SEO optimization",
      "Google Analytics integration",
      "2 months free support",
      "SSL certificate setup",
      "Social media integration",
      "Basic content management",
      "Performance optimization"
    ],
    popular: false,
    color: "from-blue-500 to-cyan-500",
    badge: "BEST FOR STARTUPS",
    savings: "Save ₹10,000",
    deliveryTime: "2-3 weeks",
    revisions: "3 revisions included",
    support: "2 months free support"
  },
  {
    name: "Business Growth",
    price: "₹75,000",
    originalPrice: "₹1,00,000",
    period: "combo",
    description: "Complete digital solution with website and mobile presence for growing businesses",
    features: [
      "Professional website (up to 12 pages)",
      "Android mobile application",
      "Admin dashboard and analytics",
      "Database integration with cloud backup",
      "Advanced SEO and local optimization",
      "6 months premium support",
      "Payment gateway integration",
      "Push notifications system",
      "App store publishing assistance",
      "Social media API integration",
      "Email marketing setup",
      "Performance monitoring"
    ],
    popular: true,
    color: "from-purple-500 to-pink-500",
    badge: "MOST POPULAR",
    savings: "Save ₹25,000",
    deliveryTime: "4-6 weeks",
    revisions: "5 revisions included",
    support: "6 months premium support"
  },
  {
    name: "Enterprise Solution",
    price: "₹1,50,000",
    originalPrice: "₹2,00,000",
    period: "project",
    description: "Comprehensive digital transformation for established businesses and enterprises",
    features: [
      "Custom web application development",
      "iOS & Android mobile applications",
      "Advanced admin panel with role management",
      "API development and third-party integrations",
      "Cloud infrastructure setup (AWS/Google Cloud)",
      "12 months platinum support",
      "Advanced analytics and reporting",
      "Multi-language support",
      "Advanced security implementation",
      "Automated backup and disaster recovery",
      "Performance optimization and monitoring",
      "Dedicated project manager",
      "Training and documentation",
      "24/7 technical support"
    ],
    popular: false,
    color: "from-orange-500 to-red-500",
    badge: "ENTERPRISE GRADE",
    savings: "Save ₹50,000",
    deliveryTime: "8-12 weeks",
    revisions: "Unlimited revisions",
    support: "12 months platinum support"
  }
];

const blogPosts = [
  {
    title: "The Future of Web Development in 2025",
    excerpt: "Explore the latest trends and technologies that will shape web development in the coming year.",
    author: "Shivkara Team",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    category: "Technology",
    image: "/blog/article1.png",
    tags: ["Web Development", "Trends", "2025"]
  },
  {
    title: "Building Scalable E-commerce Solutions",
    excerpt: "Learn the best practices for creating e-commerce platforms that can handle high traffic and growth.",
    author: "Vansh Gehlot",
    date: "Jan 10, 2025",
    readTime: "8 min read",
    category: "E-commerce",
    image: "/blog/article2.png",
    tags: ["E-commerce", "Scalability", "Best Practices"]
  },
  {
    title: "Mobile App Development: Native vs Cross-Platform",
    excerpt: "A comprehensive comparison of native and cross-platform mobile app development approaches.",
    author: "Shubham Dadhich",
    date: "Jan 5, 2025",
    readTime: "6 min read",
    category: "Mobile Development",
    image: "/blog/artcle3.png",
    tags: ["Mobile", "React Native", "Flutter"]
  }
];

const specialOffers = [
  {
    title: "New Business Combo",
    description: "Website + Android App + 8 Months Support",
    originalPrice: "₹1,20,000",
    offerPrice: "₹75,000",
    savings: "₹45,000",
    features: [
      "Professional Website (10 pages)",
      "Android Mobile Application",
      "Admin Dashboard",
      "8 Months Free Support",
      "Payment Gateway Integration",
      "SEO Optimization",
      "App Store Publishing",
      "Free Domain & Hosting (1 year)"
    ],
    validUntil: "September 30, 2025",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Startup Special",
    description: "Basic Website Package",
    originalPrice: "₹15,000",
    offerPrice: "₹7,000",
    savings: "₹8,000",
    features: [
      "Responsive Website (5 pages)",
      "Contact Form",
      "SEO Optimization",
      "1 Month Support",
      "Mobile-Friendly Design",
      "Fast Loading Speed",
      "Free SSL Certificate",
      "Basic Analytics"
    ],
    validUntil: "September 30, 2025",
    color: "from-blue-500 to-cyan-500"
  }
];

const faqs = [
  {
    question: "What is your development process?",
    answer: "We follow an agile methodology with 5 key phases: Discovery & Planning, Design & Architecture, Development & Testing, Deployment & Launch, and Support & Maintenance. Each phase includes regular client communication and feedback loops."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. A simple website takes 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during the planning phase and keep you updated throughout development."
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer: "Yes, we offer comprehensive support and maintenance packages. This includes bug fixes, security updates, performance optimization, and feature additions. We also provide 24/7 monitoring for critical applications."
  },
  {
    question: "What technologies do you specialize in?",
    answer: "We work with modern technologies including React, Next.js, Node.js, Python, Java, MongoDB, PostgreSQL, AWS, and more. We choose the best technology stack based on your specific requirements and project goals."
  },
  {
    question: "Can you work with existing systems?",
    answer: "Absolutely! We have extensive experience integrating with legacy systems and third-party APIs. We can modernize existing applications or build new features that work seamlessly with your current infrastructure."
  },
  {
    question: "What about project security and data protection?",
    answer: "Security is our top priority. We implement industry-standard security practices, including data encryption, secure authentication, regular security audits, and compliance with data protection regulations."
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Yes, we provide comprehensive post-launch support including bug fixes, updates, maintenance, and feature additions. Our support packages range from 1 month to 12 months depending on your needs."
  },
  {
    question: "Can you help with domain and hosting setup?",
    answer: "Absolutely! We provide complete domain registration, hosting setup, and SSL certificate installation. We also offer managed hosting services to ensure your website runs smoothly."
  }
];

function Typewriter({ texts, speed = 50, pause = 2000 }: { texts: string[], speed?: number, pause?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [char, setChar] = useState(0);

  useEffect(() => {
    if (!texts.length) return;
    
    if (char < texts[index].length) {
      const timeout = setTimeout(() => setChar(c => c + 1), speed);
      setDisplayed(texts[index].slice(0, char + 1));
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setChar(0);
        setIndex(i => (i + 1) % texts.length);
      }, pause);
      return () => clearTimeout(timeout);
    }
  }, [char, index, texts, speed, pause]);

  return <span>{displayed}</span>;
}

function Header({ onGetStarted }: { onGetStarted: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Scrollspy logic
      const sections = [
        { id: 'home', offset: 0 },
        { id: 'services', offset: 0 },
        { id: 'projects', offset: 0 },
        { id: 'about', offset: 0 },
        { id: 'contact', offset: 0 },
      ];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          if (window.scrollY >= top) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 nav-professional ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ 
        boxShadow: isScrolled 
          ? '0 10px 40px rgba(0, 0, 0, 0.08)' 
          : 'none'
      }}
    >
      <div className={`max-w-7xl mx-auto ${isScrolled ? 'px-6 py-4' : 'px-8 py-5'}`}>
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/logo.jpeg" alt="Shivkara Digitals - Professional Software Development Company Logo" className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Shivkara Digital
            </span>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {['Home', 'Services', 'Projects', 'About', 'Location', 'Contact'].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`relative text-sm font-medium tracking-wide transition-all duration-300 px-4 py-2 rounded-full ${
                  activeSection === item.toLowerCase()
                    ? 'text-white bg-gradient-to-r from-blue-700 to-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'text-gray-700 hover:text-indigo-700'
                }`}
                whileHover={activeSection !== item.toLowerCase() ? { 
                  scale: 1.05,
                  backgroundColor: "rgba(243, 244, 246, 1)" // gray-100
                } : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
              >
                {item}
                {activeSection !== item.toLowerCase() && (
                  <motion.span 
                    className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transform -translate-x-1/2"
                    initial={{ width: 0 }}
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white px-7 py-3 rounded-full font-medium relative overflow-hidden shadow-lg shadow-indigo-500/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {['Home', 'Services', 'Projects', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-gray-700 font-medium transition-colors px-2 py-1 rounded-lg ${
                    activeSection === item.toLowerCase()
                      ? 'bg-gradient-to-r from-lavender to-pink text-white'
                      : 'hover:text-lavender'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

function Hero({ onContact }: { onContact: () => void }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Animated counter for statistics
  const [counts, setCounts] = useState({ projects: 0, clients: 0, experience: 0, satisfaction: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Auto-start animations immediately without waiting for scroll
  useEffect(() => {
    // Start animations immediately when component mounts
    setHasAnimated(true);
    animateCounts();
    
    // This will run the original observer logic as a backup
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounts();
        }
      },
      { threshold: 0.1 } // Lower threshold to trigger earlier
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
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
      });      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, stepDuration);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white"
    >
      {/* 3D Hero Elements - Immediately visible */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        {/* 3D Particle Background */}
        <ThreeDBackground 
          intensity={0.6} 
          density={30} 
          speed={0.05}
          color1="#3b82f6" 
          color2="#4f46e5" 
          className="!z-0"
        />
        
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--color-primary),0.08),transparent_70%)] z-[-1]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] z-[-1]" />
        
        {/* 3D Floating Globe */}
        <ThreeDGlobe 
          size="600px"
          position="bottom-0 right-0 translate-x-1/4 translate-y-1/4"
          opacity={0.25}
          color1="#3b82f6"
          color2="#4f46e5"
        />
        
        {/* Animated 3D Cube */}
        <FloatingTechCube 
          position="top-20 left-20"
          className="z-0"
          size="120px"
          colors={['#3b82f6', '#6366f1', '#8b5cf6']}
        />
        
        {/* Small floating tech cube with immediate animation */}
        <FloatingTechCube 
          position="bottom-40 left-1/3" 
          size="80px"
          colors={['#06b6d4', '#3b82f6', '#4f46e5']}
        />
        
        {/* Additional 3D elements from hero-3d-elements.tsx - Immediately visible */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0 }}
          className="absolute z-10"
        >
          <div className="Hero3DCube absolute top-40 right-20 z-10" style={{ width: '100px', height: '100px', perspective: '1000px' }}>
            <motion.div 
              className="relative w-full h-full preserve-3d pointer-events-none"
              animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
                rotateZ: [0, 360]
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity
              }}
            >
              {/* Front face */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-60" 
                   style={{ transform: 'translateZ(50px)' }} />
              {/* Back face */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-60" 
                   style={{ transform: 'rotateY(180deg) translateZ(50px)' }} />
              {/* Side faces */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-60" 
                   style={{ transform: 'rotateY(-90deg) translateZ(50px)' }} />
              <div className="absolute inset-0 bg-gradient-to-l from-indigo-600 to-blue-600 opacity-60" 
                   style={{ transform: 'rotateY(90deg) translateZ(50px)' }} />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-indigo-600 opacity-60" 
                   style={{ transform: 'rotateX(90deg) translateZ(50px)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-purple-600 opacity-60" 
                   style={{ transform: 'rotateX(-90deg) translateZ(50px)' }} />
            </motion.div>
          </div>

          {/* Animated 3D Sphere */}
          <div className="absolute bottom-40 left-20 z-10" style={{ width: '80px', height: '80px' }}>
            <motion.div
              className="w-full h-full rounded-full pointer-events-none"
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity
              }}
            >
              <div className="relative w-full h-full">
                {/* Sphere with gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-radial from-blue-300/40 to-blue-700/70 opacity-60" />
                {/* Highlight */}
                <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 rounded-full bg-white opacity-30" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Removed ScrollRevealSection to ensure content is visible immediately */}
        <div className="mb-8 relative z-20">
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-gray-100 mb-8 animate-float"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 30px rgba(79, 70, 229, 0.15)"
            }}
          >
            <div className="bg-indigo-50 p-1 rounded-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </motion.div>
            </div>
            <TypedTextAnimation 
              text="ENTERPRISE-GRADE DIGITAL SOLUTIONS"
              className="text-gray-800 font-medium text-sm tracking-wide"
              typingSpeed={0.03}
              cursorColor="#4f46e5"
              startDelay={0.5}
            />
          </motion.div>
        </div>

        <ImmediateDisplay
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
        >
          <ScrollRevealItem>
            <WordFadeIn 
              text="Transform Your Business with" 
              className="text-gray-900"
              staggerDelay={0.05}
            />
          </ScrollRevealItem>
          
          <ScrollRevealItem className="relative inline-block mt-2 mb-3">
            <AnimatedGradientText
              text="Custom Software"
              className="font-extrabold"
              gradientFrom="from-blue-700"
              gradientVia="via-indigo-600"
              gradientTo="to-blue-800"
            />
            <motion.div 
              className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              style={{ transformOrigin: 'left' }}
            />
          </ScrollRevealItem>
          
          <ScrollRevealItem>
            <WordFadeIn 
              text="That Actually Works" 
              className="text-gray-900 block"
              delay={0.8}
              staggerDelay={0.05}
            />
          </ScrollRevealItem>
        </ImmediateDisplay>

        <ImmediateDisplay
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          <p>
            We build <HighlightText 
                      text="enterprise-grade software" 
                      highlightWords={["enterprise-grade"]} 
                      highlightColor="bg-indigo-100" 
                      highlightTextColor="text-indigo-800 font-semibold"
                    /> and mobile apps that scale with your business. 
            From custom websites to complex enterprise solutions—delivered with global standards.
          </p>
        </ImmediateDisplay>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            onClick={() => {
              trackCTAClick("Get Free Quote in 24hrs", "hero");
              onContact();
            }}
            className="group relative bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-indigo-600/20 overflow-hidden flex items-center space-x-2 depth-effect"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 15px 30px rgba(79, 70, 229, 0.3)"
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-800 to-indigo-700 transition-transform duration-300 ease-out transform translate-x-full group-hover:translate-x-0"></span>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative z-10 mr-1"
            >
              <Zap className="w-5 h-5" />
            </motion.div>
            <span className="relative z-10">Get Free Quote in 24hrs</span>
          </motion.button>
          
          <motion.button
            onClick={() => {
              trackCTAClick("View Our Work", "hero");
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 flex items-center space-x-2 border border-gray-200 backdrop-blur-sm bg-white/80"
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.15)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5" />
            <span>View Our Work</span>
          </motion.button>
        </div>

        {/* Statistics */}
        <ScrollRevealSection
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          delay={1.2}
          duration={0.8}
          staggerChildren={true}
          staggerDelay={0.1}
        >
          <ScrollRevealItem>
            <motion.div
              className="text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-2">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20"
                  animate={{ 
                    boxShadow: ['0 10px 15px rgba(59, 130, 246, 0.2)', '0 15px 25px rgba(59, 130, 246, 0.4)', '0 10px 15px rgba(59, 130, 246, 0.2)']
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              </div>
              <div className="counter text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 mb-1">{counts.projects}+</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </motion.div>
          </ScrollRevealItem>
          
          <ScrollRevealItem>
            <motion.div
              className="text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-2">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"
                  animate={{ 
                    boxShadow: ['0 10px 15px rgba(99, 102, 241, 0.2)', '0 15px 25px rgba(99, 102, 241, 0.4)', '0 10px 15px rgba(99, 102, 241, 0.2)']
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-6 h-6" />
                </motion.div>
              </div>
              <div className="counter text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 mb-1">{counts.clients}+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </motion.div>
          </ScrollRevealItem>
          
          <ScrollRevealItem>
            <motion.div
              className="text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-2">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-700/20"
                  animate={{ 
                    boxShadow: ['0 10px 15px rgba(29, 78, 216, 0.2)', '0 15px 25px rgba(29, 78, 216, 0.4)', '0 10px 15px rgba(29, 78, 216, 0.2)']
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Award className="w-6 h-6" />
                </motion.div>
              </div>
              <div className="counter text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 mb-1">{counts.experience}+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </motion.div>
          </ScrollRevealItem>
          
          <ScrollRevealItem>
            <motion.div
              className="text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-2">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/20"
                  animate={{ 
                    boxShadow: ['0 10px 15px rgba(245, 158, 11, 0.2)', '0 15px 25px rgba(245, 158, 11, 0.4)', '0 10px 15px rgba(245, 158, 11, 0.2)']
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="w-6 h-6" />
                </motion.div>
              </div>
              <div className="counter text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 mb-1">{counts.satisfaction}%</div>
              <div className="text-sm text-gray-600">Client Satisfaction</div>
            </motion.div>
          </ScrollRevealItem>
        </ScrollRevealSection>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.2 }}
      >
        <div className="p-2 bg-white/30 backdrop-blur-sm rounded-full">
          <ChevronDown className="w-6 h-6 text-indigo-600" />
        </div>
      </motion.div>
    </div>
  );
}

function TrustSignals() {
  return (
    <motion.section 
      className="py-8 bg-white border-y border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted by Leading Companies</h3>
          <p className="text-gray-600">Our certified partnerships and proven track record</p>
        </div>
        
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 items-center">
          {/* Microsoft Partner */}
          <motion.div 
            className="flex flex-col items-center space-y-1 p-2 md:p-4 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <FaMicrosoft className="w-12 h-12 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Microsoft Partner</span>
          </motion.div>

          {/* AWS Partner */}
          <motion.div 
            className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <FaAws className="w-12 h-12 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">AWS Partner</span>
          </motion.div>

          {/* Google Cloud */}
          <motion.div 
            className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <FaGoogle className="w-12 h-12 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Google Cloud</span>
          </motion.div>

          {/* ISO Certified */}
          <motion.div 
            className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-12 h-12 text-green-600" />
            <span className="text-sm font-medium text-gray-700">ISO 27001</span>
          </motion.div>

          {/* 5 Star Reviews */}
          <motion.div 
            className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">5.0 Reviews</span>
          </motion.div>
        </div>

        {/* Trust Features */}
  <div className="mt-4 flex flex-wrap justify-center items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Free Consultation</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Money-Back Guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Local Jodhpur Team</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function TechnologyStack() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'frontend', 'backend', 'database', 'devops', 'mobile'];
  
  const technologies = [
    { name: 'React', icon: <FaReact className="w-10 h-10 text-blue-500" />, category: 'frontend', color: 'from-blue-500 to-cyan-500' },
    { name: 'Next.js', icon: <SiNextdotjs className="w-10 h-10 text-gray-800" />, category: 'frontend', color: 'from-gray-800 to-gray-900' },
    { name: 'Vue.js', icon: <FaVuejs className="w-10 h-10 text-green-500" />, category: 'frontend', color: 'from-green-500 to-emerald-500' },
    { name: 'Angular', icon: <FaAngular className="w-10 h-10 text-red-500" />, category: 'frontend', color: 'from-red-500 to-pink-500' },
    { name: 'TypeScript', icon: <SiTypescript className="w-10 h-10 text-blue-600" />, category: 'frontend', color: 'from-blue-600 to-blue-700' },
    { name: 'JavaScript', icon: <SiJavascript className="w-10 h-10 text-yellow-500" />, category: 'frontend', color: 'from-yellow-400 to-orange-500' },
    { name: 'Node.js', icon: <FaNodeJs className="w-10 h-10 text-green-600" />, category: 'backend', color: 'from-green-600 to-green-700' },
    { name: 'Python', icon: <FaPython className="w-10 h-10 text-blue-600" />, category: 'backend', color: 'from-blue-500 to-indigo-600' },
    { name: 'Java', icon: <FaJava className="w-10 h-10 text-orange-500" />, category: 'backend', color: 'from-orange-500 to-red-600' },
    { name: 'PHP', icon: <FaPhp className="w-10 h-10 text-purple-600" />, category: 'backend', color: 'from-purple-500 to-indigo-600' },
    { name: 'Laravel', icon: <SiLaravel className="w-10 h-10 text-red-500" />, category: 'backend', color: 'from-red-500 to-pink-600' },
    { name: 'Django', icon: <SiDjango className="w-10 h-10 text-green-700" />, category: 'backend', color: 'from-green-700 to-green-800' },
    { name: 'MongoDB', icon: <SiMongodb className="w-10 h-10 text-green-600" />, category: 'database', color: 'from-green-500 to-emerald-600' },
    { name: 'PostgreSQL', icon: <SiPostgresql className="w-10 h-10 text-blue-600" />, category: 'database', color: 'from-blue-600 to-indigo-700' },
    { name: 'MySQL', icon: <SiMysql className="w-10 h-10 text-blue-500" />, category: 'database', color: 'from-blue-500 to-blue-600' },
    { name: 'Redis', icon: <SiRedis className="w-10 h-10 text-red-500" />, category: 'database', color: 'from-red-500 to-red-600' },
    { name: 'Docker', icon: <FaDocker className="w-10 h-10 text-blue-500" />, category: 'devops', color: 'from-blue-500 to-indigo-600' },
    { name: 'AWS', icon: <SiAmazon className="w-10 h-10 text-orange-500" />, category: 'devops', color: 'from-orange-500 to-yellow-500' },
    { name: 'Kubernetes', icon: <SiKubernetes className="w-10 h-10 text-blue-600" />, category: 'devops', color: 'from-blue-600 to-blue-700' },
    { name: 'React Native', icon: <FaReact className="w-10 h-10 text-blue-500" />, category: 'mobile', color: 'from-blue-500 to-cyan-500' },
    { name: 'Flutter', icon: <SiFlutter className="w-10 h-10 text-blue-500" />, category: 'mobile', color: 'from-blue-500 to-indigo-600' },
    { name: 'Ionic', icon: <SiIonic className="w-10 h-10 text-blue-600" />, category: 'mobile', color: 'from-blue-600 to-purple-600' },
  ];

  const filteredTechnologies = selectedCategory === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.category === selectedCategory);

  return (
    <section id="technologies" className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-professional text-4xl font-bold mb-6 text-gray-900">
            Our Technology Stack
          </h2>
          <p className="text-professional text-xl text-gray-600 max-w-3xl mx-auto">
            We work with cutting-edge technologies to deliver exceptional digital solutions
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
            {categories.map((category) => (
              <motion.button
                key={category}
              onClick={() => setSelectedCategory(category)}
              className={`ripple-button px-6 py-3 rounded-full font-medium transition-all duration-300 magnetic ${
                selectedCategory === category
                    ? 'bg-gradient-to-r from-lavender to-pink text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-lavender'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
        </motion.div>

        {/* Technology Slider */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TechSlider 
            technologies={filteredTechnologies}
            itemsPerView={8}
          />
            </motion.div>
        </div>
    </section>
  );
}

function Process() {
  return (
    <motion.section
      className="py-20 bg-very-light-pink"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Development Process</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We follow a proven methodology that ensures quality, transparency, and successful project delivery.
          </p>
        </motion.div>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Connection line */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-lavender to-pink z-0" style={{ width: 'calc(100% + 2rem)' }} />
              )}
              
              <GradientCard
                gradient={step.color}
                delay={index * 0.2}
                className="relative z-10"
              >
                <div className="text-center">
                  <motion.div 
                    className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white mb-3 md:mb-6 mx-auto`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                  {step.icon}
                  </motion.div>
                  <div className="text-xs md:text-sm font-bold text-lavender mb-1 md:mb-2">{step.step}</div>
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{step.description}</p>
                </div>
              </GradientCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Services() {
  return (
    <motion.section
      id="services"
      className="py-24 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="section-header text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-indigo-700 rounded-full"></div>
            <span className="text-indigo-700 text-sm font-semibold tracking-wide">OUR SERVICES</span>
            <div className="w-2 h-2 bg-indigo-700 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Comprehensive <span className="text-indigo-700">Solutions</span> for Your Business
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer end-to-end software solutions tailored to meet your specific business requirements and drive meaningful digital transformation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg relative`}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                {service.icon}
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * featureIndex, duration: 0.5 }}
                  >
                    <div className="bg-indigo-50 rounded-full p-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-700 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-700 to-indigo-600 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Projects() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const openProjectModal = (project: any) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      const allImages = [selectedProject.image, ...selectedProject.screenshots];
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      const allImages = [selectedProject.image, ...selectedProject.screenshots];
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <motion.section
      id="projects"
      className="py-16 bg-gradient-to-br from-purple-50 to-pink-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-professional text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="gradient-text-animated">Projects</span>
          </h2>
          <p className="text-professional text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our portfolio of innovative solutions that have transformed businesses across various industries.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {['all', 'web', 'mobile', 'enterprise', 'ai'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-gradient-to-r from-lavender to-pink text-white shadow-lg'
                    : 'bg-very-light-pink text-gray-700 hover:bg-light-pink border border-lavender/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid-professional">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.name}
              className="card-professional group overflow-hidden tilt-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <div className="h-48 bg-gradient-to-br from-lavender/20 to-pink/20 flex items-center justify-center relative rounded-xl mb-6 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  width={400}
                  height={300}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                  className="rounded-xl hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <motion.div 
                  className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button 
                    onClick={() => openProjectModal(project)}
                    className="px-6 py-2 bg-gradient-to-r from-lavender to-pink text-white rounded-full font-semibold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </motion.button>
                </motion.div>
                </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-lavender font-medium">{project.type}</span>
                  <motion.button
                    onClick={() => openProjectModal(project)}
                      className="text-gray-400 hover:text-lavender transition-colors"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    >
                      <ExternalLink className="w-5 h-5" />
                  </motion.button>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-lavender/20 to-pink/20 text-gray-700 text-sm rounded-full border border-lavender/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: techIndex * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h3>
                  <p className="text-gray-600">{selectedProject.type}</p>
                </div>
                <button
                  onClick={closeProjectModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image Gallery */}
              <div className="relative">
                <div className="relative h-96">
                  {(() => {
                    const allImages = [selectedProject.image, ...selectedProject.screenshots];
                    const currentImage = allImages[currentImageIndex];
                    return (
                      <Image
                        src={currentImage}
                        alt={`${selectedProject.name} - Image ${currentImageIndex + 1}`}
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-4"
                      />
                    );
                  })()}
                </div>

                {/* Navigation Arrows */}
                {(() => {
                  const allImages = [selectedProject.image, ...selectedProject.screenshots];
                  if (allImages.length > 1) {
                    return (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          →
                        </button>
                      </>
                    );
                  }
                  return null;
                })()}

                {/* Image Counter */}
                {(() => {
                  const allImages = [selectedProject.image, ...selectedProject.screenshots];
                  if (allImages.length > 1) {
                    return (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Testimonials() {
  return (
    <motion.section
      className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </motion.div>

        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-6 md:space-x-8 min-w-[320px]" style={{scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch'}}>
            {testimonials.map((testimonial, index) => (
              <EnhancedCard
                key={testimonial.name}
                hoverEffect="scale"
                delay={index * 0.2}
                className="relative min-w-[300px] md:min-w-[350px] max-w-xs md:max-w-sm flex-shrink-0 scroll-snap-align-start">
                <div className="flex items-center mb-6">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white font-bold mr-4"
                    whileHover={{ scale: 1.2, rotate: 360, transition: { duration: 0.6 } }}>
                    {testimonial.name.charAt(0)}
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <motion.p className="text-gray-700 mb-6 italic" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  "{testimonial.content}"
                </motion.p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ClientLogos() {
  return (
    <motion.section
      className="py-16 bg-white border-t border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Trusted by <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Leading Businesses</span>
          </h3>
          <p className="text-gray-600">
            We've helped businesses across various industries achieve their digital goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {clientLogos.map((client, index) => (
            <motion.div
              key={client.name}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -3, scale: 1.05 }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {client.logo}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{client.name}</h4>
              <p className="text-xs text-gray-500">{client.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Team() {
  return (
    <motion.section
      id="about"
      className="py-16 bg-gradient-to-br from-orange-50 to-red-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Our <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Expert Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our experienced team of software engineers, designers, and business analysts work together to deliver innovative solutions that drive business growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <EnhancedCard
              key={member.name}
              hoverEffect="lift"
              delay={index * 0.2}
              className="text-center"
            >
              <motion.div 
                className="w-24 h-24 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                {member.name.charAt(0)}
              </motion.div>
              
              <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
              <p className="text-lavender font-medium mb-4">{member.role}</p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {member.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1 bg-very-light-pink text-gray-700 text-sm rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: skillIndex * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Location() {
  return (
    <motion.section
      id="location"
      className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-semibold tracking-wider mb-3 block">
            FIND US
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Our Location
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visit our office or get in touch with us. We're here to help you transform your business with innovative digital solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Container */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Map Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <h3 className="text-white font-medium">Shivkara Digitals - Location</h3>
                </div>
              </div>
              
              {/* Embedded Map */}
              <div className="relative h-96 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115313.17830058996!2d72.4368506!3d26.238947749999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c4eaa06ccb9%3A0x8114ea5b0ae1abb8!2sJodhpur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1691741234567!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-2xl"
                  title="Shivkara Digitals Office Location in Jodhpur, Rajasthan"
                />
                
                {/* Map overlay for mobile touch indicator */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-20 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <div className="flex flex-col space-y-2">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Location Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Address Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sardarpura C Road Jodhpur, Rajasthan, India<br />
                    PIN: 342001
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600 text-sm">+91 9521699090</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">hello@shivkaradigital.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="text-gray-900 font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="text-gray-900 font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="text-gray-900 font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://maps.google.com/?q=Jodhpur,Rajasthan,India', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Maps</span>
              </motion.button>
              
              <motion.button
                className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Us</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Shivkara Digitals",
              "description": "Professional Software Development Company specializing in custom software solutions, mobile apps, and web development.",
              "url": "https://shivkaradigitals.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jodhpur",
                "addressLocality": "Jodhpur",
                "addressRegion": "Rajasthan",
                "postalCode": "342001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "26.2389",
                "longitude": "73.0243"
              },
              "openingHours": [
                "Mo-Fr 09:00-18:00",
                "Sa 10:00-16:00"
              ],
              "telephone": "+91-XXX-XXX-XXXX",
              "email": "hello@shivkaradigital.com",
              "sameAs": [
                "https://www.facebook.com/shivkaradigital",
                "https://www.instagram.com/shivkaradigital"
              ],
              "priceRange": "₹",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer, Digital Wallet"
            })
          }}
        />
      </div>
    </motion.section>
  );
}

function Contact() {

  return (
    <motion.section
      id="contact"
      className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Start Your Project</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your business with custom software solutions? Get in touch with us and let's discuss how we can help accelerate your digital transformation.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </motion.section>
  );
}

function Features({ onCustomQuote }: { onCustomQuote: () => void }) {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Development",
      description: "We use modern technologies and agile methodologies to deliver projects quickly without compromising quality.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Your data and applications are protected with enterprise-grade security and 99.9% uptime guarantee.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Our experienced developers and designers work closely with you to understand your unique requirements.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Scalable Solutions",
      description: "We build solutions that grow with your business, ensuring long-term success and ROI.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock technical support and maintenance to keep your systems running smoothly.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assured",
      description: "Rigorous testing and quality assurance processes ensure your software meets the highest standards.",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  return (
    <motion.section
      className="py-20 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Shivkara Digitals</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine technical expertise with business acumen to deliver solutions that drive real results.
          </p>
        </motion.div>


        {/* Performance Comparison */}
        <motion.div 
          className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-8">Why Choose Shivkara Digitals?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <div className="text-center p-2 md:p-4">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">50% Faster Delivery</h4>
              <p className="text-xs md:text-sm text-gray-600">Our streamlined process ensures projects are delivered 50% faster than industry average.</p>
            </div>
            <div className="text-center p-2 md:p-4">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">30% Cost Savings</h4>
              <p className="text-xs md:text-sm text-gray-600">Local development team means significant cost savings without compromising quality.</p>
            </div>
            <div className="text-center p-2 md:p-4">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">100% Success Rate</h4>
              <p className="text-xs md:text-sm text-gray-600">Every project delivered on time with complete client satisfaction guaranteed.</p>
            </div>
          </div>
        </motion.div>

        {/* Special Offer */}
        <motion.div 
          className="mt-12 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">Limited Time Offer - Save Up to ₹50,000!</h3>
          <p className="text-lg mb-6">Book your project consultation in January 2025 and get exclusive discounts on all packages.</p>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={onCustomQuote}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Custom Quote
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Free Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function SpecialOffers({ onClaimOffer }: { onClaimOffer: (offer: any) => void }) {
  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-lavender/10 to-pink/10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Special <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Offers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Limited time offers to help your business grow. Don't miss these exclusive deals!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {specialOffers.map((offer, index) => (
            <motion.div
              key={offer.title}
              className="group relative bg-white backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Glass effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-lavender/5 to-pink/10 group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
              
              {/* Animated decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-lavender to-pink rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              {/* Offer Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform duration-300">
                LIMITED TIME
              </div>

              {/* Content wrapper with relative positioning */}
              <div className="relative">
                {/* Price Section */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2 text-gray-900 group-hover:text-lavender transition-colors duration-300">{offer.title}</h3>
                  <p className="text-gray-600 mb-6">{offer.description}</p>
                  
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <span className="text-2xl text-gray-400 line-through">{offer.originalPrice}</span>
                    <span className="text-5xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">
                      {offer.offerPrice}
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-5 py-2 rounded-full text-sm font-semibold inline-block shadow-lg">
                    Save {offer.savings}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {offer.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-lavender/10 group-hover:bg-lavender/20 transition-colors duration-300">
                        <Check className="w-4 h-4 text-lavender" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Valid Until */}
                <div className="text-center mb-6">
                  <p className="text-sm font-medium inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors duration-300">
                    <Clock className="w-4 h-4 mr-1" /> Valid until: <span className="font-bold ml-1">{offer.validUntil}</span>
                  </p>
                </div>

                <motion.button
                  onClick={() => onClaimOffer(offer)}
                  className="w-full py-4 bg-gradient-to-r from-lavender to-pink text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink to-lavender opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative flex items-center justify-center">
                    Claim This Offer <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Pricing({ onCustomQuote, onGetStarted }: { onCustomQuote: () => void; onGetStarted: (plan: any) => void }) {
  const [selectedPlan, setSelectedPlan] = useState('Professional');

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transparent <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. All plans include our commitment to quality and ongoing support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ${
                plan.popular 
                  ? 'md:scale-105 shadow-2xl z-10' 
                  : 'shadow-xl hover:shadow-2xl'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 ${plan.popular ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'} transition-opacity duration-500 bg-gradient-to-br from-lavender to-pink`}></div>
              
              {/* Top accent bar */}
              <div className={`h-2 w-full ${
                plan.popular
                  ? 'bg-gradient-to-r from-lavender to-pink'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-lavender/30 group-hover:to-pink/30'
              } transition-colors duration-500`}></div>
              
              {plan.badge && (
                <div className="absolute top-6 right-6">
                  <span className="bg-gradient-to-r from-lavender to-pink text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-4 ${plan.popular ? 'text-lavender' : 'text-gray-900 group-hover:text-lavender transition-colors duration-300'}`}>{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-5xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="mb-3">
                      <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                      <span className="ml-2 text-green-600 font-bold">{plan.savings}</span>
                    </div>
                  )}
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  {/* Plan highlights */}
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-blue-50 text-blue-700">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{plan.deliveryTime}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-green-50 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">{plan.revisions}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-purple-50 text-purple-700">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">{plan.support}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3 group">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-lavender/10 group-hover:bg-lavender/20 transition-colors duration-300">
                        <Check className="w-4 h-4 text-lavender" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  onClick={() => {
                    trackCTAClick(`Select ${plan.name} Plan`, "pricing");
                    onGetStarted(plan);
                  }}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                    plan.popular
                      ? 'bg-gradient-to-r from-lavender to-pink text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-700 hover:bg-lavender/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative flex items-center">
                    Get Started <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-600 mb-4">Need a custom solution? Let's discuss your requirements.</p>
          <motion.button
            onClick={onCustomQuote}
            className="bg-gradient-to-r from-lavender to-pink text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us for Custom Quote
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Blog() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Scroll to next or previous item
  const scrollToItem = (direction: 'next' | 'prev') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('article')?.offsetWidth || 0;
      const gap = 32; // 8rem gap
      const scrollAmount = cardWidth + gap;
      
      if (direction === 'next') {
        carouselRef.current.scrollLeft += scrollAmount;
        if (currentIndex < blogPosts.length - 1) setCurrentIndex(prev => prev + 1);
      } else {
        carouselRef.current.scrollLeft -= scrollAmount;
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      }
    }
  };

  // Mouse events for drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current!.offsetLeft);
    setScrollLeft(carouselRef.current!.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current!.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    carouselRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <motion.section
      className="py-20 bg-white overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, tips, and insights from our development team.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Navigation buttons */}
          <div className="hidden md:block">
            <button 
              onClick={() => scrollToItem('prev')} 
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110'} transition-all duration-300`}
              aria-label="Previous article"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <button 
              onClick={() => scrollToItem('next')} 
              disabled={currentIndex === blogPosts.length - 1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg ${currentIndex === blogPosts.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110'} transition-all duration-300`}
              aria-label="Next article"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          {/* Carousel container */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 -mx-4 px-4"
            style={{ scrollBehavior: 'smooth' }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.title}
                className="flex-shrink-0 snap-center w-full md:w-[calc(33.333%-1.33rem)] mx-2 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={`${post.title} - ${post.category} article by ${post.author}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-sm text-gray-800 font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {blogPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (carouselRef.current) {
                    const cardWidth = carouselRef.current.querySelector('article')?.offsetWidth || 0;
                    const gap = 32;
                    carouselRef.current.scrollLeft = index * (cardWidth + gap);
                    setCurrentIndex(index);
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-lavender w-6' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TrackableLink
            href="/blog"
            text="View All Articles"
            category="blog"
            target="_blank"
            className="bg-gradient-to-r from-lavender to-pink text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center"
          >
            View All Articles
          </TrackableLink>
        </motion.div>
      </div>
    </motion.section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section
      className="py-20 bg-very-light-pink"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our services and development process.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-5 h-5 text-lavender" />
                </motion.div>
              </button>
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-600 mb-4">Still have questions? We're here to help!</p>
          <motion.button
            className="bg-gradient-to-r from-lavender to-pink text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function CallToAction({ onGetStarted, onScheduleCall }: { onGetStarted: () => void; onScheduleCall: () => void }) {
  return (
    <motion.section
      className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-black/10" />
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-24 h-24 bg-white/20 rounded-full"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="heading-professional text-4xl md:text-5xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Transform Your Business?
        </motion.h2>
        
        <motion.p
          className="text-xl text-white/90 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Let's discuss your project and explore how we can help you achieve your digital goals. 
          Get in touch with us today for a free consultation.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            onClick={onGetStarted}
            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={onScheduleCall}
            className="bg-transparent text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white hover:bg-white hover:text-indigo-600 transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Schedule a Call</span>
            <Phone className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 text-white py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-700/30">
                <span className="text-white font-bold">SD</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">Shivkara Digitals</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for custom software development, digital transformation, and business solutions that drive growth and efficiency.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-5 text-lg flex items-center">
              <span className="w-6 h-px bg-indigo-600 mr-3"></span>
              Services
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  Custom Software Development
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  Mobile App Development
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-blue-400 transition-colors cursor-pointer group flex items-center"
                >
                  <span className="w-0 h-px bg-blue-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  Web Design & Development
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-blue-400 transition-colors cursor-pointer group flex items-center"
                >
                  <span className="w-0 h-px bg-blue-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  Digital Transformation
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-5 text-lg flex items-center">
              <span className="w-6 h-px bg-blue-500 mr-3"></span>
              Company
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="hover:text-blue-400 transition-colors cursor-pointer group flex items-center"
                >
                  <span className="w-0 h-px bg-blue-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="hover:text-blue-400 transition-colors cursor-pointer group flex items-center"
                >
                  <span className="w-0 h-px bg-blue-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  Our Team
                </button>
              </li>
              <li>
                <a 
                  href="mailto:info@shivkaradigital.com?subject=Career%20Opportunity"
                  className="hover:text-blue-400 transition-colors cursor-pointer group flex items-center"
                >
                  <span className="w-0 h-px bg-blue-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  Careers
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-blue-400 transition-colors cursor-pointer group flex items-center"
                >
                  <span className="w-0 h-px bg-blue-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-5 text-lg flex items-center">
              <span className="w-6 h-px bg-blue-500 mr-3"></span>
              Connect
            </h3>
            <div className="flex space-x-4 mt-2">
              <a href="https://instagram.com/shivkaradigital" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 group">
                <FaInstagram className="text-gray-400 group-hover:text-white" />
              </a>

            </div>
            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@shivkaradigital.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  info@shivkaradigital.com
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p className="text-gray-500 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}>
            &copy; 2025 Shivkara Digitals. All rights reserved.
          </motion.p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-lavender to-pink text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center pulse-glow ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 0 30px rgba(240, 166, 202, 0.6)"
      }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <ChevronDown className="w-6 h-6 transform rotate-180" />
      </motion.div>
    </motion.button>
  );
}

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-lavender to-pink flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg pulse-glow"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            SD
          </motion.span>
        </motion.div>
        <motion.h1
          className="text-2xl font-bold text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Shivkara Digitals
        </motion.h1>
        <motion.p
          className="text-white/80"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading your digital experience...
        </motion.p>
        
        {/* Loading dots */}
        <motion.div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
  const [isScheduleCallModalOpen, setIsScheduleCallModalOpen] = useState(false);
  const [isCustomQuoteModalOpen, setIsCustomQuoteModalOpen] = useState(false);
  const [isClaimOfferModalOpen, setIsClaimOfferModalOpen] = useState(false);
  const [isPlanSelectionModalOpen, setIsPlanSelectionModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Lead Capture Popup Hook
  const { isPopupOpen, closePopup, handleSubmit } = useLeadCapturePopup();

  return (
    <div className="min-h-screen relative">

      {/* Particle Background */}
      <ParticleBackground />
      <FloatingElements />
      
      {/* WhatsApp Chat Widget */}
      <WhatsAppChat phoneNumber="919521699090" />
      
      <AnimatePresence>
        <LoadingScreen key="loading" />
      </AnimatePresence>
      <Header onGetStarted={() => setIsGetStartedModalOpen(true)} />
      <div className="mt-24">{/* Prevent header overlap */}
        <Hero onContact={() => setIsContactModalOpen(true)} />
        <TrustSignals />
        <TechnologyStack />
        <Process />
        <Services />
        <Features onCustomQuote={() => setIsCustomQuoteModalOpen(true)} />
        <Projects />
        <Testimonials />
        <SpecialOffers onClaimOffer={(offer) => {
          setSelectedOffer(offer);
          setIsClaimOfferModalOpen(true);
        }} />
        <Pricing 
          onCustomQuote={() => setIsCustomQuoteModalOpen(true)}
          onGetStarted={(plan) => {
            setSelectedPlan(plan);
            setIsPlanSelectionModalOpen(true);
          }}
        />
        <Team />
        <Blog />
        <FAQ />
        <Location />
        <Contact />
        <CallToAction 
          onGetStarted={() => setIsGetStartedModalOpen(true)}
          onScheduleCall={() => setIsScheduleCallModalOpen(true)}
        />
        <Footer />
        <FloatingActionButton />
      </div>
  <FloatingActionButton />

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Contact Us"
        size="lg"
      >
        <ContactForm />
      </Modal>

      {/* Get Started Modal */}
      <Modal
        isOpen={isGetStartedModalOpen}
        onClose={() => setIsGetStartedModalOpen(false)}
        title="Start Your Project"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender to-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Business?</h3>
            <p className="text-gray-600">Let's discuss your project and create something amazing together.</p>
          </div>
          <ContactForm />
        </div>
      </Modal>

      {/* Schedule Call Modal */}
      <Modal
        isOpen={isScheduleCallModalOpen}
        onClose={() => setIsScheduleCallModalOpen(false)}
        title="Schedule a Call"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender to-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Book a Free Consultation</h3>
            <p className="text-gray-600">Choose a time that works best for you.</p>
          </div>
          
          <div className="grid gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-lavender transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Quick Chat (15 min)</h4>
                  <p className="text-sm text-gray-600">Perfect for initial discussions</p>
                </div>
                <ClockIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-lavender transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Project Discussion (30 min)</h4>
                  <p className="text-sm text-gray-600">Detailed project planning</p>
                </div>
                <UsersIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-lavender transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Technical Review (45 min)</h4>
                  <p className="text-sm text-gray-600">Deep technical consultation</p>
                </div>
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-lavender to-pink text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
            Schedule Now
          </button>
        </div>
      </Modal>

      {/* Custom Quote Modal */}
      <Modal
        isOpen={isCustomQuoteModalOpen}
        onClose={() => setIsCustomQuoteModalOpen(false)}
        title="Get Custom Quote"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender to-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Get Your Custom Quote</h3>
            <p className="text-gray-600">Tell us about your project and we'll provide a detailed estimate.</p>
          </div>
          <ContactForm />
        </div>
      </Modal>

      {/* Claim Offer Modal */}
      <Modal
        isOpen={isClaimOfferModalOpen}
        onClose={() => {
          setIsClaimOfferModalOpen(false);
          setSelectedOffer(null);
        }}
        title="Claim Special Offer"
        size="lg"
      >
        <OfferClaimForm
          offerDetails={selectedOffer ? {
            title: selectedOffer.title,
            offerPrice: selectedOffer.offerPrice,
            originalPrice: selectedOffer.originalPrice,
            savings: selectedOffer.savings
          } : undefined}
          onSuccess={() => {
            setIsClaimOfferModalOpen(false);
            setSelectedOffer(null);
          }}
        />
      </Modal>

      {/* Plan Selection Modal */}
      <Modal
        isOpen={isPlanSelectionModalOpen}
        onClose={() => {
          setIsPlanSelectionModalOpen(false);
          setSelectedPlan(null);
        }}
        title="Get Started with Your Plan"
        size="lg"
      >
        <PlanSelectionForm
          planDetails={selectedPlan ? {
            name: selectedPlan.name,
            price: selectedPlan.price,
            period: selectedPlan.period
          } : undefined}
          onSuccess={() => {
            setIsPlanSelectionModalOpen(false);
            setSelectedPlan(null);
          }}
        />
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
