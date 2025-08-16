import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  threshold?: number; // 0 to 1, when to start animation
  distance?: number; // px to move from
  staggerChildren?: boolean;
  staggerDelay?: number;
  once?: boolean;
}

export function ScrollRevealSection({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  distance = 50,
  staggerChildren = false,
  staggerDelay = 0.1,
  once = true,
}: ScrollRevealProps) {
  // Set initial and animate values based on direction
  const getInitialValues = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'none':
        return { opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  // Container variant for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // Individual item variants for staggering
  const itemVariants = {
    hidden: getInitialValues(),
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: duration,
        ease: "easeOut",
      },
    },
  };

  if (staggerChildren) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: threshold }}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={getInitialValues()}
      whileInView={{ y: 0, x: 0, opacity: 1 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Use this component as a child of ScrollRevealSection when staggerChildren is true
export function ScrollRevealItem({ 
  children, 
  className = '',
  customVariants = null
}: { 
  children: ReactNode; 
  className?: string;
  customVariants?: any;
}) {
  return (
    <motion.div 
      className={className}
      variants={customVariants || {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
      }}
    >
      {children}
    </motion.div>
  );
}
