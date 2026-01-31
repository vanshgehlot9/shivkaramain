"use client";

import { motion } from "framer-motion";
import { BookOpen, Cpu, Cloud, Server, Globe, Smartphone } from "lucide-react";

const terms = [
    {
        term: "Microservices",
        definition: "An architectural style where an application is arranged as a collection of loosely coupled, independently deployable services.",
        icon: Server
    },
    {
        term: "CI/CD",
        definition: "Continuous Integration and Continuous Deployment. A method to frequently deliver apps to customers by automating stages of development.",
        icon: Cloud
    },
    {
        term: "API First",
        definition: "A strategy where the API is treated as a first-class citizen, designed before the implementation of the application.",
        icon: Globe
    },
    {
        term: "Serverless",
        definition: "A cloud computing execution model where the cloud provider runs the server, and dynamically manages the allocation of machine resources.",
        icon: Cloud
    },
    {
        term: "Headless CMS",
        definition: "A back-end only content management system that acts primarily as a content repository, delivering content via APIs.",
        icon: Cpu
    },
    {
        term: "PWA",
        definition: "Progressive Web Apps. Web applications that use modern web capabilities to deliver an app-like experience to users on any device.",
        icon: Smartphone
    }
];

export default function TechGlossary() {
    return (
        <section className="py-32 bg-[#030303] border-t border-white/5 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen className="w-4 h-4 text-shivkara-orange" />
                            <span className="text-shivkara-orange font-mono text-xs tracking-[0.3em] uppercase">/// Learn</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                            Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Decoded</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-md text-right font-light"
                    >
                        Understanding the terminology behind modern digital engineering.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {terms.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 overflow-hidden"
                        >
                            {/* Hover Glow */}
                            <div className="absolute -top-16 -right-16 w-32 h-32 bg-shivkara-orange/10 opacity-0 group-hover:opacity-100 blur-3xl rounded-full transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-red-400">
                                        {item.term}
                                    </h3>
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-shivkara-orange group-hover:border-shivkara-orange/20 transition-all">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">
                                    {item.definition}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
