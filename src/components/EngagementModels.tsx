"use client";

import { motion } from "framer-motion";
import { Users, Clock, Target } from "lucide-react";

const models = [
    {
        title: "Dedicated Team",
        description: "An extension of your in-house team. We provide a full squad of developers, designers, and PMs dedicated 100% to your project.",
        icon: Users,
        features: ["Full Control", "Scalable Resources", "Long-term Partnership"]
    },
    {
        title: "Fixed Price",
        description: "Perfect for well-defined scope. We deliver the project within a set budget and timeline, managing all the risk.",
        icon: Target,
        features: ["Defined Budget", "Guaranteed Delivery", "Clear Milestones"]
    },
    {
        title: "Time & Material",
        description: "Flexible engagement for evolving projects. Pay only for the hours worked, allowing for dynamic requirement changes.",
        icon: Clock,
        features: ["Maximum Flexibility", "Iterative Development", "Real-time Tracking"]
    }
];

export default function EngagementModels() {
    return (
        <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Partnership</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">
                        Engagement <span className="text-gray-600">Models</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {models.map((model, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-shivkara-orange/30 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:text-shivkara-orange transition-all">
                                <model.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4">{model.title}</h3>
                            <p className="text-gray-400 leading-relaxed mb-8 font-light min-h-[80px]">
                                {model.description}
                            </p>

                            <ul className="space-y-3">
                                {model.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                                        <div className="w-1.5 h-1.5 rounded-full bg-shivkara-orange" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
