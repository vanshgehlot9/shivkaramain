"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Smartphone, Globe, Database, Cpu, ArrowUpRight, Cloud, Landmark, HeartPulse, ShoppingBag, Truck, GraduationCap, Building2, Server } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

const services = [
    {
        title: "Enterprise Software Architecture",
        description: "Tailored enterprise solutions engineered for massive scalability and 99.99% uptime.",
        icon: Database,
        tech: ["Golang", "Node.js", "Microservices"]
    },
    {
        title: "Native Mobile Engineering",
        description: "High-performance iOS & Android applications with native fidelity.",
        icon: Smartphone,
        tech: ["SwiftUI", "Kotlin", "Flutter"]
    },
    {
        title: "Modern Web Platforms",
        description: "Next-gen web applications built on the edge for speed and SEO dominance.",
        icon: Globe,
        tech: ["Next.js 14", "React Server Components", "Vercel"]
    },
    {
        title: "Cloud Infrastructure",
        description: "Serverless architectures and Kubernetes orchestration.",
        icon: Cloud,
        tech: ["AWS", "Docker", "Terraform"]
    },
    {
        title: "AI Integration & RAG",
        description: "Automating complex enterprise workflows with custom LLM integrations.",
        icon: Cpu,
        tech: ["OpenAI", "LangChain", "Python"]
    },
];

const industries = [
    {
        title: "FinTech",
        description: "Secure payment gateways, blockchain solutions, banking.",
        icon: Landmark
    },
    {
        title: "HealthTech",
        description: "HIPAA-compliant telemedicine & patient systems.",
        icon: HeartPulse
    },
    {
        title: "E-Commerce",
        description: "High-conversion storefronts & headless commerce.",
        icon: ShoppingBag
    },
    {
        title: "Logistics",
        description: "Real-time fleet tracking & supply chain optimization.",
        icon: Truck
    },
    {
        title: "EdTech",
        description: "Interactive LMS & virtual classroom platforms.",
        icon: GraduationCap
    },
    {
        title: "Real Estate",
        description: "Virtual tours & property CRM integrations.",
        icon: Building2
    }
];

export default function CoreCapabilities() {
    const [activeTab, setActiveTab] = useState<"services" | "sectors">("services");

    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Tech Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

            {/* Circuit Lines Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shivkara-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-shivkara-orange"></span>
                            </span>
                            <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase">/// System Capabilities</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9]"
                        >
                            Engineered for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
                                Scale & Impact
                            </span>
                        </motion.h2>
                    </div>

                    {/* Glass Toggle Switch */}
                    <div className="p-1.5 bg-white/[0.03] rounded-full border border-white/10 flex relative backdrop-blur-xl shadow-2xl">
                        <div
                            className={`absolute inset-y-1.5 rounded-full bg-shivkara-orange/90 shadow-[0_0_15px_rgba(255,77,0,0.4)] transition-all duration-500 ease-[0.23,1,0.32,1] ${activeTab === "services" ? "left-1.5 right-1/2" : "left-1/2 right-1.5"}`}
                        />
                        <button
                            onClick={() => setActiveTab("services")}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === "services" ? "text-black" : "text-gray-500 hover:text-white"}`}
                        >
                            Capabilities
                        </button>
                        <button
                            onClick={() => setActiveTab("sectors")}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === "sectors" ? "text-black" : "text-gray-500 hover:text-white"}`}
                        >
                            Sectors
                        </button>
                    </div>
                </div>

                <div className="min-h-[400px] md:min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "services" ? (
                            <>
                                {/* Desktop Grid */}
                                <motion.div
                                    key="services-grid-desktop"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {services.map((service, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`group relative h-full`}
                                        >
                                            <SpotlightCard className="h-full rounded-2xl p-8 bg-[#050505] border border-white/5 hover:border-shivkara-orange/30 hover:shadow-[0_0_30px_rgba(255,77,0,0.1)] transition-all duration-500 flex flex-col justify-between overflow-hidden group">
                                                {/* Inner Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-shivkara-orange group-hover:border-shivkara-orange/20 group-hover:bg-shivkara-orange/5 transition-all duration-500">
                                                            <service.icon className="w-7 h-7" />
                                                        </div>
                                                        <ArrowUpRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-500" />
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">{service.title}</h3>
                                                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">{service.description}</p>
                                                </div>

                                                <div className="relative z-10 border-t border-white/5 pt-6">
                                                    <div className="flex flex-wrap gap-2">
                                                        {service.tech.map(t => (
                                                            <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-white/[0.02] text-gray-500 border border-white/5 group-hover:border-white/10 group-hover:text-gray-300 transition-colors">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </SpotlightCard>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Mobile Slider */}
                                <motion.div
                                    key="services-slider-mobile"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="md:hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] -mx-6"
                                >
                                    <motion.div
                                        className="flex gap-4 w-max px-6"
                                        animate={{ x: "-50%" }}
                                        transition={{
                                            duration: 30,
                                            repeat: Infinity,
                                            ease: "linear",
                                            repeatType: "loop"
                                        }}
                                    >
                                        {[...services, ...services].map((service, index) => (
                                            <div
                                                key={`mobile-service-${index}`}
                                                className="w-[300px] h-[420px] relative rounded-2xl p-6 bg-[#050505] border border-white/10 flex flex-col justify-between overflow-hidden"
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-shivkara-orange">
                                                            <service.icon className="w-6 h-6" />
                                                        </div>
                                                        <ArrowUpRight className="w-5 h-5 text-gray-600" />
                                                    </div>

                                                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                                    <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">{service.description}</p>
                                                </div>

                                                <div className="relative z-10 border-t border-white/5 pt-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {service.tech.slice(0, 3).map(t => (
                                                            <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-white/[0.02] text-gray-500 border border-white/5">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                {/* Desktop Grid */}
                                <motion.div
                                    key="sectors-grid-desktop"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="hidden md:grid md:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                                >
                                    {industries.map((sector, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="aspect-square group"
                                        >
                                            <SpotlightCard className="h-full rounded-2xl p-6 bg-[#050505] border border-white/5 hover:bg-white/[0.03] transition-all duration-300 flex flex-col justify-center items-center text-center relative overflow-hidden cursor-pointer">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                <div className="relative z-10 mb-6 p-4 rounded-full bg-white/[0.03] text-gray-400 group-hover:text-shivkara-orange group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-shivkara-orange/20">
                                                    <sector.icon className="w-8 h-8" />
                                                </div>

                                                <h3 className="relative z-10 text-lg font-bold text-white mb-2 group-hover:text-shivkara-orange transition-colors">{sector.title}</h3>
                                                <p className="relative z-10 text-gray-500 text-xs hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">{sector.description}</p>
                                            </SpotlightCard>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Mobile Slider */}
                                <motion.div
                                    key="sectors-slider-mobile"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="md:hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] -mx-6"
                                >
                                    <motion.div
                                        className="flex gap-4 w-max px-6"
                                        animate={{ x: "-50%" }}
                                        transition={{
                                            duration: 25,
                                            repeat: Infinity,
                                            ease: "linear",
                                            repeatType: "loop"
                                        }}
                                    >
                                        {[...industries, ...industries].map((sector, index) => (
                                            <div
                                                key={`mobile-sector-${index}`}
                                                className="w-[200px] aspect-square rounded-2xl p-6 bg-[#050505] border border-white/10 flex flex-col justify-center items-center text-center relative overflow-hidden"
                                            >
                                                <div className="relative z-10 mb-4 p-4 rounded-full bg-white/[0.03] text-shivkara-orange border border-white/5">
                                                    <sector.icon className="w-8 h-8" />
                                                </div>
                                                <h3 className="relative z-10 text-lg font-bold text-white">{sector.title}</h3>
                                            </div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
