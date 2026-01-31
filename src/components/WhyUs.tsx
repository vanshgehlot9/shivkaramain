"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Users, Globe2, Clock, Trophy, ChevronRight } from "lucide-react";

const features = [
    {
        title: "Global Standards",
        description: "ISO-compliant coding practices ensuring robust, maintainable scale.",
        icon: Globe2,
        colSpan: "md:col-span-1"
    },
    {
        title: "Rapid Delivery",
        description: "Agile workflows meet pre-built component libraries. We ship 2x faster.",
        icon: Zap,
        colSpan: "md:col-span-2"
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade encryption baked into every layer.",
        icon: ShieldCheck,
        colSpan: "md:col-span-2"
    },
    {
        title: "24/7 Support",
        description: "Always-on infrastructure monitoring.",
        icon: Clock,
        colSpan: "md:col-span-1"
    },
    {
        title: "Client-Centric",
        description: "Your business goals become our north star.",
        icon: Users,
        colSpan: "md:col-span-1"
    },
    {
        title: "Award Winning",
        description: "Recognized for design & technical excellence.",
        icon: Trophy,
        colSpan: "md:col-span-2"
    }
];

export default function WhyUs() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Radar Background Effect */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-8 bg-shivkara-orange/50" />
                            <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase">/// The Advantage</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-[0.9]">
                            Why We <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">Lead the Pack</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-sm text-lg font-light leading-relaxed mb-4"
                    >
                        In a crowded market, we stand out by obsessing over the details that matter: Speed, Security, and Scalability.
                    </motion.p>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`${feature.colSpan} group relative h-full`}
                        >
                            <div className="h-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:border-shivkara-orange/50 hover:shadow-2xl relative overflow-hidden">
                                {/* Hover Fill Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-2xl bg-white/5 text-white group-hover:text-black group-hover:bg-shivkara-orange transition-all duration-300">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300" />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-shivkara-orange transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed font-light text-sm group-hover:text-gray-300 transition-colors">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Slider */}
                <div className="md:hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] -mx-6">
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
                        {[...features, ...features].map((feature, index) => (
                            <div
                                key={`mobile-feature-${index}`}
                                className="w-[280px] h-[320px] bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-white/5 text-white">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed font-light text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
