"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flag, Search, GitBranch, Zap, Terminal, Layout, Code2, Rocket, ChevronRight } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";
import { useState } from "react";

// Onboarding Steps (First 2 Weeks)
const onboardingSteps = [
    {
        day: "Day 1",
        title: "Strategic Kickoff",
        desc: "Goal alignment, repo setup & access granting.",
        icon: Flag,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        day: "Day 3",
        title: "Architecture Deep Dive",
        desc: "Selecting the stack & database schema design.",
        icon: Search,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        day: "Day 7",
        title: "Sprint 0 Initiation",
        desc: "Backlog creation & CI/CD pipeline setup.",
        icon: GitBranch,
        gradient: "from-pink-500 to-rose-500"
    },
    {
        day: "Day 14",
        title: "Staging Deployment",
        desc: "First MVP version live on staging.",
        icon: Zap,
        gradient: "from-amber-500 to-shivkara-orange"
    }
];

// Long-term Process Steps
const processSteps = [
    {
        id: "01",
        title: "Strategy",
        subtitle: "The Foundation",
        desc: "We analyze market dynamics and user behavior to build a rock-solid roadmap.",
        icon: Terminal,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "02",
        title: "Design",
        subtitle: "Visual System",
        desc: "Crafting scalable design systems and high-fidelity prototypes.",
        icon: Layout,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: "03",
        title: "Develop",
        subtitle: "Engineering",
        desc: "Writing clean, efficient code with rigorous testing.",
        icon: Code2,
        gradient: "from-shivkara-orange to-red-500"
    },
    {
        id: "04",
        title: "Scale",
        subtitle: "Growth",
        desc: "Deploying to production and iterating based on data.",
        icon: Rocket,
        gradient: "from-green-500 to-emerald-500"
    }
];

// JSON-LD for HowTo Schema
const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How Shivkara Digital Onboards Clients",
    "description": "Our proven 14-day client onboarding process for rapid digital transformation.",
    "step": onboardingSteps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title,
        "text": step.desc
    }))
};

export default function UnifiedProcess() {
    const [activeTab, setActiveTab] = useState<"onboarding" | "process">("onboarding");

    return (
        <section id="process" className="py-32 bg-[#030303] relative overflow-hidden border-t border-white/5">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />

            {/* Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
            <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-shivkara-orange/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shivkara-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-shivkara-orange"></span>
                            </span>
                            <span className="text-shivkara-orange font-mono text-xs tracking-[0.3em] uppercase">/// Execution Protocol</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9]"
                        >
                            How We <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                                Operate
                            </span>
                        </motion.h2>
                    </div>

                    {/* Tab Switcher */}
                    <div className="p-1.5 bg-white/[0.03] rounded-full border border-white/10 flex relative backdrop-blur-xl shadow-2xl">
                        <div
                            className={`absolute inset-y-1.5 rounded-full bg-gradient-to-r from-shivkara-orange to-red-500 shadow-[0_0_20px_rgba(255,77,0,0.4)] transition-all duration-500 ease-[0.23,1,0.32,1] ${activeTab === "onboarding" ? "left-1.5 right-1/2" : "left-1/2 right-1.5"}`}
                        />
                        <button
                            onClick={() => setActiveTab("onboarding")}
                            className={`relative z-10 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === "onboarding" ? "text-white" : "text-gray-500 hover:text-white"}`}
                        >
                            First 14 Days
                        </button>
                        <button
                            onClick={() => setActiveTab("process")}
                            className={`relative z-10 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === "process" ? "text-white" : "text-gray-500 hover:text-white"}`}
                        >
                            Full Workflow
                        </button>
                    </div>
                </div>

                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "onboarding" ? (
                            <motion.div
                                key="onboarding-grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {onboardingSteps.map((step, index) => (
                                    <div key={index} className="relative group h-full">
                                        <SpotlightCard className="h-full bg-[#050505] border border-white/5 rounded-2xl p-6 hover:border-shivkara-orange/30 hover:shadow-[0_0_30px_rgba(255,77,0,0.05)] transition-all duration-500 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${step.gradient} bg-opacity-10 text-xs font-mono text-white border border-white/5`}>
                                                        {step.day}
                                                    </div>
                                                    <step.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">{step.title}</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                                            </div>

                                            <div className="mt-6 w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full bg-gradient-to-r ${step.gradient} w-0 group-hover:w-full transition-all duration-700 ease-out`} />
                                            </div>
                                        </SpotlightCard>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="process-grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {processSteps.map((step, index) => (
                                    <div key={index} className="group h-full">
                                        <SpotlightCard className="h-full bg-[#050505] border border-white/5 rounded-2xl p-8 hover:border-shivkara-orange/30 hover:shadow-[0_0_30px_rgba(255,77,0,0.05)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden">

                                            <div className="absolute -right-4 -top-4 text-[8rem] font-black text-white/[0.02] tabular-nums font-mono leading-none pointer-events-none select-none group-hover:text-white/[0.04] transition-colors">
                                                {step.id}
                                            </div>

                                            <div className="relative z-10">
                                                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 text-transparent bg-clip-text bg-gradient-to-r ${step.gradient}`}>
                                                    {step.subtitle}
                                                </h4>
                                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">{step.title}</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed">
                                                    {step.desc}
                                                </p>
                                            </div>
                                            <div className="mt-8 flex justify-end">
                                                <div className={`p-3 rounded-full bg-white/5 group-hover:bg-gradient-to-br ${step.gradient} text-gray-400 group-hover:text-white transition-all duration-300`}>
                                                    <step.icon className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </SpotlightCard>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
