"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Link from "next/link";
import { useRef } from "react";

export default function CallToAction() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

    return (
        <section ref={containerRef} className="py-32 md:py-48 bg-black relative overflow-hidden flex items-center justify-center">
            {/* Warp Speed Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-50" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20" />

            {/* Animated Glow Orbs */}
            <motion.div
                style={{ y }}
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-shivkara-orange/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"
            />
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
                className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"
            />


            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                >
                    <Sparkles className="w-4 h-4 text-shivkara-orange" />
                    <span className="text-gray-300 text-xs font-mono tracking-widest uppercase">Start Your Transformation</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase mb-8 leading-[0.85]"
                >
                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Ready to</span>
                    <span className="block text-transparent stroke-text-white opacity-90 transition-opacity hover:opacity-100 duration-500">
                        Disrupt?
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto mb-16 leading-relaxed"
                >
                    We build digital experiences that define categories. <br className="hidden md:block" />
                    Don't just compete. <span className="text-white font-medium">Dominate.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative group inline-block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-shivkara-orange to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <MagneticButton
                            className="relative flex items-center justify-center gap-3 bg-white text-black px-12 py-6 rounded-full font-black text-xl tracking-tight uppercase hover:scale-105 transition-transform duration-300 overflow-hidden"
                        >
                            <Link href="/contact" className="relative z-10 flex items-center gap-2">
                                Start Project <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="absolute inset-0 bg-shivkara-orange translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </MagneticButton>
                    </div>

                </motion.div>

                <style jsx global>{`
                    .stroke-text-white {
                        -webkit-text-stroke: 1px rgba(255,255,255,0.3);
                        color: transparent;
                    }
                    .stroke-text-white:hover {
                         -webkit-text-stroke: 1px rgba(255,107,0,0.8);
                         color: rgba(255,107,0,0.1);
                    }
                `}</style>
            </div>
        </section>
    );
}
