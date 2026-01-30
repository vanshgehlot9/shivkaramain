"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Users, Trophy } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function BootcampsHighlight() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    }

    return (
        <section className="relative py-24 bg-black overflow-hidden transform-gpu" onMouseMove={handleMouseMove}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
            <motion.div
                className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-shivkara-orange/5 to-transparent pointer-events-none"
                animate={{
                    x: [0, 50, 0],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Text Content */}
                    <div className="flex-1 space-y-6">
                        <MagneticBadge>
                            <Trophy className="w-4 h-4" />
                            <span>Training Initiatives</span>
                        </MagneticBadge>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                        >
                            Building Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-yellow-500">Design Leaders</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-400 max-w-xl"
                        >
                            Shivkara Digital & Tech Lab regularly organizes specialized bootcamps and training programs to bridge the gap between academic learning and industry demands.
                        </motion.p>
                    </div>

                    {/* Card */}
                    <TiltCard />
                </div>
            </div>
        </section>
    );
}

function MagneticBadge({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x: x * 0.1, y: y * 0.1 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-full border border-shivkara-orange/30 bg-shivkara-orange/10 text-shivkara-orange text-sm font-medium hover:bg-shivkara-orange/20 transition-colors"
        >
            {children}
        </motion.div>
    );
}

function TiltCard() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200); // reduced sensitivity
        y.set(yPct * 200);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ perspective: 1000 }}
            className="flex-shrink-0 w-full md:w-auto"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouse}
                onMouseLeave={handleMouseLeave}
                className="relative group block w-full md:w-[450px]"
            >
                <Link href="/bootcamps/spunk-2025" className="block h-full">
                    <div
                        style={{ transform: "translateZ(0px)" }}
                        className="absolute -inset-0.5 bg-gradient-to-r from-shivkara-orange to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"
                    />
                    <div
                        style={{ transform: "translateZ(20px)" }}
                        className="relative bg-zinc-900 border border-white/10 rounded-2xl h-full bg-opacity-90 backdrop-blur-sm overflow-hidden flex flex-col"
                    >
                        {/* Image Header */}
                        <div className="relative h-48 w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/bootcamp/bootcampheader.jpeg"
                                alt="Bootcamp Header"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                        </div>

                        <div className="p-8 pt-4 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Completed Event</span>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-shivkara-orange transition-colors">SPUNK 2025</h3>
                                </div>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-white flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    2025
                                </span>
                            </div>

                            <p className="text-zinc-400 mb-6 line-clamp-2">
                                A focused product design bootcamp emphasizing modern design thinking, UI/UX workflows, and practical problem solving.
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Product Design</span>
                                </div>
                                <span className="flex items-center gap-2 text-sm font-medium text-white group-hover:text-shivkara-orange transition-colors group-hover:translate-x-1 duration-200">
                                    View Details <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}
