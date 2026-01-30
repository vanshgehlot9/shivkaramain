"use client";

import { motion } from "framer-motion";
import { GitMerge, Repeat, Zap, Box } from "lucide-react";

export default function Methodology() {
    return (
        <section className="py-24 bg-black border-y border-white/5 relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Engineering</span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">
                        DevOps & <span className="text-gray-600">Agile</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="p-8 border-l border-white/10 relative group">
                        <div className="absolute top-0 left-0 w-[1px] h-0 bg-shivkara-orange group-hover:h-full transition-all duration-700" />
                        <GitMerge className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">CI/CD Pipelines</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Automated testing and deployment ensures seamless integration and reliable releases every time.
                        </p>
                    </div>

                    <div className="p-8 border-l border-white/10 relative group">
                        <div className="absolute top-0 left-0 w-[1px] h-0 bg-shivkara-orange group-hover:h-full transition-all duration-700 delay-100" />
                        <Repeat className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Agile Sprints</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Two-week sprints with regular demos keep stakeholders aligned and allow for rapid pivots.
                        </p>
                    </div>

                    <div className="p-8 border-l border-white/10 relative group">
                        <div className="absolute top-0 left-0 w-[1px] h-0 bg-shivkara-orange group-hover:h-full transition-all duration-700 delay-200" />
                        <Box className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Microservices</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Decoupled architecture for independent scaling, fault isolation, and faster time-to-market.
                        </p>
                    </div>

                    <div className="p-8 border-l border-white/10 relative group">
                        <div className="absolute top-0 left-0 w-[1px] h-0 bg-shivkara-orange group-hover:h-full transition-all duration-700 delay-300" />
                        <Zap className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Performance First</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Every line of code is optimized for speed. We benchmark against Core Web Vitals and server latency.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
