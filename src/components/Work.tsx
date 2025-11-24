"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import Image from "next/image";

const projects = [
    {
        id: "01",
        title: "Tree Nuts",
        category: "E-Commerce",
        description: "A premium e-commerce platform designed for high-volume sales. Features real-time inventory tracking and a seamless checkout experience.",
        tags: ["React", "Node.js", "Stripe"],
        color: "from-[#FF6B00] to-[#FF9E00]", // Orange
        textColor: "text-black",
        src: "/project/treenut.png",
        link: "https://www.treenuts.shop/"
    },
    {
        id: "02",
        title: "Jeeri Haveli",
        category: "Hospitality",
        description: "Complete hotel management system including booking engine, room inventory, and admin dashboard for a luxury heritage hotel.",
        tags: ["Next.js", "PostgreSQL", "Cloud"],
        color: "from-[#1A1A1A] to-[#000000]", // Black
        textColor: "text-white",
        src: "/project/jeerihaveli.png",
        link: "https://jeerihaveli.com/"
    },
    {
        id: "03",
        title: "Pigo Taxi",
        category: "Transportation",
        description: "Admin dashboard and fleet management system for a regional taxi service. Live tracking and driver analytics.",
        tags: ["Flutter", "Google Maps API", "Firebase"],
        color: "from-[#0055FF] to-[#0099FF]", // Blue
        textColor: "text-white",
        src: "/project/pigo 2.jpeg",
        link: "#"
    },
    {
        id: "04",
        title: "Jodhpur Bombay Roadway",
        category: "Logistics",
        description: "Comprehensive logistics management system with route optimization, real-time tracking, and fleet management.",
        tags: ["Vue.js", "Python", "PostgreSQL"],
        color: "from-[#0F766E] to-[#14B8A6]", // Teal
        textColor: "text-white",
        src: "/project/jodhpur.png",
        link: "https://jodhpurbombay.vercel.app/auth/login"
    },
    {
        id: "05",
        title: "Vehicle Rental",
        category: "Rental",
        description: "Complete vehicle rental platform with booking management, insurance integration, and customer verification system.",
        tags: ["React", "Node.js", "MongoDB"],
        color: "from-[#581C87] to-[#7E22CE]", // Purple
        textColor: "text-white",
        src: "/project/vor.jpeg",
        link: "https://vehiclesonrent.com/vehicle-on-rent.php"
    },
    {
        id: "06",
        title: "Nikki Fashion",
        category: "Fashion",
        description: "Complete fashion e-commerce platform with advanced product catalog, size management, payment processing, and inventory tracking.",
        tags: ["Next.js", "React", "Stripe"],
        color: "from-[#BE185D] to-[#EC4899]", // Pink
        textColor: "text-white",
        src: "/project/nikkifashion.png",
        link: "https://nikkifashion.com"
    }
];

import Link from "next/link";

function Card({ project, index, range, targetScale }: { project: any, index: number, range: any, targetScale: number }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
    const scale = useTransform(scrollYProgress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${index * 25}px)` }}
                className={`relative flex flex-col md:flex-row w-full max-w-[1000px] h-auto md:h-[500px] rounded-[25px] p-6 md:p-12 origin-top bg-gradient-to-br ${project.color} border border-white/10 shadow-2xl overflow-hidden`}
            >
                {/* Mobile Title (Visible only on small screens) */}
                <div className={`md:hidden flex justify-between items-center mb-6 ${project.textColor}`}>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">{project.title}</h2>
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest border border-current px-3 py-1 rounded-full">
                        {project.category}
                    </div>
                </div>

                <div className={`flex flex-col md:flex-row h-full gap-8 md:gap-12 ${project.textColor} w-full`}>
                    <div className="w-full md:w-[35%] flex flex-col justify-between order-2 md:order-1">
                        <div>
                            {/* Desktop Title */}
                            <div className="hidden md:flex justify-between items-center mb-10">
                                <h2 className="text-4xl font-bold uppercase tracking-tighter">{project.title}</h2>
                            </div>

                            <div className="hidden md:flex items-center gap-2 font-mono text-sm uppercase tracking-widest border border-current px-4 py-1 rounded-full w-fit mb-8">
                                {project.category}
                            </div>

                            <p className="text-base md:text-xl leading-relaxed opacity-90 mb-6 md:mb-0">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4 md:mt-8">
                                {project.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs md:text-sm font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link href={project.link} target="_blank" className="flex items-center gap-2 text-base md:text-lg font-bold uppercase tracking-widest group w-fit mt-8">
                            View Work
                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:rotate-45" />
                        </Link>
                    </div>

                    <div className="relative w-full md:w-[65%] h-[250px] md:h-full rounded-2xl overflow-hidden bg-black/20 order-1 md:order-2">
                        <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
                            <Image
                                fill
                                src={project.src}
                                alt={project.title}
                                className="object-cover object-top"
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
        <section ref={container} id="work" className="bg-black relative">
            <div className="pt-32 pb-10 px-6 md:px-20 text-center">
                <h2 className="text-5xl md:text-8xl font-black uppercase mb-4">
                    Selected <span className="text-shivkara-orange">Works</span>
                </h2>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                    Crafting digital experiences that leave a lasting impression.
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
