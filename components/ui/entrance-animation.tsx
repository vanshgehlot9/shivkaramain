"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EntranceAnimation() {
  // Start with animation shown by default
  const [showAnimation, setShowAnimation] = useState(true);
  
  useEffect(() => {
    // Check if this code runs in browser environment
    if (typeof window === 'undefined') return;
    
    // Force animation to show immediately on first visit
    document.body.style.overflow = 'hidden'; // Prevent scrolling during animation
    
    // Immediately check if user has seen animation before
    const hasSeenAnimation = localStorage.getItem('hasSeenEntryAnimation');
    if (hasSeenAnimation) {
      setShowAnimation(false);
      document.body.style.overflow = ''; // Re-enable scrolling
      return;
    }
    
    // Show animation and set timer to hide it after completion
    const timer = setTimeout(() => {
      setShowAnimation(false);
      localStorage.setItem('hasSeenEntryAnimation', 'true');
      document.body.style.overflow = ''; // Re-enable scrolling
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = ''; // Ensure scrolling is re-enabled if component unmounts
    };
  }, []);

  if (!showAnimation) return null;

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[9999] bg-black overflow-hidden"
          style={{ 
            pointerEvents: 'all', 
            touchAction: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Overlay backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 2.5, ease: "easeInOut" }}
          />
          
          {/* Main 3D entrance animation */}
          <div className="relative w-full h-full flex items-center justify-center perspective">
            {/* 3D Logo Animation */}
            <motion.div
              className="relative w-32 h-32 preserve-3d"
              initial={{ scale: 0.2, rotateY: 90, opacity: 0 }}
              animate={{ 
                scale: 1, 
                rotateY: 0, 
                opacity: 1,
                y: [0, -20, 0],
                z: [0, 30, 0]
              }}
              transition={{ 
                duration: 1.8,
                times: [0, 0.7, 1],
                ease: "easeOut" 
              }}
              exit={{ 
                scale: 3,
                opacity: 0,
                transition: { duration: 0.8 }
              }}
            >
              {/* Logo cube faces */}
              <div className="absolute inset-0 w-full h-full preserve-3d">
                {/* Front face - logo */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center w-full h-full bg-white rounded-xl shadow-2xl"
                  style={{ transform: 'translateZ(20px)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                    <span className="text-3xl font-extrabold text-white">S</span>
                  </div>
                </motion.div>
                
                {/* Back face */}
                <div 
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl opacity-80"
                  style={{ transform: 'rotateY(180deg) translateZ(20px)' }}
                />
                
                {/* Side faces */}
                <div 
                  className="absolute inset-0 w-full h-full bg-blue-600 opacity-90"
                  style={{ transform: 'rotateY(90deg) translateZ(20px)' }}
                />
                <div 
                  className="absolute inset-0 w-full h-full bg-indigo-600 opacity-90"
                  style={{ transform: 'rotateY(-90deg) translateZ(20px)' }}
                />
                <div 
                  className="absolute inset-0 w-full h-full bg-blue-700 opacity-90"
                  style={{ transform: 'rotateX(90deg) translateZ(20px)' }}
                />
                <div 
                  className="absolute inset-0 w-full h-full bg-indigo-800 opacity-90"
                  style={{ transform: 'rotateX(-90deg) translateZ(20px)' }}
                />
              </div>
              
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-xl opacity-70 blur-xl bg-blue-500"
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Particles effect */}
              <div className="absolute -inset-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50],
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 1 + 1,
                      delay: Math.random() * 0.5,
                      repeat: 1,
                      repeatType: "reverse"
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Company name appear after logo */}
            <motion.div
              className="absolute mt-40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            >
              <motion.h1 
                className="text-2xl md:text-3xl font-bold tracking-tight text-white"
                animate={{ letterSpacing: [".25em", ".05em"] }}
                transition={{ duration: 1.2, delay: 1.2 }}
              >
                SHIVKARA DIGITAL
              </motion.h1>
            </motion.div>
            
            {/* Radial lines emanating from center */}
            <div className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0 bg-blue-400 opacity-60 origin-bottom"
                  style={{ 
                    rotate: `${i * 30}deg`,
                  }}
                  animate={{
                    height: ["0%", "150%", "0%"],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: 1 + (i * 0.05),
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
