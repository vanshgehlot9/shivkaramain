"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projects = [
    {
        id: "01",
        title: "Tree Nuts",
        category: "E-Commerce",
        description: "A premium e-commerce platform designed for high-volume sales. Features real-time inventory tracking and a seamless checkout experience.",
        tags: ["React", "Node.js", "Stripe"],
        src: "/project/treenut.png",
        link: "https://www.treenuts.shop/"
    },
    {
        id: "02",
        title: "Jeeri Haveli",
        category: "Hospitality",
        description: "Complete hotel management system including booking engine, room inventory, and admin dashboard for a luxury heritage hotel.",
        tags: ["Next.js", "PostgreSQL", "Cloud"],
        src: "/project/jeerihaveli.png",
        link: "https://jeerihaveli.com/"
    },
    {
        id: "03",
        title: "Jodhpur Bombay",
        category: "Logistics",
        description: "Comprehensive logistics management system with route optimization, real-time tracking, and fleet management.",
        tags: ["Vue.js", "Python", "PostgreSQL"],
        src: "/project/jodhpur.png",
        link: "https://jodhpurbombay.vercel.app/auth/login"
    },
    {
        id: "04",
        title: "Nikki Fashion",
        category: "Fashion",
        description: "Complete fashion e-commerce platform with advanced product catalog, size management, payment processing, and inventory tracking.",
        tags: ["Next.js", "React", "Stripe"],
        src: "/project/nikkifashion.png",
        link: "https://nikkifashion.com"
    }
];

function Card({ project, index, range, targetScale }: { project: any, index: number, range: any, targetScale: number }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
    const scale = useTransform(scrollYProgress, range, [1, targetScale]);

    return (
        <div ref={container} className="min-h-screen flex items-center justify-center sticky top-0 px-4 md:px-0 pb-16 md:pb-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${index * 25}px)` }}
                className="relative flex flex-col md:flex-row w-full max-w-[1200px] h-auto md:h-[650px] rounded-[24px] md:rounded-[32px] p-6 md:p-12 origin-top bg-[#080808] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm"
            >
                {/* Subtle Grain Texture */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

                {/* Background Glow */}
                <div className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] bg-shivkara-orange/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row h-full gap-6 md:gap-16 w-full relative z-10">
                    <div className="w-full md:w-[45%] flex flex-col justify-between order-2 md:order-1">
                        <div>
                            {/* Project Header */}
                            <div className="flex items-center gap-4 mb-4 md:mb-8">
                                <span className="text-4xl md:text-6xl font-black text-white/5 font-mono">0{index + 1}</span>
                                <div className="px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-mono uppercase tracking-widest text-shivkara-orange/80">
                                    {project.category}
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[0.9] mb-4 md:mb-8 text-white">
                                {project.title}
                            </h2>

                            <p className="text-sm md:text-lg leading-relaxed text-gray-400 mb-6 md:mb-8 font-light border-l-2 border-white/10 pl-4 md:pl-6">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-2 py-1 md:px-3 rounded text-xs md:text-sm bg-white/[0.02] border border-white/[0.08] text-gray-400 font-mono">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link
                            href={project.link}
                            target="_blank"
                            className="group flex items-center gap-4 mt-8 w-fit"
                        >
                            <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-shivkara-orange group-hover:border-shivkara-orange group-hover:text-black transition-all duration-300">
                                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-45" />
                            </span>
                            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white group-hover:text-shivkara-orange transition-colors">
                                View Case Study
                            </span>
                        </Link>
                    </div>

                    <div className="relative w-full md:w-[55%] h-[250px] md:h-full rounded-xl md:rounded-2xl overflow-hidden bg-[#111] border border-white/5 order-1 md:order-2 group cursor-pointer">
                        <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
                            <Image
                                fill
                                src={project.src}
                                alt={project.title}
                                className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function Work() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <section ref={container} id="work" className="bg-black relative z-10">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-shivkara-orange/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="pt-32 pb-20 px-6 md:px-20 text-center relative z-10">
                <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Portfolio</span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-8xl font-black uppercase mb-6 text-white tracking-tighter"
                >
                    Selected <span className="text-stroke-1 text-transparent">Works</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-light"
                >
                    Digital products that define industries and drive growth. We build for impact.
                </motion.p>
            </div>

            <div className="mt-10 mb-20">
                {projects.map((project, index) => {
                    const targetScale = 1 - ((projects.length - index) * 0.05);
                    return <Card key={index} index={index} project={project} range={[index * (1 / projects.length), 1]} targetScale={targetScale} />;
                })}
            </div>

            {/* View More Work PDF Button */}
            <div className="pb-32 flex justify-center relative z-10">
                <Link
                    href="https://drive.google.com/file/d/1UpKAJXCFWR1rzPYcIcZ3Wb1PYog4pEkY/view?usp=sharing"
                    target="_blank"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/[0.05] border border-white/10 rounded-full hover:bg-white/[0.1] hover:border-shivkara-orange/50 transition-all duration-300"
                >
                    <span className="text-white font-bold uppercase tracking-widest text-sm">View Full Portfolio PDF</span>
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-shivkara-orange transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
