"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight, ChevronRight, Terminal, Cpu, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "./MagneticButton";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse position for interaction
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        // Globe properties
        const globeRadius = Math.min(canvas.width, canvas.height) * 0.35;
        const dots: { lat: number; lon: number; size: number }[] = [];
        const numDots = 800;

        // Initialize dots on sphere
        for (let i = 0; i < numDots; i++) {
            const phi = Math.acos(-1 + (2 * i) / numDots);
            const theta = Math.sqrt(numDots * Math.PI) * phi;

            dots.push({
                lat: phi,
                lon: theta,
                size: Math.random() * 1.5 + 0.5
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Rotation
            const rotationSpeed = 0.002;
            const rotationX = time * rotationSpeed;
            const rotationY = time * rotationSpeed * 0.5;

            // Mouse interaction (tilt)
            const mx = mouseX.get() * 0.5;
            const my = mouseY.get() * 0.5;

            dots.forEach(dot => {
                // Rotate
                let x = globeRadius * Math.sin(dot.lat) * Math.cos(dot.lon + rotationX);
                let y = globeRadius * Math.sin(dot.lat) * Math.sin(dot.lon + rotationX);
                let z = globeRadius * Math.cos(dot.lat);

                // Apply tilt based on mouse
                const tiltedX = x * Math.cos(mx) - z * Math.sin(mx);
                const tiltedZ = x * Math.sin(mx) + z * Math.cos(mx);
                x = tiltedX;
                z = tiltedZ;

                const tiltedY = y * Math.cos(my) - z * Math.sin(my);
                z = y * Math.sin(my) + z * Math.cos(my);
                y = tiltedY;

                // Project
                const scale = 400 / (400 - z);
                const px = cx + x * scale;
                const py = cy + y * scale;

                // Draw
                if (z < 100) { // Only draw front-ish dots
                    const alpha = (1 - z / globeRadius) * 0.8; // Fade back dots
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

                    // Highlight dots near mouse
                    // const dist = Math.hypot(px - (cx + mx * 200), py - (cy + my * 200));
                    // if (dist < 50) ctx.fillStyle = "#FF4D00";

                    ctx.beginPath();
                    ctx.arc(px, py, dot.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Draw connecting lines for a "network" feel
            // Optimization: Only connect a few random dots to avoid performance hit
            ctx.strokeStyle = "rgba(255, 77, 0, 0.1)";
            ctx.lineWidth = 0.5;

            // ... (omitted for performance, keeping it clean with just dots for now)

            time++;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mouseX, mouseY]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set((clientX / innerWidth - 0.5) * 2);
        mouseY.set((clientY / innerHeight - 0.5) * 2);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative h-screen w-full overflow-hidden bg-[#030303] flex items-center justify-center"
        >
            {/* Canvas Background (Globe) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 opacity-40"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#030303] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_120%)] z-10 pointer-events-none" />

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-20 text-center px-6 flex flex-col items-center w-full max-w-6xl mx-auto"
            >
                {/* Badge */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-gray-300 hover:border-shivkara-orange/50 transition-colors cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shivkara-orange opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-shivkara-orange"></span>
                        </span>
                        Accepting New Projects for 2025
                        <ChevronRight className="w-3 h-3 text-gray-500" />
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    {/* Glow behind text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-shivkara-orange/10 blur-[100px] rounded-full pointer-events-none" />

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.1] text-white">
                        Architecting <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            Digital Excellence
                        </span>
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed"
                >
                    We are a premium software agency specializing in <span className="text-white">AI-driven solutions</span>, <span className="text-white">scalable cloud architecture</span>, and <span className="text-white">immersive web experiences</span>.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <MagneticButton
                        onClick={() => router.push('/lets-talk')}
                        className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <span>Start Your Project</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </MagneticButton>

                    <MagneticButton
                        onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-sm transition-all hover:bg-white/10 hover:border-white/20"
                    >
                        <span>View Portfolio</span>
                    </MagneticButton>
                </motion.div>

                {/* Tech Stack / Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-20 pt-10 border-t border-white/5 w-full max-w-4xl flex flex-col items-center"
                >
                    <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-6">Powering Next-Gen Technologies</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple SVG Icons for Tech Stack */}
                        <TechIcon label="React" />
                        <TechIcon label="Next.js" />
                        <TechIcon label="Node.js" />
                        <TechIcon label="AWS" />
                        <TechIcon label="Python" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

function TechIcon({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-shivkara-orange" />
            <span className="text-sm font-bold text-gray-300">{label}</span>
        </div>
    );
}
