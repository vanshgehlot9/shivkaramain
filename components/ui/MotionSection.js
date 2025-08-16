"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * A simple wrapper for motion.div that can be used instead of motion.section
 * to avoid syntax errors
 */
export default function MotionSection({ children, className = "", ...props }) {
  return (
    <motion.div className={`section ${className}`} {...props}>
      {children}
    </motion.div>
  );
}
