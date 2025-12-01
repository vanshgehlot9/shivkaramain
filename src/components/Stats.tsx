"use client";

import { motion, useInView, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
    { label: "Projects Delivered", value: 50, suffix: "+" },
    { label: "Happy Clients", value: 30, suffix: "+" },
    { label: "Years Experience", value: 5, suffix: "+" },
    { label: "Team Members", value: 12, suffix: "" }
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
            <span ref={ref} className="text-4xl sm:text-5xl md:text-8xl font-black text-white font-mono tracking-tighter">0</span>
            <span className="text-2xl sm:text-3xl md:text-6xl font-bold text-shivkara-orange ml-1">{suffix}</span>
        </div>
    );
}

export default function Stats() {
    return (
        <section className="py-24 bg-black relative border-y border-white/10">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="flex items-center justify-center gap-2 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-mono text-green-500 uppercase tracking-widest">System Active</span>
                            </div>

                            <Counter value={stat.value} suffix={stat.suffix} />

                            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-shivkara-orange/50 transition-colors duration-500" />

                            <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
