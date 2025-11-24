"use client";

import { motion } from "framer-motion";

const technologies = [
    "React Native", "Next.js", "TypeScript", "Node.js", "AWS", "Docker", "Kubernetes", "GraphQL", "Python", "Flutter", "Firebase", "PostgreSQL", "MongoDB", "Redis"
];

export default function Marquee() {
    return (
        <section className="py-20 bg-black overflow-hidden relative z-20">
            {/* Gradient Masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-30 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-30 pointer-events-none" />

            <div className="flex flex-col gap-8 -rotate-3 scale-110 origin-center">
                {/* Row 1: Left */}
                <div className="flex whitespace-nowrap">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            duration: 40,
                            ease: "linear",
                        }}
                        className="flex space-x-16 items-center"
                    >
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <div key={index} className="flex items-center space-x-8 group cursor-default opacity-50 hover:opacity-100 transition-opacity duration-300">
                                <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 uppercase tracking-tighter">
                                    {tech}
                                </span>
                                <span className="text-shivkara-orange text-3xl">✦</span>
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
                            duration: 40,
                            ease: "linear",
                        }}
                        className="flex space-x-16 items-center"
                    >
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <div key={index} className="flex items-center space-x-8 group cursor-default opacity-50 hover:opacity-100 transition-opacity duration-300">
                                <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/5 stroke-white stroke-1 uppercase tracking-tighter">
                                    {tech}
                                </span>
                                <span className="text-shivkara-orange text-3xl">✦</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
