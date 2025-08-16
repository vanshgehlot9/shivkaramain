"use client";

import React, { ReactNode, forwardRef, HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

/**
 * MotionSection - A component that renders a motion-animated section
 * This helps fix issues with motion.section syntax errors
 */
export const MotionSection = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>((props, ref) => {
  const { children, className = '', ...restProps } = props as any;
  
  return (
    <motion.div
      ref={ref}
      className={`section ${className}`}
      {...restProps}
    >
      {children}
    </motion.div>
  );
});
