"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Users, Globe2, Clock, Trophy } from "lucide-react";

const features = [
    {
        title: "Global Standards",
        description: "We adhere to international coding standards and best practices, ensuring your software is robust and maintainable.",
        icon: Globe2
    },
    {
        title: "Rapid Delivery",
        description: "Our agile workflow and pre-built component libraries allow us to ship products 2x faster than the competition.",
        icon: Zap
    },
    {
        title: "24/7 Support",
        description: "Our dedicated support team is always available to ensure your critical systems never face downtime.",
        icon: Clock
    },
    {
        title: "Client-Centric",
        description: "We view ourselves as partners, not vendors. Your business goals become our north star.",
        icon: Users
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade security protocols are baked into every layer of our application architecture.",
        icon: ShieldCheck
    },
    {
        title: "Award Winning",
        description: "Recognized by industry leaders for excellence in design, innovation, and technical execution.",
        icon: Trophy
    }
];

export default function WhyUs() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// The Advantage</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter">
                        Why <span className="text-gray-600">Choose Us</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-10 rounded-[2rem] bg-[#0A0A0A] border border-white/10 hover:border-shivkara-orange/30 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                                <feature.icon className="w-32 h-32 text-white" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:bg-shivkara-orange group-hover:text-black transition-colors duration-300">
                                    <feature.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
