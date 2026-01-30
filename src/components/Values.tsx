"use client";

import { motion } from "framer-motion";
import { Lightbulb, Scale, Trophy, Users2 } from "lucide-react";

const values = [
    {
        title: "Radical Transparency",
        description: "No hidden costs, no jargon. We believe in clear, honest communication at every step of the journey.",
        icon: Scale
    },
    {
        title: "Relentless Innovation",
        description: "We don't just follow trends; we set them. We constantly explore new technologies to give you an edge.",
        icon: Lightbulb
    },
    {
        title: "Client Obsession",
        description: "Your success is our success. We go above and beyond to ensure your product exceeds expectations.",
        icon: Users2
    },
    {
        title: "Excellence Always",
        description: "Good enough is never enough. We strive for pixel-perfect design and bulletproof code.",
        icon: Trophy
    }
];

export default function Values() {
    return (
        <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-10">
                    <div className="md:w-1/2">
                        <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Our DNA</span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                            Core <span className="text-gray-600">Principles</span>
                        </h2>
                    </div>
                    <div className="md:w-1/2">
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            We are driven by a set of unshakeable beliefs that define who we are and how we work. These aren't just words; they are the foundation of every project we undertake.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-6 p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="shrink-0 w-12 h-12 rounded-full bg-shivkara-orange/10 flex items-center justify-center text-shivkara-orange">
                                <value.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-light">{value.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
