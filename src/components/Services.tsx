"use client";

import { motion } from "framer-motion";
import { Code, Smartphone, Globe, Database, Cpu, ArrowUpRight, Cloud, Layers } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

const services = [
    {
        title: "Custom Software",
        description: "Tailored enterprise solutions for massive scalability.",
        icon: Code,
        colSpan: "md:col-span-2",
        tech: ["React", "Node", "Go"]
    },
    {
        title: "Mobile Apps",
        description: "Native & cross-platform engagement.",
        icon: Smartphone,
        colSpan: "md:col-span-1",
        tech: ["Flutter", "Swift"]
    },
    {
        title: "Web Platforms",
        description: "High-performance Next.js applications.",
        icon: Globe,
        colSpan: "md:col-span-1",
        tech: ["Next.js", "Vercel"]
    },
    {
        title: "Cloud Infra",
        description: "Scalable, secure 99.99% uptime architectures.",
        icon: Cloud,
        colSpan: "md:col-span-2",
        tech: ["AWS", "K8s"]
    },
    {
        title: "AI Integration",
        description: "Automating workflows with LLMs and ML.",
        icon: Cpu,
        colSpan: "md:col-span-3",
        tech: ["OpenAI", "Python"]
    },
];

export default function Services() {
    return (
        <section id="services" className="py-20 bg-[#030303] relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-shivkara-orange font-mono text-[10px] tracking-widest uppercase mb-2 block">/// Capabilities</span>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">
                            System <span className="text-gray-600">Architecture</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-sm text-sm md:text-base font-light leading-relaxed border-l border-shivkara-orange/30 pl-4"
                    >
                        Precision engineering for digital dominance. We build the systems that others can't.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`${service.colSpan} h-full`}
                        >
                            <SpotlightCard className="h-full rounded-2xl p-6 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 rounded-lg bg-white/5 text-white group-hover:text-shivkara-orange group-hover:bg-shivkara-orange/10 transition-colors">
                                                <service.icon className="w-5 h-5" />
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-shivkara-orange transition-colors opacity-0 group-hover:opacity-100" />
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gray-200 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed font-light">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {service.tech.map(t => (
                                            <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
