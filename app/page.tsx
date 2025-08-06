"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
import Link from 'next/link';
import Image from 'next/image';
import { projects } from "../lib/projects";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaAws, FaGoogle, FaMicrosoft, FaVuejs, FaAngular, FaPhp } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiMongodb, SiPostgresql, SiRedis, SiKubernetes, SiTerraform, SiJenkins, SiGithub, SiGitlab, SiSlack, SiJira, SiConfluence, SiFigma, SiAdobe, SiSketch, SiNextdotjs, SiLaravel, SiDjango, SiMysql, SiAmazon, SiFlutter, SiIonic } from 'react-icons/si';
import { usePathname } from 'next/navigation';
import { Modal } from "../components/ui/modal";
import { ContactForm } from "../components/ContactForm";
import { OfferClaimForm, PlanSelectionForm } from "../components/SpecialForms";
import { app } from "../lib/firebase";
import { ParticleBackground, FloatingElements } from "../components/ui/particles";
import { EnhancedCard, GradientCard, GlassCard } from "../components/ui/enhanced-card";
import { TechSlider } from "../components/ui/tech-slider";
import FeaturedProjects from "../components/FeaturedProjects";

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
  { number: "50+", label: "Projects Completed", icon: <CheckCircle className="w-6 h-6" /> },
  { number: "25+", label: "Happy Clients", icon: <Heart className="w-6 h-6" /> },
  { number: "3+", label: "Years Experience", icon: <Award className="w-6 h-6" /> },
  { number: "99%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> }
];

const achievements = [
  {
    title: "ISO 27001 Certified",
    description: "Information Security Management System",
    icon: <Shield className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Microsoft Partner",
    description: "Official Microsoft Development Partner",
    icon: <FaMicrosoft className="w-8 h-8" />,
    color: "from-blue-600 to-blue-800"
  },
  {
    title: "AWS Partner",
    description: "Amazon Web Services Partner Network",
    icon: <FaAws className="w-8 h-8" />,
    color: "from-orange-500 to-yellow-500"
  },
  {
    title: "Google Cloud Partner",
    description: "Google Cloud Platform Partner",
    icon: <FaGoogle className="w-8 h-8" />,
    color: "from-blue-500 to-green-500"
  }
];

const testimonials = [
  {
    name: "Himanshu Jain",
    role: "Founder, Tree Nuts",
    content: "Shivkara Digitals delivered an exceptional e-commerce platform that transformed our business. Their attention to detail and technical expertise exceeded our expectations.",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "Tree Nuts"
  },
  {
    name: "Nikki Moolchandani",
    role: "Founder, NikkiFashion",
    content: "The custom website and e-commerce solution they built for our fashion brand has significantly increased our online sales and customer engagement.",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "NikkiFashion"
  },
  {
    name: "Sawai Singh",
    role: "Owner, Vehicle On Rent",
    content: "Their vehicle rental management system has streamlined our operations and improved customer satisfaction. The platform is user-friendly and highly efficient.",
    rating: 5,
    avatar: "/placeholder-user.jpg",
    company: "Vehicle On Rent"
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
    name: "Basic Website",
    price: "₹7,000",
    period: "project",
    description: "Perfect for small businesses and startups",
    features: [
      "Responsive website design",
      "Up to 5 pages",
      "Contact form",
      "SEO optimization",
      "1 month support",
      "Basic analytics",
      "Mobile-friendly design",
      "Fast loading speed"
    ],
    popular: false,
    color: "from-blue-500 to-cyan-500",
    badge: null
  },
  {
    name: "Business Website + Android App",
    price: "₹75,000",
    period: "combo",
    description: "Complete digital presence with mobile app",
    features: [
      "Professional website (up to 10 pages)",
      "Android mobile application",
      "Admin dashboard",
      "Database integration",
      "8 months support",
      "Payment gateway setup",
      "Push notifications",
      "App store publishing"
    ],
    popular: true,
    color: "from-purple-500 to-pink-500",
    badge: "BEST VALUE"
  },
  {
    name: "Enterprise Solution",
    price: "₹1,00,000",
    period: "project",
    description: "For large-scale enterprise solutions",
    features: [
      "Full-stack web application",
      "Custom mobile apps (iOS & Android)",
      "Scalable architecture",
      "API development",
      "12 months support",
      "24/7 monitoring",
      "Custom integrations",
      "Dedicated project manager"
    ],
    popular: false,
    color: "from-orange-500 to-red-500",
    badge: "PREMIUM"
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
    image: "/placeholder.jpg",
    tags: ["Web Development", "Trends", "2025"]
  },
  {
    title: "Building Scalable E-commerce Solutions",
    excerpt: "Learn the best practices for creating e-commerce platforms that can handle high traffic and growth.",
    author: "Vansh Gehlot",
    date: "Jan 10, 2025",
    readTime: "8 min read",
    category: "E-commerce",
    image: "/placeholder.jpg",
    tags: ["E-commerce", "Scalability", "Best Practices"]
  },
  {
    title: "Mobile App Development: Native vs Cross-Platform",
    excerpt: "A comprehensive comparison of native and cross-platform mobile app development approaches.",
    author: "Shubham Dadhich",
    date: "Jan 5, 2025",
    readTime: "6 min read",
    category: "Mobile Development",
    image: "/placeholder.jpg",
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
          ? 'bg-white/95 backdrop-blur-xl shadow-professional-lg border-b border-gray-200' 
          : 'bg-white/80 backdrop-blur-lg'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ 
        boxShadow: isScrolled 
          ? '0 8px 32px 0 rgba(102, 126, 234, 0.15), 0 4px 16px 0 rgba(0, 0, 0, 0.1)' 
          : '0 4px 20px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/logo.jpeg" alt="Shivkara Digital Logo" className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">
              Shivkara Digital
            </span>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Services', 'Projects', 'About', 'Contact'].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-professional font-medium transition-all duration-300 px-4 py-2 rounded-lg focus-professional ${
                  activeSection === item.toLowerCase()
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-professional'
                    : 'hover:text-indigo-600 hover:bg-gray-50'
                }`}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get Started
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounts();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounts = () => {
    const targets = { projects: 50, clients: 25, experience: 3, satisfaction: 99 };
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
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      style={{ opacity }}
    >
      {/* Enhanced Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-60"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-60"
        animate={{
          scale: [2, 1, 1, 2, 2],
          rotate: [360, 270, 180, 90, 0],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-60"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-lavender/30 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-6 h-6 bg-pink/30 rounded-full"
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(156, 137, 184, 0.3)"
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-teal" />
            </motion.div>
            <span className="text-gray-700 font-medium">Transforming Businesses Digitally</span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="gradient-text-animated">
            Shivkara Digitals
          </span>
          <br />
          <span className="text-gray-900">Professional Software Solutions</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Typewriter
            texts={[
              "Enterprise-grade software solutions starting from ₹7,000.",
              "Complete digital transformation with website + mobile apps.",
              "ISO 27001 certified with Microsoft, AWS & Google Cloud partnerships."
            ]}
            speed={50}
            pause={2000}
          />
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.button
            onClick={() => window.location.href = '#projects'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore Our Work</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={onContact}
            className="bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-gray-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Let's Talk</span>
            <Phone className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="counter text-3xl md:text-4xl font-bold text-gray-900 mb-1">{counts.projects}+</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </motion.div>
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <div className="counter text-3xl md:text-4xl font-bold text-gray-900 mb-1">{counts.clients}+</div>
            <div className="text-sm text-gray-600">Happy Clients</div>
          </motion.div>
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="counter text-3xl md:text-4xl font-bold text-gray-900 mb-1">{counts.experience}+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </motion.div>
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white">
                <Star className="w-6 h-6" />
              </div>
            </div>
            <div className="counter text-3xl md:text-4xl font-bold text-gray-900 mb-1">{counts.satisfaction}%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-gray-400" />
      </motion.div>
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

        <div className="grid md:grid-cols-5 gap-8">
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
                    className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white mb-6 mx-auto`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                  {step.icon}
                  </motion.div>
                
                  <div className="text-sm font-bold text-lavender mb-2">{step.step}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
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
      className="py-16 bg-gradient-to-br from-slate-50 to-blue-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-professional text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text-animated">Services</span>
          </h2>
          <p className="text-professional text-xl text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive software solutions tailored to meet your business needs and drive digital transformation.
          </p>
        </motion.div>

        <div className="grid-professional">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="card-professional group tilt-card morphing-shape"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-6`}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                {service.icon}
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: featureIndex * 0.1 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-lavender rounded-full"
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
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

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <EnhancedCard
              key={testimonial.name}
              hoverEffect="scale"
              delay={index * 0.2}
              className="relative"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white font-bold mr-4"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                >
                  {testimonial.name.charAt(0)}
                </motion.div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <motion.p 
                className="text-gray-700 mb-6 italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{testimonial.content}"
              </motion.p>
              
              <div className="flex items-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>
            </EnhancedCard>
          ))}
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

function Achievements() {
  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
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
            Our <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Certifications</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We maintain the highest standards in security, quality, and partnerships with leading technology providers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                {achievement.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900">{achievement.title}</h3>
              <p className="text-gray-600 text-sm">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Features() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard
              key={feature.title}
              delay={index * 0.1}
              className="group"
            >
              <motion.div 
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
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
              className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-lavender/20 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Offer Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-12">
                LIMITED TIME
              </div>

              {/* Price Section */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2 text-gray-900">{offer.title}</h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl text-gray-400 line-through">{offer.originalPrice}</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">
                    {offer.offerPrice}
                  </span>
                </div>
                
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold inline-block">
                  Save {offer.savings}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Valid Until */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">
                  Valid until: <span className="font-semibold text-red-500">{offer.validUntil}</span>
                </p>
              </div>

              <motion.button
                onClick={() => onClaimOffer(offer)}
                className="w-full py-4 bg-gradient-to-r from-lavender to-pink text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Claim This Offer
              </motion.button>
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
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                plan.popular 
                  ? 'border-lavender scale-105' 
                  : 'border-gray-100'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-lavender to-pink text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => onGetStarted(plan)}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-lavender to-pink text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
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
            Latest <span className="bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, tips, and insights from our development team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="h-48 bg-gradient-to-br from-lavender/20 to-pink/20 flex items-center justify-center">
                <FileText className="w-16 h-16 text-lavender" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-sm text-lavender font-medium">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-lavender to-pink rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.button
            onClick={() => window.open('/blog', '_blank')}
            className="bg-gradient-to-r from-lavender to-pink text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Articles
          </motion.button>
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
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender to-pink rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">SD</span>
              </div>
              <span className="text-xl font-bold">Shivkara Digitals</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner for custom software development, digital transformation, and business solutions that drive growth and efficiency.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
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
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  Web Design & Development
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  Digital Transformation
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  Our Team
                </button>
              </li>
              <li>
                <a 
                  href="mailto:shivkaradigitals@gmail.com?subject=Career%20Opportunity"
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  Careers
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-lavender transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex space-x-4 mt-2">
              <a href="https://linkedin.com/company/shivkara-digitals" target="_blank" rel="noopener noreferrer" className="hover:text-lavender transition-colors text-2xl">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com/shivkaradigital" target="_blank" rel="noopener noreferrer" className="hover:text-lavender transition-colors text-2xl">
                <FaTwitter />
              </a>
              <a href="https://github.com/shivkara-digitals" target="_blank" rel="noopener noreferrer" className="hover:text-lavender transition-colors text-2xl">
                <FaGithub />
              </a>
              <a href="https://instagram.com/shivkaradigitals" target="_blank" rel="noopener noreferrer" className="hover:text-lavender transition-colors text-2xl">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        
        <motion.div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}>
          <p>&copy; 2025 Shivkara Digitals. All rights reserved.</p>
        </motion.div>
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

  return (
    <div className="min-h-screen relative">

      {/* Particle Background */}
      <ParticleBackground />
      <FloatingElements />
      
      <AnimatePresence>
        <LoadingScreen key="loading" />
      </AnimatePresence>
      <Header onGetStarted={() => setIsGetStartedModalOpen(true)} />
      <Hero onContact={() => setIsContactModalOpen(true)} />
      <TechnologyStack />
      <Process />
      <Services />
      <Features />
      <Achievements />
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
      <Contact />
      <CallToAction 
        onGetStarted={() => setIsGetStartedModalOpen(true)}
        onScheduleCall={() => setIsScheduleCallModalOpen(true)}
      />
      <Footer />
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
    </div>
  );
}
