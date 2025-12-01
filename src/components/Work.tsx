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
        color: "bg-[#111]",
        textColor: "text-white",
        src: "/project/treenut.png",
        link: "https://www.treenuts.shop/"
    },
    {
        id: "02",
        title: "Jeeri Haveli",
        category: "Hospitality",
        description: "Complete hotel management system including booking engine, room inventory, and admin dashboard for a luxury heritage hotel.",
        tags: ["Next.js", "PostgreSQL", "Cloud"],
        color: "bg-[#111]",
        textColor: "text-white",
        src: "/project/jeerihaveli.png",
        link: "https://jeerihaveli.com/"
    },

    {
        id: "04",
        title: "Jodhpur Bombay Roadway",
        category: "Logistics",
        description: "Comprehensive logistics management system with route optimization, real-time tracking, and fleet management.",
        tags: ["Vue.js", "Python", "PostgreSQL"],
        color: "bg-[#111]",
        textColor: "text-white",
        src: "/project/jodhpur.png",
        link: "https://jodhpurbombay.vercel.app/auth/login"
    },

    {
        id: "06",
        title: "Nikki Fashion",
        category: "Fashion",
        description: "Complete fashion e-commerce platform with advanced product catalog, size management, payment processing, and inventory tracking.",
        tags: ["Next.js", "React", "Stripe"],
        color: "bg-[#111]",
        textColor: "text-white",
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
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${index * 25}px)` }}
                className={`relative flex flex-col md:flex-row w-full max-w-[1100px] h-auto md:h-[600px] rounded-[30px] p-8 md:p-14 origin-top ${project.color} border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden`}
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-shivkara-orange/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Mobile Title */}
                <div className={`md:hidden flex justify-between items-center mb-6 ${project.textColor} relative z-10`}>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">{project.title}</h2>
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">
                        {project.category}
                    </div>
                </div>

                <div className={`flex flex-col md:flex-row h-full gap-8 md:gap-16 ${project.textColor} w-full relative z-10`}>
                    <div className="w-full md:w-[40%] flex flex-col justify-between order-2 md:order-1">
                        <div>
                            {/* Desktop Title */}
                            <div className="hidden md:flex justify-between items-center mb-8">
                                <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">{project.title}</h2>
                            </div>

                            <div className="hidden md:flex items-center gap-2 font-mono text-xs uppercase tracking-widest border border-white/10 bg-white/5 px-4 py-1.5 rounded-full w-fit mb-8 text-gray-400">
                                {project.category}
                            </div>

                            <p className="text-base md:text-lg leading-relaxed text-gray-400 mb-6 md:mb-0 font-light">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4 md:mt-8">
                                {project.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs md:text-sm font-medium text-gray-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link href={project.link} target="_blank" className="flex items-center gap-3 text-base md:text-lg font-bold uppercase tracking-widest group w-fit mt-8 hover:text-shivkara-orange transition-colors">
                            View Case Study
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-shivkara-orange group-hover:text-black transition-all duration-300">
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                            </div>
                        </Link>
                    </div>

                    <div className="relative w-full md:w-[60%] h-[300px] md:h-full rounded-2xl overflow-hidden bg-black/40 border border-white/5 order-1 md:order-2 group-hover:border-white/10 transition-colors">
                        <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
                            <Image
                                fill
                                src={project.src}
                                alt={project.title}
                                className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
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
        <section ref={container} id="work" className="bg-[#030303] relative">
            <div className="pt-32 pb-10 px-6 md:px-20 text-center">
                <h3 className="text-shivkara-orange font-mono text-sm tracking-widest uppercase mb-4">/// Portfolio</h3>
                <h2 className="text-5xl md:text-8xl font-black uppercase mb-4 text-white tracking-tighter">
                    Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Works</span>
                </h2>
                <p className="text-gray-500 text-xl max-w-2xl mx-auto font-light">
                    Digital products that define industries and drive growth.
                </p>
            </div>

            <div className="mt-10 mb-32">
                {projects.map((project, index) => {
                    const targetScale = 1 - ((projects.length - index) * 0.05);
                    return <Card key={index} index={index} project={project} range={[index * (1 / projects.length), 1]} targetScale={targetScale} />;
                })}
            </div>
        </section>
    );
}
