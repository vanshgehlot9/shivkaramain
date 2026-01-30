"use client";

import { motion } from "framer-motion";
import { Landmark, HeartPulse, ShoppingBag, Truck, GraduationCap, Building2 } from "lucide-react";

const industries = [
    {
        name: "FinTech",
        description: "Secure payment gateways, blockchain solutions, and banking infrastructure.",
        icon: Landmark
    },
    {
        name: "HealthTech",
        description: "HIPAA-compliant telemedicine platforms and patient management systems.",
        icon: HeartPulse
    },
    {
        name: "E-Commerce",
        description: "High-conversion storefronts, headless commerce, and inventory systems.",
        icon: ShoppingBag
    },
    {
        name: "Logistics",
        description: "Real-time fleet tracking, supply chain optimization, and route planning.",
        icon: Truck
    },
    {
        name: "EdTech",
        description: "Interactive learning management systems (LMS) and virtual classrooms.",
        icon: GraduationCap
    },
    {
        name: "Real Estate",
        description: "Property listings, virtual tours, and CRM integration for agencies.",
        icon: Building2
    }
];

export default function Industries() {
    return (
        <section className="py-24 bg-[#050505] border-y border-white/5 relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Sectors</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">
                            Industries <span className="text-gray-600">We Serve</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-md text-sm font-light leading-relaxed">
                        Deep domain expertise across key sectors allows us to build solutions that not only function perfectly but solve specific industry challenges.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 rounded-2xl"
                        >
                            <div className="w-12 h-12 rounded-lg bg-shivkara-orange/10 flex items-center justify-center text-shivkara-orange mb-6 group-hover:scale-110 transition-transform">
                                <industry.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-shivkara-orange transition-colors">
                                {industry.name}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {industry.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
