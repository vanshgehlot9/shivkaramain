"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onGetStarted?: () => void;
  currentPage?: string;
}

export default function Header({ onGetStarted, currentPage = "home" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(currentPage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      setIsScrolled(window.scrollY > 50);
      
      // Only update active section for home page
      if (currentPage === "home") {
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
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage]);

  const navigationItems = [
    { name: 'Home', href: '/', isSection: true },
    { 
      name: 'Services', 
      href: '/#services', 
      isSection: true,
      dropdown: [
        { name: 'Custom Software Development', href: '/services/custom-software-development' },
        { name: 'Mobile App Development', href: '/services/mobile-app-development' },
        { name: 'Web Development', href: '/services/web-development' },
        { name: 'E-commerce Development', href: '/services/ecommerce-development' },
      ]
    },
    { name: 'Projects', href: '/#projects', isSection: true },
    { name: 'About', href: '/#about', isSection: true },
    { name: 'Articles', href: '/articles', isSection: false },
    { name: 'Location', href: '/#location', isSection: true },
    { name: 'Contact', href: '/#contact', isSection: true },
  ];

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
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image 
                  src="/logo.jpeg" 
                  alt="Shivkara Digitals Logo" 
                  width={32}
                  height={32}
                  className="w-7 h-7 md:w-8 md:h-8" 
                />
              </div>
              <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Shivkara Digital
              </span>
            </Link>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item, idx) => (
              <motion.div 
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setDropdownOpen(item.name)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                {item.isSection ? (
                  <motion.a
                    href={item.href}
                    className={`relative text-sm font-medium tracking-wide transition-all duration-300 px-4 py-2 rounded-full ${
                      activeSection === item.name.toLowerCase()
                        ? 'text-white bg-gradient-to-r from-blue-700 to-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'text-gray-700 hover:text-indigo-700'
                    }`}
                    whileHover={activeSection !== item.name.toLowerCase() ? { 
                      scale: 1.05,
                      backgroundColor: "rgba(243, 244, 246, 1)"
                    } : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  >
                    {item.name}
                    {activeSection !== item.name.toLowerCase() && (
                      <motion.span 
                        className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transform -translate-x-1/2"
                        initial={{ width: 0 }}
                        whileHover={{ width: "60%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.a>
                ) : (
                  <Link href={item.href}>
                    <motion.span
                      className={`relative text-sm font-medium tracking-wide transition-all duration-300 px-4 py-2 rounded-full block ${
                        currentPage === 'articles' && item.name === 'Articles'
                          ? 'text-white bg-gradient-to-r from-blue-700 to-indigo-600 shadow-md shadow-indigo-500/20'
                          : 'text-gray-700 hover:text-indigo-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    >
                      {item.name}
                      {!(currentPage === 'articles' && item.name === 'Articles') && (
                        <motion.span 
                          className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transform -translate-x-1/2"
                          initial={{ width: 0 }}
                          whileHover={{ width: "60%" }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.span>
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && dropdownOpen === item.name && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.dropdown.map((dropdownItem, dropdownIdx) => (
                      <Link key={dropdownItem.name} href={dropdownItem.href}>
                        <motion.div
                          className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          {dropdownItem.name}
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {onGetStarted && (
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
            )}
            
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
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.isSection ? (
                    <a
                      href={item.href}
                      className={`text-gray-700 font-medium transition-colors px-2 py-1 rounded-lg block ${
                        activeSection === item.name.toLowerCase()
                          ? 'bg-gradient-to-r from-lavender to-pink text-white'
                          : 'hover:text-lavender'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-gray-700 font-medium transition-colors px-2 py-1 rounded-lg block ${
                        currentPage === 'articles' && item.name === 'Articles'
                          ? 'bg-gradient-to-r from-lavender to-pink text-white'
                          : 'hover:text-lavender'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
