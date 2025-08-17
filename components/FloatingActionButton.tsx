"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (typeof window !== 'undefined' && window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
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
