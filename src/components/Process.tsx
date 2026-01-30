"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb, Search, Code2, Rocket } from "lucide-react";
import { useRef } from "react";

const steps = [
    {
        id: "01",
        title: "Deep Dive",
        subtitle: "Discovery & Strategy",
        description: "We immerse ourselves in your ecosystem. Analyzing market dynamics, user behavior, and business KPIs to build a rock-solid foundation.",
        icon: Search,
        accent: "text-blue-500",
        bgAccent: "bg-blue-500/10"
    },
    {
        id: "02",
        title: "Blueprint",
        subtitle: "Architecture & Design",
        description: "Crafting the technical roadmap and visual language. We design systems that are scalable, secure, and visually stunning.",
        icon: Lightbulb,
        accent: "text-amber-500",
        bgAccent: "bg-amber-500/10"
    },
    {
        id: "03",
        title: "Construction",
        subtitle: "Development & Testing",
        description: "Writing clean, efficient code. We build with modern frameworks and rigorous testing protocols to ensure zero-defect delivery.",
        icon: Code2,
        accent: "text-emerald-500",
        bgAccent: "bg-emerald-500/10"
    },
    {
        id: "04",
        title: "Liftoff",
        subtitle: "Launch & Growth",
        description: "Deploying to production with confidence. We monitor performance and iterate based on real-world usage data.",
        icon: Rocket,
        accent: "text-purple-500",
        bgAccent: "bg-purple-500/10"
    }
];

export default function Process() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} id="process" className="relative h-[300vh] bg-[#030303]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />

                {/* Parallax Background Text */}
                <motion.div
                    style={{ x: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
                    className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap opacity-[0.03] select-none pointer-events-none"
                >
                    <span className="text-[20vw] font-black uppercase text-white tracking-tighter">
                        Workflow Methodology Process
                    </span>
                </motion.div>

                {/* Section Title */}
                <div className="absolute top-12 left-6 md:left-20 z-10 mix-blend-difference">
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Workflow</span>
                    <h2 className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter">
                        The Process
                    </h2>
                </div>

                <motion.div style={{ x }} className="flex gap-4 md:gap-20 pl-6 md:pl-[25vw] items-center">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            {/* Connecting Line */}
                            {index !== steps.length - 1 && (
                                <div className="absolute top-1/2 left-full w-20 h-[2px] bg-white/10 hidden md:block" />
                            )}

                            <div
                                className="relative h-[400px] md:h-[450px] w-[85vw] md:w-[450px] flex-shrink-0 glass-card-premium rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-white/20"
                            >
                                {/* Active State Border */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                                <div>
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`w-16 h-16 rounded-2xl ${step.bgAccent} border border-white/5 flex items-center justify-center ${step.accent}`}>
                                            <step.icon className="w-8 h-8" />
                                        </div>
                                        <span className="text-6xl font-black text-white/[0.03] tabular-nums font-mono">
                                            {step.id}
                                        </span>
                                    </div>

                                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-2 ${step.accent}`}>
                                        {step.subtitle}
                                    </h4>
                                    <h3 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-shivkara-orange transition-colors" />
                                    <span className="text-xs font-mono text-gray-500 uppercase">Phase {step.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
