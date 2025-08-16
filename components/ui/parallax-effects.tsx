import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // 0 is static, negative values move opposite to scroll
  offset?: number[]; // start and end offset values [start, end]
  baseVelocity?: number;
}

export function ParallaxSection({ 
  children, 
  className = '',
  speed = 0.5 // Default speed
}: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, speed * 100] // Translates based on speed
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative">
        {children}
      </motion.div>
    </div>
  );
}

export function ParallaxBackgroundLayers({ className = '' }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  
  // Transform values for different layers
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity1 = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Furthest back layer - slow movement */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: y1, opacity: opacity1, scale: scale1 }}
      >
        <div className="absolute top-20 left-[10%] w-[600px] h-[600px] bg-blue-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[15%] w-[500px] h-[500px] bg-indigo-700/5 rounded-full blur-3xl" />
      </motion.div>
      
      {/* Middle layer - medium movement */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: y2, opacity: opacity2, scale: scale2 }}
      >
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-2xl" />
        <div className="absolute bottom-[20%] left-[30%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-2xl" />
      </motion.div>
      
      {/* Front layer - faster movement */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: y3 }}
      >
        <div className="absolute top-[50%] left-[50%] w-[200px] h-[200px] bg-blue-700/5 rounded-full blur-xl" />
        <div className="absolute bottom-[40%] right-[40%] w-[150px] h-[150px] bg-emerald-600/5 rounded-full blur-xl" />
      </motion.div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] z-[-1]" />
    </div>
  );
}

// Animated Background section with overlaid content
export function AnimatedBackgroundSection({ 
  children,
  className = '',
  bgClassName = ''
}: { 
  children: ReactNode;
  className?: string;
  bgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated background */}
      <div className={`absolute inset-0 -z-10 ${bgClassName}`}>
        <motion.div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-700/10 to-indigo-700/10 opacity-50 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-emerald-700/10 to-blue-700/10 opacity-50 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
