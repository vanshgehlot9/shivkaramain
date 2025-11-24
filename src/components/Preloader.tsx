"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000; // 2 seconds
        const interval = 20;
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setCount((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
                >
                    <div className="relative w-full max-w-md px-6">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-white font-mono text-sm uppercase tracking-widest">Loading Experience</span>
                            <span className="text-6xl md:text-8xl font-black text-white font-mono">
                                {Math.round(count)}%
                            </span>
                        </div>
                        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-shivkara-orange"
                                style={{ width: `${count}%` }}
                            />
                        </div>
                    </div>

                    {/* Background Noise */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
