import { db } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Comprehensive pricing data for Shivkara Digital
const pricingData = [
  // E-Commerce Development Plans
  {
    name: "WordPress E-Commerce (WooCommerce)",
    description: "Complete WooCommerce setup with domain, hosting, themes & plugins",
    category: "E-commerce Solutions",
    price: 27000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: ₹3,360/year + GST", 
        "Themes & Plugins: ₹4,000 – ₹15,000",
        "Development Cost: ₹7,000"
      ],
      timeline: "2-3 weeks",
      support: "3 months free"
    }
  },
  {
    name: "Shopify E-Commerce Store",
    description: "Professional Shopify store setup with custom themes and apps",
    category: "E-commerce Solutions",
    price: 44500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting (Shopify Plan): ₹18,000/year + GST",
        "Themes & Apps: ₹1,500 – ₹15,000/month",
        "Development Cost: ₹10,000"
      ],
      timeline: "2-3 weeks",
      support: "3 months free"
    }
  },
  {
    name: "Custom E-Commerce Website (Small Business)",
    description: "Custom coded e-commerce with Firebase database and UI design",
    category: "E-commerce Solutions", 
    price: 36500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "Firebase Database: 50GB Free",
        "Development + UI Design: ₹35,000",
        "Free Maintenance: 6 months"
      ],
      timeline: "Within 1 month",
      support: "6 months free"
    }
  },
  {
    name: "E-Commerce App + Website (Small Business)",
    description: "Complete solution with both mobile app and website",
    category: "E-commerce Solutions",
    price: 51500,
    currency: "INR", 
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "Firebase Database: 50GB Free", 
        "Development + UI Design: ₹50,000",
        "Free Maintenance: 6 months"
      ],
      timeline: "Within 1 month",
      support: "6 months free"
    }
  },

  // Blog Website Development Plans
  {
    name: "WordPress Blog Website",
    description: "Professional WordPress blog setup with premium themes",
    category: "Web Development",
    price: 13900,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: ₹3,360/year + GST",
        "Premium Theme: ₹5,000",
        "Development & Setup: ₹4,000"
      ],
      timeline: "1-2 weeks",
      support: "3 months free"
    }
  },
  {
    name: "Custom Designed Blog (Advanced UI/UX)", 
    description: "Custom blog with advanced UI/UX design and hosting",
    category: "Web Development",
    price: 12500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "UI/UX Design: ₹5,000", 
        "Development: ₹6,000"
      ],
      timeline: "2-3 weeks",
      support: "3 months free"
    }
  },
  {
    name: "Blog + Mobile App",
    description: "Blog website with companion mobile app and notifications",
    category: "Mobile App Development",
    price: 16500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "Firebase Backend: Free up to 50GB",
        "Website + Mobile App: ₹15,000"
      ],
      timeline: "3-4 weeks",
      support: "6 months free"
    }
  },

  // Food Delivery App Development Plans
  {
    name: "Basic Food Delivery App (Small Restaurant)",
    description: "Customer app + admin panel for small restaurants/cloud kitchens",
    category: "Mobile App Development",
    price: 31500,
    currency: "INR", 
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "Firebase Database: Free up to 50GB",
        "Customer App + Admin Panel: ₹30,000"
      ],
      timeline: "1 month",
      support: "6 months free"
    }
  },
  {
    name: "Advanced Food Delivery Platform (Swiggy Clone)",
    description: "Complete food delivery system with multiple apps and dashboards",
    category: "Mobile App Development",
    price: 56500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: ₹5,000/year",
        "Firebase Backend: Free up to 50GB", 
        "Full Platform Development: ₹50,000",
        "Customer App, Delivery App, Restaurant Dashboard, Admin Panel"
      ],
      timeline: "2 months",
      support: "6 months free"
    }
  },
  {
    name: "Enterprise Food Delivery App (Full-Scale)",
    description: "Complete enterprise solution with all features and integrations",
    category: "Mobile App Development",
    price: 126500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Cloud Hosting: ₹10,000-25,000/month",
        "Full Development: ₹1,00,000",
        "Payment Gateway, Wallet, Real-Time Tracking",
        "All Apps + Dashboards"
      ],
      timeline: "4-6 months",
      support: "6 months free"
    }
  },

  // Vehicle GPS Tracking Solution
  {
    name: "GPS Device (Per Vehicle)",
    description: "GPS hardware device with SIM and installation",
    category: "Hardware Solutions",
    price: 4000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "GPS Device: ₹2,000-4,000",
        "SIM & Installation: ₹500-1,000",
        "AIS 140 certified options available"
      ],
      timeline: "1-2 days",
      support: "Hardware warranty"
    }
  },
  {
    name: "Vehicle GPS Tracking Software Platform",
    description: "Complete tracking software with web dashboard and mobile app",
    category: "Custom Software",
    price: 177000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Cloud Hosting: ₹25,000/year",
        "Software Development: ₹1,50,000",
        "Live Tracking, Geo-fencing, Reports, Multi-vehicle Management"
      ],
      timeline: "2-3 months",
      support: "6 months free"
    }
  },
  {
    name: "GPS Tracking Monthly Subscription (Per Vehicle)",
    description: "Monthly subscription for GPS tracking services",
    category: "Maintenance & Support",
    price: 300,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "SIM recharge included",
        "Server usage & maintenance",
        "Real-time tracking access"
      ],
      timeline: "Immediate activation",
      support: "24/7 support"
    }
  },

  // Business Website Development
  {
    name: "Static Business Website (3-5 Pages)",
    description: "Professional static website for company profile and portfolio",
    category: "Web Development",
    price: 10860,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: ₹3,360/year + GST",
        "Development: ₹6,000"
      ],
      timeline: "1-2 weeks",
      support: "3 months free"
    }
  },
  {
    name: "Dynamic Business Website (CMS Editable)",
    description: "Content management system for regular updates",
    category: "Web Development", 
    price: 19860,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: ₹3,360/year + GST",
        "CMS Development: ₹15,000"
      ],
      timeline: "2-3 weeks",
      support: "3 months free"
    }
  },

  // E-Learning Platform
  {
    name: "Standard E-Learning Website",
    description: "LMS with course upload, quizzes, certificates, and payments",
    category: "Custom Software",
    price: 81500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "LMS Development: ₹80,000",
        "User login, quizzes, certificates, payment gateway"
      ],
      timeline: "6-8 weeks",
      support: "6 months free"
    }
  },
  {
    name: "E-Learning Website + Mobile App",
    description: "Complete e-learning solution with website and mobile apps",
    category: "Custom Software",
    price: 121500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "Firebase Backend: Free up to 50GB",
        "Website + Mobile Apps: ₹1,20,000"
      ],
      timeline: "8-10 weeks", 
      support: "6 months free"
    }
  },

  // Healthcare / Fitness / Diet Tracking
  {
    name: "Basic Fitness / Diet Tracking App",
    description: "Simple fitness and diet tracking mobile application",
    category: "Mobile App Development",
    price: 31500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "Firebase Backend: Free up to 50GB",
        "Mobile App Development: ₹30,000"
      ],
      timeline: "4-6 weeks",
      support: "6 months free"
    }
  },
  {
    name: "Advanced Fitness App + Web Dashboard",
    description: "Complete fitness solution with mobile app and web dashboard",
    category: "Mobile App Development",
    price: 76500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "Firebase Backend: Free up to 50GB",
        "Mobile App + Web Dashboard: ₹75,000"
      ],
      timeline: "6-8 weeks",
      support: "6 months free"
    }
  },

  // Travel & Booking System
  {
    name: "Tour / Hotel Booking Website",
    description: "Booking system for tour packages and hotels",
    category: "Web Development",
    price: 26500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: ₹5,000/year",
        "Development: ₹25,000",
        "Booking system, payment gateway"
      ],
      timeline: "4-6 weeks",
      support: "6 months free"
    }
  },
  {
    name: "Advanced Booking Platform (Multi-service)",
    description: "Complete booking platform for flights, bus, and multiple services",
    category: "Custom Software",
    price: 67000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year", 
        "Hosting: 100GB Free",
        "Firebase Backend: Free up to 50GB",
        "Website + Mobile App: ₹65,000"
      ],
      timeline: "8-10 weeks",
      support: "6 months free"
    }
  },

  // ERP / CRM Solutions
  {
    name: "Small Business ERP / CRM",
    description: "Basic ERP/CRM for inventory, billing, HR, and reports",
    category: "Custom Software",
    price: 21500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Hosting: 100GB Free",
        "ERP/CRM Development: ₹20,000",
        "Inventory, billing, HR, reports"
      ],
      timeline: "4-6 weeks",
      support: "6 months free"
    }
  },
  {
    name: "Advanced Enterprise ERP / CRM",
    description: "Advanced ERP/CRM with multi-department management and analytics",
    category: "Custom Software",
    price: 71500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹1,500/year",
        "Cloud Hosting: 100GB Free",
        "ERP/CRM Development: ₹70,000",
        "Multi-department, analytics, custom modules, integrations"
      ],
      timeline: "8-12 weeks",
      support: "6 months free"
    }
  },

  // SaaS Platforms
  {
    name: "Standard SaaS Platform",
    description: "Multi-tenant SaaS platform with billing and analytics",
    category: "Custom Software",
    price: 100000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Domain + Email: ₹2,000/year",
        "Cloud Hosting: 100GB Free",
        "SaaS Development: ₹98,000",
        "Multi-tenant architecture, billing, analytics"
      ],
      timeline: "12-16 weeks",
      support: "6 months free"
    }
  },

  // Social Media Content & Management
  {
    name: "Social Media Image Creation (Per Image)",
    description: "Custom graphics with branding and text overlay",
    category: "Digital Marketing",
    price: 350,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Custom graphics design",
        "Branding and text overlay",
        "Optimized for multiple platforms"
      ],
      timeline: "1-2 days",
      support: "2 revisions included"
    }
  },
  {
    name: "Social Media Video Creation (Basic)",
    description: "Short videos with editing, captions, and music",
    category: "Digital Marketing",
    price: 500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Video editing and captions",
        "Background music",
        "Branding elements"
      ],
      timeline: "2-3 days",
      support: "2 revisions included"
    }
  },
  {
    name: "Advanced Video with Animation",
    description: "Complex videos with animations and special effects",
    category: "Digital Marketing",
    price: 2500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Animation and special effects",
        "Professional editing",
        "Custom graphics and transitions"
      ],
      timeline: "5-7 days",
      support: "3 revisions included"
    }
  },
  {
    name: "Social Media Management - Basic Package",
    description: "Monthly social media management with posting and scheduling",
    category: "Digital Marketing",
    price: 5000,
    currency: "INR", 
    status: "active",
    details: {
      inclusions: [
        "Up to 12 posts per month",
        "Content scheduling",
        "Basic engagement management"
      ],
      timeline: "Monthly service",
      support: "Monthly reporting"
    }
  },
  {
    name: "Social Media Management - Standard Package",
    description: "Enhanced social media management with more posts and engagement",
    category: "Digital Marketing",
    price: 10000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Up to 25 posts per month",
        "Content scheduling",
        "Community management",
        "Performance tracking"
      ],
      timeline: "Monthly service",
      support: "Weekly reporting"
    }
  },
  {
    name: "Social Media Management - Premium Package", 
    description: "Complete social media management with full engagement and reporting",
    category: "Digital Marketing",
    price: 20000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Up to 50 posts per month",
        "Full engagement management",
        "Detailed analytics and reporting",
        "Strategy consultations"
      ],
      timeline: "Monthly service",
      support: "Daily monitoring"
    }
  },

  // SEO Services
  {
    name: "Basic SEO Package",
    description: "Essential SEO services for small businesses and startups",
    category: "Digital Marketing",
    price: 8750,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Website audit & keyword research",
        "On-page optimization",
        "Search engine submission",
        "Monthly reporting"
      ],
      timeline: "Monthly service",
      support: "3-6 month minimum"
    }
  },
  {
    name: "Standard SEO Package",
    description: "Comprehensive SEO with content optimization and local SEO",
    category: "Digital Marketing",
    price: 17500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Everything in Basic Package",
        "Content optimization for 5-10 pages",
        "Local SEO & Google My Business",
        "10-20 quality backlinks/month"
      ],
      timeline: "Monthly service",
      support: "3-6 month minimum"
    }
  },
  {
    name: "Premium SEO Package",
    description: "Advanced SEO with content creation and comprehensive strategy",
    category: "Digital Marketing",
    price: 32500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Everything in Standard Package", 
        "4-8 blog posts/month",
        "20-50 quality backlinks/month",
        "Competitor analysis",
        "Weekly reporting"
      ],
      timeline: "Monthly service",
      support: "6 month minimum"
    }
  },

  // Automation Tools & Workflow Solutions
  {
    name: "Basic Automation Tool",
    description: "Simple workflow automation for small businesses",
    category: "Custom Software",
    price: 32500,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Simple workflow automation",
        "1-2 platform integrations",
        "Basic monitoring dashboard"
      ],
      timeline: "4-6 weeks",
      support: "3 months free"
    }
  },
  {
    name: "Standard Automation Tool",
    description: "Multiple workflow automations with platform integrations",
    category: "Custom Software",
    price: 65000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Multiple workflow automations",
        "Multiple platform integrations",
        "Analytics dashboard"
      ],
      timeline: "6-8 weeks",
      support: "6 months free"
    }
  },
  {
    name: "Advanced Custom Automation Platform",
    description: "Enterprise-level automation with AI-based suggestions",
    category: "Custom Software",
    price: 200000,
    currency: "INR",
    status: "active",
    details: {
      inclusions: [
        "Full business process automation",
        "API integrations",
        "AI-based automation suggestions",
        "Advanced dashboards and alerts"
      ],
      timeline: "12-16 weeks",
      support: "6 months free"
    }
  }
];

// Function to add all pricing data to Firestore
export async function addPricingData() {
  console.log("Starting to add pricing data...");
  
  try {
    for (const product of pricingData) {
      await addDoc(collection(db, "products"), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`Added: ${product.name}`);
    }
    
    console.log(`Successfully added ${pricingData.length} products to the database!`);
    return { success: true, count: pricingData.length };
  } catch (error) {
    console.error("Error adding pricing data:", error);
    return { success: false, error };
  }
}

// Export the data for reference
export { pricingData };
