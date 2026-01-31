"use client";

import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
    { label: "Projects Delivered", value: 50, suffix: "+" },
    { label: "Happy Clients", value: 30, suffix: "+" },
    { label: "Years Experience", value: 5, suffix: "+" },
    { label: "Team Members", value: 40, suffix: "+" }
];

function Counter({ value, suffix }: { value: number, suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
    const isInView = useInView(ref, { once: true, margin: "-10px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toString();
            }
        });
        return () => unsubscribe();
    }, [springValue]);

    return (
        <div className="flex items-baseline justify-center">
            <span ref={ref} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter tabular-nums drop-shadow-2xl">0</span>
            <span className="text-3xl md:text-4xl lg:text-5xl font-light text-shivkara-orange ml-1 mb-1">{suffix}</span>
        </div>
    );
}

export default function Stats() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-shivkara-orange/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            {/* Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Desktop View (Grid) */}
                <div className="hidden md:grid md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative"
                        >
                            {/* Card Content */}
                            <div className="glass-card-premium rounded-2xl p-10 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.15]">

                                {/* Holographic Top Border Highlight */}
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Status Indicator */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-shivkara-orange shadow-[0_0_8px_rgba(255,77,0,0.8)] animate-pulse" />
                                </div>

                                <Counter value={stat.value} suffix={stat.suffix} />

                                <div className="mt-6 h-px w-12 bg-white/10 group-hover:w-full group-hover:bg-shivkara-orange/30 transition-all duration-500" />

                                <p className="mt-4 text-gray-400 font-medium text-base tracking-wide group-hover:text-white transition-colors duration-300">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View (Infinite Slider) */}
                <div className="md:hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    >
                        {[...stats, ...stats].map((stat, index) => (
                            <div
                                key={`mobile-stat-${index}`}
                                className="w-[280px] glass-card-premium rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-white/10 bg-white/5"
                            >
                                <Counter value={stat.value} suffix={stat.suffix} />
                                <div className="mt-4 h-px w-12 bg-white/10" />
                                <p className="mt-3 text-gray-400 font-medium text-sm tracking-wide">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
