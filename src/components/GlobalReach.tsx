"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function GlobalReach() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* World Map Background (Abstract) */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-contain" style={{ filter: 'invert(1)' }} />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center justify-center p-4 rounded-full bg-shivkara-orange/10 border border-shivkara-orange/20 mb-8"
                >
                    <Globe className="w-6 h-6 text-shivkara-orange animate-pulse" />
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-6">
                    Global <span className="text-gray-600">Impact</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-16">
                    Delivering digital excellence to clients across 12+ countries. Time zones don't limit us; they empower our 24/7 delivery cycle.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {[
                        { city: "New York", country: "USA" },
                        { city: "London", country: "UK" },
                        { city: "Dubai", country: "UAE" },
                        { city: "Jodhpur", country: "India" },
                        { city: "Sydney", country: "Australia" },
                        { city: "Toronto", country: "Canada" },
                        { city: "Berlin", country: "Germany" },
                        { city: "Singapore", country: "Singapore" },
                    ].map((loc, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-shivkara-orange/30 transition-colors"
                        >
                            <h4 className="text-white font-bold">{loc.city}</h4>
                            <span className="text-xs text-gray-500 font-mono uppercase">{loc.country}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
