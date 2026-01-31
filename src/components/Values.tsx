"use client";

import { motion } from "framer-motion";
import { Lightbulb, Scale, Trophy, Users2, Sparkles } from "lucide-react";

const values = [
    {
        title: "Radical Transparency",
        description: "No hidden costs, no jargon. We believe in clear, honest communication at every project milestone.",
        icon: Scale,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        title: "Relentless Innovation",
        description: "We don't just follow trends; we set them. Constantly exploring new technologies to give you an edge.",
        icon: Lightbulb,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Client Obsession",
        description: "Your success is our success. We go above and beyond to ensure your product exceeds all expectations.",
        icon: Users2,
        gradient: "from-shivkara-orange to-red-500"
    },
    {
        title: "Excellence Always",
        description: "Good enough is never enough. We strive for pixel-perfect design and bulletproof, scalable code.",
        icon: Trophy,
        gradient: "from-amber-500 to-yellow-500"
    }
];

export default function Values() {
    return (
        <section className="py-32 bg-[#030303] border-t border-white/5 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-shivkara-orange/5 rounded-full blur-[150px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
                    <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-shivkara-orange" />
                            <span className="text-shivkara-orange font-mono text-xs tracking-[0.3em] uppercase">/// Our DNA</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none"
                        >
                            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Principles</span>
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:w-1/2"
                    >
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            We are driven by a set of unshakeable beliefs that define who we are and how we work. These aren't just words; they are the foundation of every project we undertake.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 overflow-hidden"
                        >
                            {/* Gradient Line on Top */}
                            <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Glow Effect */}
                            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-500`} />

                            <div className="flex gap-6 relative z-10">
                                <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} bg-opacity-10 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed font-light">{value.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
