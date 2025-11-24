"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb, Search, Code2, Rocket } from "lucide-react";
import { useRef } from "react";

const steps = [
    {
        id: "01",
        title: "Discovery",
        description: "We dive deep into your business goals, market landscape, and user needs to build a solid foundation.",
        icon: Search,
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "02",
        title: "Strategy",
        description: "Crafting a comprehensive roadmap that aligns technology with your long-term vision and KPIs.",
        icon: Lightbulb,
        color: "from-yellow-500 to-orange-500"
    },
    {
        id: "03",
        title: "Development",
        description: "Building robust, scalable solutions using cutting-edge tech stacks with a focus on performance.",
        icon: Code2,
        color: "from-green-500 to-emerald-500"
    },
    {
        id: "04",
        title: "Launch & Scale",
        description: "Deploying your product with zero downtime and optimizing for rapid user growth and retention.",
        icon: Rocket,
        color: "from-purple-500 to-pink-500"
    }
];

export default function Process() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} id="process" className="relative h-[300vh] bg-black">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Background Title */}
                <div className="absolute top-10 left-10 z-0">
                    <h3 className="text-shivkara-orange font-bold tracking-widest uppercase mb-2">How We Work</h3>
                    <h2 className="text-5xl md:text-7xl font-black uppercase text-white">
                        The Process
                    </h2>
                </div>

                <motion.div style={{ x }} className="flex gap-6 md:gap-10 pl-6 md:pl-[20vw]">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative h-[400px] md:h-[500px] w-[85vw] md:w-[400px] flex-shrink-0 overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/10 p-6 md:p-8 transition-all duration-300 hover:border-white/20"
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            {/* Large Number */}
                            <div className="absolute -right-4 -top-4 text-9xl font-black text-white/5 select-none group-hover:text-white/10 transition-colors duration-500">
                                {step.id}
                            </div>

                            <div className="relative z-10 flex h-full flex-col justify-between">
                                <div>
                                    <div className={`mb-6 md:mb-8 inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
                                        <step.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                                    </div>
                                    <h3 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold uppercase text-white">{step.title}</h3>
                                    <p className="text-base md:text-lg leading-relaxed text-gray-400">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                                    <span>STEP {step.id}</span>
                                    <div className="h-px w-12 bg-current" />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
