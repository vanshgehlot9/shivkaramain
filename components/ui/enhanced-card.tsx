"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: "lift" | "glow" | "scale" | "tilt";
  delay?: number;
  onClick?: () => void;
}

export function EnhancedCard({ 
  children, 
  className = "", 
  hoverEffect = "lift",
  delay = 0,
  onClick 
}: EnhancedCardProps) {
  const hoverVariants = {
    lift: {
      hover: { 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(156, 137, 184, 0.3)"
      }
    },
    glow: {
      hover: { 
        scale: 1.05,
        boxShadow: "0 0 30px rgba(240, 166, 202, 0.5)"
      }
    },
    scale: {
      hover: { 
        scale: 1.1,
        rotateY: 5
      }
    },
    tilt: {
      hover: { 
        rotateX: 5,
        rotateY: 5,
        scale: 1.05
      }
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-100/50 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={hoverVariants[hoverEffect].hover}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-lavender/5 to-pink/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}

export function GradientCard({ 
  children, 
  className = "",
  gradient = "from-lavender to-pink",
  delay = 0,
  onClick 
}: {
  children: ReactNode;
  className?: string;
  gradient?: string;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-1 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(156, 137, 184, 0.4)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 h-full">
        {children}
      </div>
    </motion.div>
  );
}

export function GlassCard({ 
  children, 
  className = "",
  delay = 0,
  onClick 
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        boxShadow: "0 15px 35px rgba(255, 255, 255, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
} 