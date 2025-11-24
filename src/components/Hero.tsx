"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "./MagneticButton";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

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

        // Star properties
        const stars: { x: number; y: number; z: number; size: number }[] = [];
        const numStars = 1500;
        const speed = 2; // Speed of movement towards viewer

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * canvas.width * 2,
                y: (Math.random() - 0.5) * canvas.height * 2,
                z: Math.random() * canvas.width,
                size: Math.random() * 2
            });
        }

        const draw = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Mouse interaction
            const mx = mouseX.get() * 100;
            const my = mouseY.get() * 100;

            stars.forEach((star) => {
                // Move star towards viewer
                star.z -= speed;

                // Reset star if it passes the viewer
                if (star.z <= 0) {
                    star.z = canvas.width;
                    star.x = (Math.random() - 0.5) * canvas.width * 2;
                    star.y = (Math.random() - 0.5) * canvas.height * 2;
                }

                // Project 3D coordinates to 2D
                const k = 128.0 / star.z;
                const px = (star.x + mx) * k + cx;
                const py = (star.y + my) * k + cy;

                if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                    const size = (1 - star.z / canvas.width) * 3;
                    const shade = Math.floor((1 - star.z / canvas.width) * 255);

                    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Draw connecting lines for nearby stars (constellation effect)
            ctx.strokeStyle = "rgba(255, 107, 0, 0.15)"; // Shivkara Orange
            ctx.lineWidth = 0.5;

            // Only connect a subset to save performance
            for (let i = 0; i < 100; i++) {
                const star1 = stars[i];
                const k1 = 128.0 / star1.z;
                const x1 = (star1.x + mx) * k1 + cx;
                const y1 = (star1.y + my) * k1 + cy;

                if (star1.z > 100 && x1 > 0 && x1 < canvas.width && y1 > 0 && y1 < canvas.height) {
                    for (let j = i + 1; j < 100; j++) {
                        const star2 = stars[j];
                        const k2 = 128.0 / star2.z;
                        const x2 = (star2.x + mx) * k2 + cx;
                        const y2 = (star2.y + my) * k2 + cy;

                        const dist = Math.hypot(x1 - x2, y1 - y2);

                        if (dist < 100) {
                            ctx.beginPath();
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2, y2);
                            ctx.stroke();
                        }
                    }
                }
            }

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
        mouseX.set((clientX / innerWidth - 0.5) * 2); // -1 to 1
        mouseY.set((clientY / innerHeight - 0.5) * 2); // -1 to 1
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center"
        >
            {/* Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-10 pointer-events-none" />

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-20 text-center px-6 flex flex-col items-center"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    <div className="absolute -inset-10 bg-shivkara-orange/20 blur-[100px] rounded-full animate-pulse-glow" />
                    <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-white mix-blend-difference select-none">
                        SHIVKARA
                    </h1>
                    <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 select-none mt-[-0.2em]">
                        DIGITAL
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-gray-400 text-lg md:text-2xl max-w-2xl mb-12 font-light tracking-wide"
                >
                    Architecting the <span className="text-white font-medium">digital universe</span> for visionary brands.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-wrap justify-center gap-6"
                >
                    <MagneticButton
                        onClick={() => router.push('/lets-talk')}
                        className="group relative flex items-center justify-center gap-3 bg-white text-black px-12 py-5 rounded-full font-bold text-sm uppercase tracking-wider overflow-hidden transition-all hover:scale-105"
                    >
                        <span className="relative z-10">Start Project</span>
                        <ArrowUpRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-shivkara-orange translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </MagneticButton>
                </motion.div>
            </motion.div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </section>
    );
}
