"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronRight, Globe, Code2, Sparkles, Cpu } from "lucide-react";
import TextReveal from "./ui/TextReveal";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "./MagneticButton";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Parallax effect for interacting with liquid elements
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20; // Sensitivity
        const y = (clientY / innerHeight - 0.5) * 20;
        setMousePosition({ x, y });
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center pt-32 pb-20"
        >
            {/* Background: Digital Noise & Grid */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20 pointer-events-none" />

            {/* Liquid Background Blobs - Reduced Intensity */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: mousePosition.x * -1,
                        y: mousePosition.y * -1,
                    }}
                    transition={{ type: "spring", damping: 50, stiffness: 100 }}
                    className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-purple-900/40 blur-[100px] rounded-full mix-blend-screen opacity-50"
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * 1,
                        y: mousePosition.y * 1,
                    }}
                    transition={{ type: "spring", damping: 50, stiffness: 100 }}
                    className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-shivkara-orange/30 blur-[100px] rounded-full mix-blend-screen opacity-50"
                />
            </div>

            {/* Content Container */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-20 text-center px-4 flex flex-col items-center w-full max-w-6xl mx-auto"
            >
                {/* SEO & Status Badge - Refined */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] md:text-xs tracking-widest font-mono text-gray-400 hover:border-shivkara-orange/30 transition-all duration-300 hover:bg-white/[0.05] cursor-default">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                        <span>JODHPUR'S PREMIER TECH AGENCY</span>
                        <span className="text-white/20">|</span>
                        <span className="text-shivkara-orange">HIRING INTERNS '26</span>
                    </div>
                </motion.div>

                {/* Main Heading - Better Proportions */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    {/* H1 Shadow/Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white relative z-10">
                        ARCHITECTING
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500">
                            DIGITAL EXCELLENCE
                        </span>
                    </h1>
                </motion.div>

                {/* Subheading with Keywords */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-400 text-base md:text-xl max-w-3xl mb-12 font-light leading-relaxed px-4 mx-auto"
                >
                    Turning ambitious ideas into <span className="text-white font-medium">high-performance digital reality</span>.
                    From <span className="text-white border-b border-white/20 pb-0.5">Custom Software</span> to
                    <span className="text-white border-b border-white/20 pb-0.5 ml-1">Student Training Programs</span>,
                    we build the systems that define Jodhpur's tech future.
                </motion.p>

                {/* CTA Buttons - Vertical on Mobile, Horizontal on Desktop */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
                >
                    <MagneticButton
                        onClick={() => router.push('/lets-talk')}
                        className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                            START PROJECT <ArrowUpRight className="w-4 h-4" />
                        </span>
                        <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    </MagneticButton>

                    <MagneticButton
                        onClick={() => router.push('/careers')}
                        className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all hover:bg-white/10 hover:border-shivkara-orange/50 backdrop-blur-md"
                    >
                        <span>JOIN AS INTERN</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </MagneticButton>
                </motion.div>

                {/* Tech Stack Marquee / Floating Icons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-20 flex items-center justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500"
                >
                    <Code2 className="w-8 h-8 md:w-10 md:h-10 hover:text-blue-400 transition-colors" />
                    <Cpu className="w-8 h-8 md:w-10 md:h-10 hover:text-shivkara-orange transition-colors" />
                    <Globe className="w-8 h-8 md:w-10 md:h-10 hover:text-green-400 transition-colors" />
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 hover:text-purple-400 transition-colors" />
                </motion.div>
            </motion.div>

            <style jsx global>{`
                .stroke-text-white {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
                }
                @keyframes gradient-xy {
                    0% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                    100% { background-position: 0% 0%; }
                }
                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 6s ease infinite;
                }
            `}</style>
        </section>
    );
}
