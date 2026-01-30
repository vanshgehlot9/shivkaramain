"use client";

import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import TextReveal from "./ui/TextReveal";
import { useEffect, useRef } from "react";
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

        const globeRadius = Math.min(canvas.width, canvas.height) * 0.4;
        const dots: { lat: number; lon: number; size: number }[] = [];
        const numDots = 1000;

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

            const rotationSpeed = 0.001;
            const rotationX = time * rotationSpeed;

            // Subtle mouse influence
            const mx = mouseX.get() * 0.2;
            const my = mouseY.get() * 0.2;

            dots.forEach(dot => {
                let x = globeRadius * Math.sin(dot.lat) * Math.cos(dot.lon + rotationX);
                let y = globeRadius * Math.sin(dot.lat) * Math.sin(dot.lon + rotationX);
                let z = globeRadius * Math.cos(dot.lat);

                // Apply tilt
                const tiltedX = x * Math.cos(mx) - z * Math.sin(mx);
                const tiltedZ = x * Math.sin(mx) + z * Math.cos(mx);
                x = tiltedX;
                z = tiltedZ;

                const tiltedY = y * Math.cos(my) - z * Math.sin(my);
                z = y * Math.sin(my) + z * Math.cos(my);
                y = tiltedY;

                const scale = 500 / (500 - z);
                const px = cx + x * scale;
                const py = cy + y * scale;

                if (z < 200) {
                    const alpha = (1 - z / globeRadius) * 0.6;

                    // Orange accent dots
                    if (Math.random() > 0.98) {
                        ctx.fillStyle = `rgba(255, 77, 0, ${alpha * 1.5})`;
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = "#FF4D00";
                    } else {
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.shadowBlur = 0;
                    }

                    ctx.beginPath();
                    ctx.arc(px, py, dot.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

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
            {/* Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 opacity-30"
            />

            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#030303] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] z-10 pointer-events-none" />

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-20 text-center px-4 flex flex-col items-center w-full max-w-7xl mx-auto"
            >
                {/* Badge */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs tracking-wider font-mono text-gray-300 hover:border-shivkara-orange/50 transition-colors cursor-default shadow-lg shadow-black/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shivkara-orange opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-shivkara-orange"></span>
                        </span>
                        <span>ACCEPTING PROJECTS FOR 2026</span>
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-shivkara-orange/20 blur-[120px] rounded-full pointer-events-none opacity-40" />

                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.95] text-white">
                        ENGINEERING
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600 relative z-10">
                            <TextReveal>EXCELLENCE</TextReveal>
                        </span>
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed px-4"
                >
                    Turning ambitious ideas into <span className="text-white font-medium">high-performance digital reality</span>. We build scalable software that redefines industries.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-6"
                >
                    <MagneticButton
                        onClick={() => router.push('/lets-talk')}
                        className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                            START PROJECT <ArrowUpRight className="w-4 h-4" />
                        </span>
                        <div className="absolute inset-0 bg-shivkara-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    </MagneticButton>

                    <MagneticButton
                        onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-md"
                    >
                        <span>VIEW WORK</span>
                    </MagneticButton>
                </motion.div>
            </motion.div>
        </section>
    );
}
