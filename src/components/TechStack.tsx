"use client";

import { motion } from "framer-motion";
import Marquee from "./Marquee";
import { Code2, Database, Globe, Smartphone, Cloud, Cpu, Server, Layers } from "lucide-react";

const technologies = [
    { name: "React", icon: Code2 },
    { name: "Next.js", icon: Globe },
    { name: "Node.js", icon: Server },
    { name: "Python", icon: Code2 },
    { name: "AWS", icon: Cloud },
    { name: "Docker", icon: Layers },
    { name: "Flutter", icon: Smartphone },
    { name: "Firebase", icon: Database },
    { name: "TensorFlow", icon: Cpu },
    { name: "PostgreSQL", icon: Database },
];

export default function TechStack() {
    return (
        <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

            <div className="container mx-auto px-6 mb-12 text-center relative z-20">
                <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase block mb-3">Our Arsenal</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Powered by Modern Tech
                </h2>
            </div>

            <div className="relative z-0">
                <div className="flex overflow-hidden group">
                    <motion.div
                        className="flex gap-12 md:gap-20 px-12"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 30,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <div key={index} className="flex flex-col items-center gap-4 group/item min-w-max">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 group-hover/item:text-shivkara-orange group-hover/item:border-shivkara-orange/30 group-hover/item:bg-shivkara-orange/5 transition-all duration-300">
                                    <tech.icon className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <span className="text-gray-500 font-medium text-sm group-hover/item:text-white transition-colors">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
