"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    const text = "SHIVKARA";

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Noise & Grid */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {/* Gradient Blobs */}
                    <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-shivkara-orange/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />

                    <div className="relative z-10 overflow-hidden">
                        <div className="flex">
                            {text.split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.33, 1, 0.68, 1],
                                        delay: index * 0.1
                                    }}
                                    className="text-6xl md:text-9xl font-black text-white tracking-tighter inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Shimmer/Scan effect over text */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />
                    </div>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        className="h-[2px] bg-shivkara-orange mt-8 rounded-full shadow-[0_0_20px_rgba(255,107,0,0.6)]"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
