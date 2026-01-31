"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, Palette, Brain, BarChart, Smartphone, Megaphone, Clock, Lock } from "lucide-react";

export default function CareersContent() {
    const courses = [
        { title: "UI/UX Design", icon: Palette, desc: "Master design systems and user research." },
        { title: "Generative AI", icon: Brain, desc: "Build the future with LLMs and diffusion models." },
        { title: "Digital Marketing", icon: Megaphone, desc: "Data-driven strategies for growth." },
        { title: "Power BI", icon: BarChart, desc: "Transform raw data into actionable insights." },
        { title: "Android Dev", icon: Smartphone, desc: "Create native mobile experiences." },
    ];

    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-shivkara-orange font-mono text-sm tracking-widest uppercase mb-4 block"
                    >
                        /// Future Ready
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8"
                    >
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-yellow-500">Revolution</span>
                    </motion.h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        We don't just offer jobs; we offer a launchpad for your career. Learn, build, and ship with the best minds in the industry.
                    </p>
                </div>
            </section>

            {/* Summer Internship Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-shivkara-orange/10 blur-[120px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-shivkara-orange/10 border border-shivkara-orange/30 rounded-full text-shivkara-orange text-xs font-bold uppercase tracking-wider mb-4">
                                        <Clock className="w-3 h-3" /> Coming Soon
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                                        Summer Internship <br /> & Training '26
                                    </h2>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-2xl font-bold text-white flex items-center justify-end gap-3">
                                        <Calendar className="w-6 h-6 text-shivkara-orange" />
                                        1 May - 30 July
                                    </div>
                                    <p className="text-gray-500 text-sm font-mono mt-1">Duration: 3 Months</p>
                                </div>
                            </div>

                            {/* Mobile Date Display */}
                            <div className="flex items-center gap-3 md:hidden mb-8 text-white font-bold text-xl">
                                <Calendar className="w-5 h-5 text-shivkara-orange" />
                                1 May - 30 July
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {courses.map((course, idx) => (
                                    <div key={idx} className="bg-black/40 border border-white/5 p-6 rounded-2xl hover:border-shivkara-orange/30 transition-colors group">
                                        <course.icon className="w-10 h-10 text-gray-500 group-hover:text-shivkara-orange mb-4 transition-colors" />
                                        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                                        <p className="text-sm text-gray-400">{course.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 rounded-2xl p-6 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 font-mono uppercase tracking-wider">Program Fee</p>
                                        <p className="text-xl font-bold text-white">Revealing Soon</p>
                                    </div>
                                </div>
                                <button disabled className="px-8 py-3 bg-white/10 text-gray-400 font-bold rounded-full cursor-not-allowed border border-white/5 w-full md:w-auto">
                                    Enrollment Opens Shortly
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
