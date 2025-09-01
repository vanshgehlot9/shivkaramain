"use client";
import { useState } from 'react';
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

interface FooterProps {
  currentPage?: string;
}

export default function Footer({ currentPage = "home" }: FooterProps) {
  const [showPolicy, setShowPolicy] = useState(false);
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
                 className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 group">
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
            <button onClick={() => setShowPolicy(true)} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">Cancellation & Refund Policy</button>
            <Link href="/cancellation-policy" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">View full policy</Link>
          </div>
        </div>
      </div>
      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPolicy(false)} aria-hidden="true"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative max-w-3xl mx-4 w-full bg-white rounded-xl shadow-2xl p-6 md:p-8 z-10 overflow-y-auto max-h-[85vh] text-gray-900"
            role="dialog"
            aria-modal="true"
            aria-label="Cancellation and Refund Policy"
          >
            <button
              onClick={() => setShowPolicy(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close policy"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-3">Shivkara Digital – Cancellation & Refund Policy</h2>
            <p className="text-gray-700 mb-4">At Shivkara Digital, we value transparency and customer trust. Our subscription plans are designed to be flexible so you can choose what works best for your business. You can cancel your subscription at any time depending on your plan type.</p>

            <h3 className="font-semibold mt-4">Monthly Plan (₹2,499):</h3>
            <ul className="list-disc pl-5 text-gray-700 mb-3">
              <li>Cancel anytime before renewal.</li>
              <li>No refunds for partial months; access remains until the end of current billing period.</li>
            </ul>

            <h3 className="font-semibold mt-2">Yearly Plan (₹19,999):</h3>
            <ul className="list-disc pl-5 text-gray-700 mb-3">
              <li>Full refund if canceled within 7 days of purchase.</li>
              <li>After 7 days, no refunds are provided but you retain access until subscription term ends.</li>
            </ul>

            <h3 className="font-semibold mt-2">Special Launch Offer (valid till 31st October 2025):</h3>
            <ul className="list-disc pl-5 text-gray-700 mb-3">
              <li>If you cancel before delivery of the FREE Social Media Starter Pack, that benefit will be voided.</li>
              <li>Discounts offered during the launch (including the 5% discount) are non-refundable.</li>
            </ul>

            <h3 className="font-semibold mt-2">General Rules:</h3>
            <ul className="list-disc pl-5 text-gray-700 mb-4">
              <li>Domains, third-party services, or add-ons purchased separately are non-refundable.</li>
              <li>Refunds due to technical issues or failure to deliver services will be reviewed on a case-by-case basis.</li>
              <li>Cancellations can be made via email at <a href="mailto:info@shivkaradigital.com" className="text-blue-600 underline">info@shivkaradigital.com</a> or through your client dashboard (if applicable).</li>
            </ul>

            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Quick Summary</h4>
              <ul className="text-gray-700 list-disc pl-5">
                <li><strong>Monthly Plan (₹2,499):</strong> Cancel anytime before renewal. No refunds for partial months.</li>
                <li className="mt-2"><strong>Yearly Plan (₹19,999):</strong> Full refund if canceled within 7 days; otherwise no refunds but access continues.</li>
                <li className="mt-2"><strong>Special Launch Offer (till 31st Oct 2025):</strong> Cancel before delivery → lose FREE Social Media Starter Pack. 5% discount is non-refundable.</li>
                <li className="mt-2">Domains & third-party add-ons are non-refundable. Refunds only in case of service failure (case-by-case).</li>
                <li className="mt-2">Cancel via email: <a href="mailto:info@shivkaradigital.com" className="text-blue-600 underline">info@shivkaradigital.com</a> or via client dashboard.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </footer>
  );
}
