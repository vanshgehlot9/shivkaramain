"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * A component that forces immediate display of its children without scroll reveal
 * Used as a replacement for ScrollRevealSection to show content immediately without scroll
 */
export function ImmediateDisplay({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
