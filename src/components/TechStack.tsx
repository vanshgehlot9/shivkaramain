"use client";

import { motion } from "framer-motion";
import Marquee from "./Marquee";
import {
    Code2,
    Database,
    Globe,
    Smartphone,
    Cloud,
    Cpu,
    Server,
    Layers,
    Box,
    Terminal,
    Zap
} from "lucide-react";

/**
 * Enhanced tech stack component with glassmorphism cards and neon glow effects.
 */

const technologies = [
    { name: "React", icon: Code2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Next.js", icon: Globe, color: "text-white", bg: "bg-white/10", border: "border-white/20" },
    { name: "Node.js", icon: Server, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    { name: "Python", icon: Terminal, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { name: "AWS", icon: Cloud, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { name: "Docker", icon: Box, color: "text-blue-300", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { name: "Flutter", icon: Smartphone, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { name: "Firebase", icon: Zap, color: "text-yellow-300", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
    { name: "TensorFlow", icon: Cpu, color: "text-orange-500", bg: "bg-orange-600/10", border: "border-orange-600/20" },
    { name: "PostgreSQL", icon: Database, color: "text-blue-500", bg: "bg-blue-600/10", border: "border-blue-600/20" },
    { name: "GraphQL", icon: Layers, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

export default function TechStack() {
    return (
        <section className="py-32 bg-[#030303] border-y border-white/5 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] z-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-shivkara-orange/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 mb-20 text-center relative z-20">
                <span className="text-shivkara-orange font-mono text-xs tracking-[0.3em] uppercase block mb-6 animate-pulse">
                    /// SYSTEM ARCHITECTURE
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                    Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-red-500">Modern Tech</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                    We leverage the most advanced frameworks and infrastructure to build scalable, high-performance digital solutions.
                </p>
            </div>

            <div className="relative z-0">
                <div className="flex overflow-hidden group py-10">
                    <motion.div
                        className="flex gap-8 md:gap-12 px-8"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 40,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <div
                                key={index}
                                className="group/card relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/5 hover:border-white/20 transition-all duration-300 min-w-[max-content]"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-3xl bg-gradient-to-br ${tech.bg.replace("bg-", "from-").replace("/10", "/20")} to-transparent blur-xl`} />

                                <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover/card:scale-110 ${tech.color} ${tech.bg} ${tech.border} border`}>
                                    <tech.icon className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <span className="relative z-10 text-gray-500 font-bold text-xs md:text-sm uppercase tracking-wider group-hover/card:text-white transition-colors">
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
