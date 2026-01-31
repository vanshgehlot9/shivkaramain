"use client";

import { motion } from "framer-motion";

const technologies = [
    "React Native", "Next.js", "TypeScript", "Node.js", "AWS", "Docker", "Kubernetes", "GraphQL", "Python", "Flutter", "Firebase", "PostgreSQL", "MongoDB", "Redis", "Solidity", "Rust", "Go"
];

export default function Marquee() {
    return (
        <section className="py-24 bg-[#030303] overflow-hidden relative z-20">
            {/* Background Effects */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#030303] to-transparent z-30 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#030303] to-transparent z-30 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

            <div className="flex flex-col gap-12 -rotate-2 scale-105 origin-center">

                {/* Row 1: Left */}
                <div className="flex whitespace-nowrap">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            duration: 50,
                            ease: "linear",
                        }}
                        className="flex space-x-16 items-center"
                    >
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <div key={index} className="flex items-center space-x-8 group cursor-default">
                                <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 group-hover:from-white group-hover:to-gray-400 transition-all duration-500 uppercase tracking-tighter"
                                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
                                    {tech}
                                </span>
                                <span className="text-shivkara-orange/50 text-4xl group-hover:text-shivkara-orange group-hover:scale-125 transition-all duration-500">✦</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Right */}
                <div className="flex whitespace-nowrap">
                    <motion.div
                        animate={{ x: [-1000, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 50,
                            ease: "linear",
                        }}
                        className="flex space-x-16 items-center"
                    >
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <div key={index} className="flex items-center space-x-8 group cursor-default">
                                <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-shivkara-orange/20 to-transparent group-hover:from-shivkara-orange group-hover:to-red-500 transition-all duration-500 uppercase tracking-tighter"
                                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
                                    {tech}
                                </span>
                                <span className="text-white/20 text-4xl group-hover:text-white group-hover:rotate-90 transition-all duration-500">✦</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
