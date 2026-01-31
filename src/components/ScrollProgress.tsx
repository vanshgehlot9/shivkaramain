"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none">
            {/* Glow Layer */}
            <motion.div
                className="absolute inset-0 bg-shivkara-orange blur-[4px] opacity-70 origin-left"
                style={{ scaleX }}
            />
            {/* Main Bar */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-shivkara-orange to-red-500 origin-left"
                style={{ scaleX }}
            />
        </div>
    );
}
