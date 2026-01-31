"use client";

import { motion } from "framer-motion";
import { Flag, Search, GitBranch, Zap, ArrowRight } from "lucide-react";

const steps = [
    {
        day: "Day 1",
        title: "Strategic Kickoff",
        description: "Goal alignment, repo setup & access granting. Setting the stage for a successful project.",
        icon: Flag,
        color: "from-blue-500 to-cyan-500"
    },
    {
        day: "Day 3",
        title: "Architecture Deep Dive",
        description: "Selecting the stack (Next.js/native) & database schema. Technical foundations laid.",
        icon: Search,
        color: "from-purple-500 to-pink-500"
    },
    {
        day: "Day 7",
        title: "Sprint 0 Initiation",
        description: "Backlog creation, prioritization & CI/CD pipeline setup. Development begins.",
        icon: GitBranch,
        color: "from-pink-500 to-rose-500"
    },
    {
        day: "Day 14",
        title: "Staging Deployment",
        description: "First MVP version live on staging environment. Real feedback loops start.",
        icon: Zap,
        color: "from-amber-500 to-shivkara-orange"
    }
];

export default function OnboardingRoadmap() {
    return (
        <section className="py-32 bg-[#030303] border-b border-white/5 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-shivkara-orange/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-shivkara-orange font-mono text-xs tracking-[0.3em] uppercase mb-4 block"
                    >
                        /// The First 14 Days
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter"
                    >
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Onboarding</span>
                    </motion.h2>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Connecting Line - Horizontal Desktop */}
                    <div className="hidden lg:block absolute top-[80px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Connecting Line - Vertical Mobile */}
                    <div className="block lg:hidden absolute top-0 left-6 h-full w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="relative group pl-16 lg:pl-0"
                            >
                                {/* Dot on line - Desktop */}
                                <div className="hidden lg:flex absolute top-[72px] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#030303] border-[3px] border-white/20 group-hover:border-shivkara-orange group-hover:shadow-[0_0_15px_rgba(255,107,0,0.5)] transition-all z-20 items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-shivkara-orange transition-colors" />
                                </div>

                                {/* Dot on line - Mobile */}
                                <div className="flex lg:hidden absolute top-10 left-[18px] w-4 h-4 rounded-full bg-[#030303] border-[2px] border-white/20 group-hover:border-shivkara-orange transition-colors z-20 items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-shivkara-orange transition-colors" />
                                </div>

                                {/* Day Label */}
                                <div className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b ${step.color} opacity-30 group-hover:opacity-60 transition-opacity mb-6 lg:text-center`}>
                                    {step.day}
                                </div>

                                {/* Card */}
                                <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-300 min-h-[200px] flex flex-col">
                                    <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />

                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} bg-opacity-10 flex items-center justify-center text-white/80`}>
                                            <step.icon className="w-5 h-5" />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-shivkara-orange group-hover:translate-x-1 transition-all" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed font-light flex-1">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
