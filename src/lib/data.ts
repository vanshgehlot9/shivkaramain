import { FC } from 'react';
import { Code, Smartphone, Palette, Zap, Shield, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: string;
}

export const services: Service[] = [
  {
    icon: Code,
    title: "Custom Software Development",
    description: "Tailored software solutions designed to meet your specific business requirements and drive growth.",
    features: ["Enterprise Applications", "Custom APIs", "Database Design", "System Integration"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that enhance customer engagement and business efficiency.",
    features: ["iOS & Android Apps", "Cross-platform Solutions", "App Maintenance", "Performance Optimization"],
    color: "from-blue-600 to-indigo-600"
  },
  {
    icon: Palette,
    title: "Web Design & Development",
    description: "Professional websites and web applications that establish your brand and convert visitors to customers.",
    features: ["Responsive Design", "E-commerce Solutions", "CMS Development", "SEO Optimization"],
    color: "from-teal-500 to-blue-500"
  },
  {
    icon: Zap,
    title: "Digital Transformation",
    description: "Comprehensive digital solutions to modernize your business processes and improve operational efficiency.",
    features: ["Process Automation", "Cloud Migration", "Legacy System Updates", "Digital Strategy"],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "IT Consulting & Support",
    description: "Expert technology consulting and ongoing support to ensure your digital solutions perform optimally.",
    features: ["Technology Assessment", "System Maintenance", "24/7 Support", "Security Audits"],
    color: "from-indigo-600 to-blue-600"
  },
  {
    icon: Users,
    title: "Business Solutions",
    description: "End-to-end business solutions including CRM, ERP, and custom management systems.",
    features: ["CRM Implementation", "ERP Systems", "Business Intelligence", "Workflow Automation"],
    color: "from-teal-500 to-cyan-500"
  }
];
