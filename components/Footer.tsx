"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

interface FooterProps {
  currentPage?: string;
}

export default function Footer({ currentPage = "home" }: FooterProps) {
  const scrollToSection = (sectionId: string) => {
    if (currentPage === "home") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page with hash
      window.location.href = `/#${sectionId}`;
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
                <Link 
                  href="/articles"
                  className="hover:text-blue-400 transition-colors cursor-pointer group flex items-center"
                >
                  <span className="w-0 h-px bg-blue-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  Articles & Blog
                </Link>
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
            <Link href="/privacy" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
