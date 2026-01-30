"use client";

import { motion } from "framer-motion";

const steps = [
    {
        day: "Day 1",
        title: "Kickoff Meeting",
        description: "We meet your team, align on goals, and define success metrics. Access to Slack/Jira is set up."
    },
    {
        day: "Day 3",
        title: "Deep Discovery",
        description: "Our tech leads dive into your existing codebase or requirements. We create a detailed architecture plan."
    },
    {
        day: "Day 7",
        title: "Sprint Zero",
        description: "Backlog is groomed, tasks are prioritized, and the first development sprint is officially planned."
    },
    {
        day: "Day 14",
        title: "First Deployment",
        description: "A staging environment is live. You see the first pieces of working software and provide feedback."
    }
];

export default function OnboardingRoadmap() {
    return (
        <section className="py-32 bg-black border-b border-white/5 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-24">
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// The First 2 Weeks</span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">
                        Your <span className="text-gray-600">Onboarding</span>
                    </h2>
                </div>

                <div className="relative pl-0 md:pl-0">
                    {/* Connecting Line - Horizontal Desktop */}
                    <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[2px] bg-white/10" />

                    {/* Connecting Line - Vertical Mobile */}
                    <div className="block lg:hidden absolute top-0 left-4 h-full w-[2px] bg-white/10" />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group pl-12 lg:pl-0"
                            >
                                {/* Dot on line - Desktop */}
                                <div className="hidden lg:block absolute top-[52px] left-8 w-4 h-4 rounded-full bg-black border-[3px] border-white group-hover:border-shivkara-orange transition-colors z-20" />

                                {/* Dot on line - Mobile */}
                                <div className="block lg:hidden absolute top-8 left-[11px] w-3 h-3 rounded-full bg-black border-[2px] border-white group-hover:border-shivkara-orange transition-colors z-20" />

                                <div className="text-3xl md:text-5xl font-black text-white/5 mb-4 md:mb-6">{step.day}</div>

                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all min-h-[auto] md:min-h-[220px]">
                                    <h3 className="text-xl font-bold text-white mb-3 md:mb-4">{step.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-light">
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
