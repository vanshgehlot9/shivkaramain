import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Type animation component
export function TypedTextAnimation({
  text,
  className = '',
  typingSpeed = 0.05,
  cursorColor = '#3b82f6',
  startDelay = 0
}: {
  text: string;
  className?: string;
  typingSpeed?: number;
  cursorColor?: string;
  startDelay?: number;
}) {
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: startDelay,
        staggerChildren: typingSpeed
      }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.div
      className={`inline-block relative ${className}`}
      variants={sentence}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={letter}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      <motion.span
        className="absolute right-[-8px] bottom-0 w-[2px] h-[1em]"
        style={{ backgroundColor: cursorColor }}
        animate={{
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: startDelay + (text.length * typingSpeed) + 0.5
        }}
      />
    </motion.div>
  );
}

// Word-by-word reveal animation
export function WordFadeIn({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  staggerDelay = 0.1
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}) {
  const words = text.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: staggerDelay, 
        delayChildren: delay || 0 
      }
    })
  };
  
  const child = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { duration }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration }
    }
  };
  
  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          variants={child}
          key={i}
          className="inline-block"
        >
          {word}{' '}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Gradient text with animation
export function AnimatedGradientText({
  text,
  className = '',
  gradientFrom = 'from-blue-700',
  gradientVia = 'via-indigo-600',
  gradientTo = 'to-blue-800',
  duration = 8
}: {
  text: string | ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  duration?: number;
}) {
  return (
    <span
      className={`inline bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} animate-gradient-flow ${className}`}
      style={{
        backgroundSize: '200% 200%',
        animationDuration: `${duration}s`
      }}
    >
      {text}
    </span>
  );
}

// Highlight text with animation
export function HighlightText({
  text,
  highlightWords = [],
  highlightColor = 'bg-indigo-100',
  highlightTextColor = 'text-indigo-800',
  className = ''
}: {
  text: string;
  highlightWords: string[];
  highlightColor?: string;
  highlightTextColor?: string;
  className?: string;
}) {
  // Split text into words and apply highlights
  const words = text.split(' ');
  
  return (
    <span className={className}>
      {words.map((word, i) => {
        const shouldHighlight = highlightWords.some(hw => 
          word.toLowerCase().includes(hw.toLowerCase())
        );
        
        return (
          <motion.span
            key={i}
            className={`inline-block ${shouldHighlight ? `${highlightColor} ${highlightTextColor} px-1 rounded` : ''}`}
            initial={shouldHighlight ? { scale: 0.9 } : {}}
            animate={shouldHighlight ? { scale: 1 } : {}}
            whileHover={shouldHighlight ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {word}{' '}
          </motion.span>
        );
      })}
    </span>
  );
}
