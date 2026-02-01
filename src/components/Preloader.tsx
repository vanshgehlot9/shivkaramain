"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const text = "SHIVKARA";

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:50px_50px]" />
                        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-shivkara-orange/10 rounded-full blur-[180px] animate-pulse" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
                    </div>

                    {/* Logo Text */}
                    <div className="relative z-10 overflow-hidden">
                        <div className="flex">
                            {text.split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ y: 100, opacity: 0, rotateX: -90 }}
                                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                    transition={{
                                        duration: 0.7,
                                        ease: [0.33, 1, 0.68, 1],
                                        delay: index * 0.08
                                    }}
                                    className="text-6xl md:text-9xl font-black text-white tracking-tighter inline-block"
                                    style={{ textShadow: '0 0 60px rgba(255, 122, 0, 0.3)' }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Shimmer effect */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-xs text-gray-500 uppercase tracking-[0.5em] mt-6 font-mono"
                    >
                        Digital Engineering
                    </motion.p>

                    {/* Progress Bar */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "180px", opacity: 1 }}
                        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
                        className="h-[3px] bg-gradient-to-r from-shivkara-orange to-red-500 mt-8 rounded-full shadow-[0_0_30px_rgba(255,107,0,0.5)]"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
