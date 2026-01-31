"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, Users, ShieldCheck } from "lucide-react";

const metrics = [
    {
        value: "₹2Cr+",
        label: "Revenue Impact",
        description: "Generated for clients through custom solutions.",
        icon: TrendingUp
    },
    {
        value: "99.9%",
        label: "System Uptime",
        description: "Resilient architectures that never sleep.",
        icon: ShieldCheck
    },
    {
        value: "200%",
        label: "Avg. ROI",
        description: "Return on investment within first year.",
        icon: Activity
    },
    {
        value: "50k+",
        label: "Active Users",
        description: "Supporting massive scale daily.",
        icon: Users
    }
];

export default function Results() {
    return (
        <section className="py-24 bg-black relative overflow-hidden border-t border-white/5">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-shivkara-orange/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shivkara-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-shivkara-orange"></span>
                            </span>
                            <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase">/// Impact</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none mb-6">
                            Driving Real <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-yellow-500">Business Value</span>
                        </h2>

                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            We don't just write code; we engineer outcomes. Our solutions are designed to deliver measurable results from day one.
                        </p>
                    </motion.div>
                </div>

                {/* Desktop View (Grid) */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 overflow-hidden hover:border-shivkara-orange/30 transition-colors duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 text-center">
                                <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-shivkara-orange group-hover:scale-110 transition-all duration-300 border border-white/5">
                                    <metric.icon className="w-6 h-6" />
                                </div>

                                <div className="text-5xl font-black mb-2 tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                                    {metric.value}
                                </div>
                                <h3 className="text-sm font-bold text-shivkara-orange uppercase tracking-widest mb-3">{metric.label}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {metric.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View (Slider) */}
                <div className="md:hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    >
                        {[...metrics, ...metrics].map((metric, index) => (
                            <div
                                key={`mobile-metric-${index}`}
                                className="w-[280px] p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 flex flex-col items-center text-center justify-center relative overflow-hidden"
                            >
                                <div className="w-12 h-12 mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-shivkara-orange border border-white/5">
                                    <metric.icon className="w-6 h-6" />
                                </div>
                                <div className="text-4xl font-black mb-2 tracking-tighter text-white">
                                    {metric.value}
                                </div>
                                <h3 className="text-xs font-bold text-shivkara-orange uppercase tracking-widest mb-3">{metric.label}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    {metric.description}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
