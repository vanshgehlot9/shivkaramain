"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code, Smartphone, Globe, Database, Cpu, ArrowUpRight } from "lucide-react";
import { MouseEvent, useRef } from "react";
import SpotlightCard from "./ui/SpotlightCard";

const services = [
    {
        title: "Custom Software",
        description: "Tailored enterprise solutions that solve complex business challenges with precision allowing for massive scalability.",
        icon: Code,
        colSpan: "md:col-span-2",
        tech: ["React", "Node.js", "Python"]
    },
    {
        title: "Mobile Evolution",
        description: "Native and cross-platform apps designed for maximum user engagement.",
        icon: Smartphone,
        colSpan: "md:col-span-1",
        tech: ["Flutter", "Swift", "Kotlin"]
    },
    {
        title: "Web Platforms",
        description: "High-performance web applications built with Next.js and modern edge technologies.",
        icon: Globe,
        colSpan: "md:col-span-1",
        tech: ["Next.js", "Vercel", "Tailwind"]
    },
    {
        title: "Cloud Infrastructure",
        description: "Scalable cloud architectures ensuring 99.99% uptime and security.",
        icon: Database,
        colSpan: "md:col-span-2",
        tech: ["AWS", "Docker", "Kubernetes"]
    },
    {
        title: "AI Integration",
        description: "Leveraging LLMs and machine learning to automate workflows and generate business insights.",
        icon: Cpu,
        colSpan: "md:col-span-3",
        tech: ["OpenAI", "TensorFlow", "PyTorch"]
    },
];

function ServiceCard({ service, index }: { service: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
            className={`group relative ${service.colSpan} min-w-[85vw] md:min-w-0 snap-center h-full`}
        >
            <SpotlightCard className="h-full rounded-3xl p-8 md:p-10 transition-colors duration-500 hover:bg-white/[0.05]">
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 text-white group-hover:text-shivkara-orange group-hover:scale-110 group-hover:bg-shivkara-orange/10 group-hover:border-shivkara-orange/20 transition-all duration-500 shadow-xl">
                            <service.icon className="w-7 h-7" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                            {service.title}
                        </h3>

                        <p className="text-gray-400 leading-relaxed max-w-lg group-hover:text-gray-300 transition-colors duration-300 font-light text-lg">
                            {service.description}
                        </p>
                    </div>

                    <div className="mt-10 border-t border-white/5 pt-6 flex justify-between items-end">
                        <div className="flex flex-wrap gap-2">
                            {service.tech.map((t: string) => (
                                <span key={t} className="text-xs font-mono px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-gray-500 group-hover:text-white group-hover:border-white/20 transition-colors">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowUpRight className="w-6 h-6 text-shivkara-orange" />
                        </div>
                    </div>
                </div>
            </SpotlightCard>
        </motion.div>
    );
}

export default function Services() {
    return (
        <section id="services" className="py-32 bg-[#030303] relative overflow-hidden">
            {/* Background Noise */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Capabilities</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-none">
                            System <br /><span className="text-gray-500">Architecture</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-400 max-w-md text-lg font-light leading-relaxed border-l border-shivkara-orange/30 pl-6"
                    >
                        Engineering digital dominance through cutting-edge technology and precision design. We build what others can't.
                    </motion.p>
                </div>

                <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-6 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide pb-8 md:pb-0">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
