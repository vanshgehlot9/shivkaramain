"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TechyHero3DProps {
  intensity?: number;
  className?: string;
}

// Optimized 3D tech grid component for low-end devices
export function TechyHero3D({ intensity = 1, className = "" }: TechyHero3DProps) {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect low-end device
  useEffect(() => {
    const checkDevice = () => {
      const deviceMemory = (navigator as any).deviceMemory;
      const hardwareConcurrency = navigator.hardwareConcurrency;
      const connection = (navigator as any).connection;
      
      // Determine if device is low-end based on multiple factors
      const isLowEnd = 
        deviceMemory && deviceMemory <= 4 ||
        hardwareConcurrency <= 2 ||
        connection && connection.effectiveType === '2g' ||
        connection && connection.effectiveType === '3g' ||
        /Android.*Chrome\/\d+/.test(navigator.userAgent) && deviceMemory <= 4;
      
      setIsLowEndDevice(isLowEnd);
    };

    checkDevice();
  }, []);

  // Optimized animation variants based on device capability
  const animationConfig = useMemo(() => {
    if (prefersReducedMotion || isLowEndDevice) {
      return {
        duration: 8,
        ease: "linear" as const,
        repeat: Infinity,
        // Reduced complexity for low-end devices
        complexity: 0.3
      };
    }
    return {
      duration: 6,
      ease: "linear" as const, 
      repeat: Infinity,
      complexity: intensity
    };
  }, [prefersReducedMotion, isLowEndDevice, intensity]);

  // Memoized grid patterns to avoid recalculation
  const gridElements = useMemo(() => {
    const elements = [];
    const gridSize = isLowEndDevice ? 4 : 6; // Fewer elements for low-end devices
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        elements.push({
          id: `${i}-${j}`,
          x: (i / (gridSize - 1)) * 100,
          y: (j / (gridSize - 1)) * 100,
          delay: (i + j) * 0.1
        });
      }
    }
    return elements;
  }, [isLowEndDevice]);

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-100/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated tech grid background */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Dynamic grid pattern */}
        <div className="absolute inset-0">
          {gridElements.map((element) => (
            <motion.div
              key={element.id}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: animationConfig.duration,
                repeat: Infinity,
                delay: element.delay,
                ease: animationConfig.ease,
              }}
            />
          ))}
        </div>

        {/* Floating tech elements */}
        <TechFloatingElements 
          count={isLowEndDevice ? 3 : 5} 
          animationConfig={animationConfig}
        />

        {/* Circuit-like connections */}
        <CircuitConnections 
          complexity={animationConfig.complexity}
          isLowEnd={isLowEndDevice}
        />

        {/* Holographic overlay */}
        <HolographicOverlay intensity={animationConfig.complexity} />
      </motion.div>
    </div>
  );
}

// Optimized floating tech elements
function TechFloatingElements({ count, animationConfig }: { count: number; animationConfig: any }) {
  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 20,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotationSpeed: Math.random() * 2 + 1,
      floatDistance: Math.random() * 20 + 10,
    }));
  }, [count]);

  return (
    <>
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute pointer-events-none"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
          }}
          animate={{
            y: [-element.floatDistance, element.floatDistance, -element.floatDistance],
            rotate: [0, 360],
          }}
          transition={{
            y: {
              duration: animationConfig.duration * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: animationConfig.duration * element.rotationSpeed,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {/* Tech cube with CSS 3D transforms */}
          <div className="relative w-full h-full preserve-3d">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border border-blue-300/30 rounded-lg"
              style={{ transform: 'translateZ(0)' }}
            />
            <div 
              className="absolute inset-1 bg-gradient-to-tr from-cyan-400/10 to-blue-500/10 rounded border border-cyan-300/20"
              style={{ transform: 'translateZ(2px)' }}
            />
          </div>
        </motion.div>
      ))}
    </>
  );
}

// Optimized circuit connections
function CircuitConnections({ complexity, isLowEnd }: { complexity: number; isLowEnd: boolean }) {
  const connections = useMemo(() => {
    const count = isLowEnd ? 3 : Math.floor(5 * complexity);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      path: `M${Math.random() * 100},${Math.random() * 100} Q${Math.random() * 100},${Math.random() * 100} ${Math.random() * 100},${Math.random() * 100}`,
      delay: i * 0.5,
    }));
  }, [complexity, isLowEnd]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
      {connections.map((connection) => (
        <motion.path
          key={connection.id}
          d={connection.path}
          stroke="url(#techGradient)"
          strokeWidth="0.2"
          fill="none"
          strokeDasharray="2 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0], 
            opacity: [0, 0.6, 0] 
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: connection.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Holographic overlay effect
function HolographicOverlay({ intensity }: { intensity: number }) {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      animate={{
        background: [
          'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 80%, rgba(6,182,212,0.1) 0%, transparent 50%)',
          'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)',
        ],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ opacity: intensity }}
    />
  );
}

// Performance-optimized 3D matrix rain effect
export function MatrixRain({ density = 0.3, className = "" }: { density?: number; className?: string }) {
  const [drops, setDrops] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const dropCount = Math.floor(20 * density); // Limit drops for performance
    const newDrops = Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      x: (i / dropCount) * 100,
      delay: Math.random() * 2,
    }));
    setDrops(newDrops);
  }, [density]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-px bg-gradient-to-b from-green-400/60 via-green-300/40 to-transparent"
          style={{
            left: `${drop.x}%`,
            height: '100px',
            top: '-100px',
          }}
          animate={{
            y: [0, window.innerHeight + 100],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Main techy hero background component
export default function TechyHeroBackground({ className = "" }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-100/20 ${className}`} />
    );
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20" />
      
      {/* Tech 3D elements */}
      <TechyHero3D intensity={0.7} />
      
      {/* Subtle matrix effect for extra tech feel */}
      <MatrixRain density={0.2} className="opacity-20" />
      
      {/* Overlay for content readability */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
    </div>
  );
}
