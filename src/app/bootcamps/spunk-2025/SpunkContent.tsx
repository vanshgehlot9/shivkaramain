"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Award, Users, CheckCircle, ArrowRight, Zap, Trophy, ShieldCheck, Target } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

export default function Spunk2025Content() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <main ref={containerRef} className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black overflow-hidden perspective-1000">
            <Navbar />

            {/* Global Background Grid */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-[0.15] z-0" />

            {/* 1. Hero Section - Parallax & Tech Aesthetic */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 500]), opacity: useTransform(scrollYProgress, [0, 0.5], [0.6, 0]) }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src="/bootcamp/bootcampheader.jpeg"
                            alt="SPUNK 2025 Bootcamp Header"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
                    </motion.div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <div className="flex flex-col items-start">
                        {/* Tech Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="px-4 py-1.5 rounded-full border border-shivkara-orange/30 bg-shivkara-orange/10 backdrop-blur-md flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shivkara-orange opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-shivkara-orange"></span>
                                </span>
                                <span className="text-shivkara-orange font-mono text-xs uppercase tracking-widest font-bold">Event Concluded • 2025</span>
                            </div>
                        </motion.div>

                        {/* Massive Typography */}
                        <motion.h1
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.9]"
                        >
                            Spunk <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-yellow-500">2025</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="max-w-2xl"
                        >
                            <p className="text-xl md:text-2xl text-gray-300 font-light mb-8 border-l-2 border-white/20 pl-6">
                                An intensive <span className="text-white font-semibold">Product Design Bootcamp</span> engineered to bridge the gap between academic theory and industry reality.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                {[
                                    { label: "Format", value: "Bootcamp" },
                                    { label: "Focus", value: "UI/UX" },
                                    { label: "Duration", value: "Intensive" },
                                    { label: "Status", value: "Completed" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">{stat.label}</span>
                                        <span className="text-white font-bold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Stats Grid - Bento Style */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Description Card */}
                        <div className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-shivkara-orange/5 blur-3xl rounded-full pointer-events-none group-hover:bg-shivkara-orange/10 transition-colors duration-500" />
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <Zap className="text-shivkara-orange" /> The Mission
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Use-case driven learning. SPUNK 2025 wasn't just about theory; it was about <span className="text-white">execution</span>. Participants dove deep into modern design workflows, prototyping, and the psychology behind user interfaces. We stripped away the fluff and focused on what actually matters in shipping digital products.
                            </p>
                        </div>

                        {/* Stat Card */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
                            <span className="text-4xl font-black text-white mb-2">100%</span>
                            <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Practical Exposure</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Focus Areas - Interactive List */}
            <section className="py-24 bg-zinc-900/30 border-y border-white/5 relative">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-16">
                        <div className="md:w-1/3">
                            <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Curriculum</span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter mb-6">
                                Core <span className="text-gray-600">Modules</span>
                            </h2>
                            <p className="text-gray-400">
                                A breakdown of the key areas covered during the intensive training period.
                            </p>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Design Systems", desc: "Building scalable component libraries.", icon: Target },
                                { title: "User Research", desc: "Understanding the 'Why' before the 'How'.", icon: Users },
                                { title: "Prototyping", desc: "High-fidelity interactions in Figma.", icon: Zap },
                                { title: "Handout", desc: "Preparing designs for development.", icon: CheckCircle }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-2xl bg-black border border-white/10 hover:border-shivkara-orange/50 px-8 transition-colors group cursor-default"
                                >
                                    <item.icon className="w-8 h-8 text-gray-500 group-hover:text-shivkara-orange mb-4 transition-colors" />
                                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Team Section - Hex/Tech style */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Orchestrated By</h2>
                    <div className="w-20 h-1 bg-shivkara-orange mx-auto rounded-full" />
                </div>

                <div className="flex flex-wrap justify-center gap-10">
                    {[
                        { name: "Sawai Singh", role: "Founder", color: "from-blue-500 to-cyan-500" },
                        { name: "Ashutosh Singh", role: "Training Lead", color: "from-purple-500 to-pink-500" },
                        { name: "Mohit", role: "Mentor", color: "from-orange-500 to-red-500" }
                    ].map((person, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl w-full md:w-[300px] text-center group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${person.color}`} />
                            <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20 group-hover:text-white transition-colors">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{person.name}</h3>
                            <p className="text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-shivkara-orange transition-colors">{person.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 5. Gallery - Parallax or Scroll */}
            <section className="py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
                    <h2 className="text-4xl font-bold text-white">Event Highlights</h2>
                    <div className="hidden md:block w-1/3 h-[1px] bg-white/10" />
                </div>

                <div className="w-full overflow-x-auto pb-12 scrollbar-hide">
                    <div className="flex gap-6 px-6 w-max">
                        {[
                            "/bootcamp/IMG_9702.jpg",
                            "/bootcamp/IMG_9703.jpg",
                            "/bootcamp/IMG_9704.jpg",
                            "/bootcamp/bootcampheader.jpeg"
                        ].map((src, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative w-[80vw] md:w-[500px] h-[300px] md:h-[350px] rounded-2xl overflow-hidden shrink-0 border border-white/10 group bg-zinc-900"
                            >
                                <Image
                                    src={src}
                                    alt="Gallery Image"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-60 transition-opacity" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="text-xl font-bold text-white">SPUNK 2025</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Certification & Disclaimer */}
            <section className="py-24 max-w-5xl mx-auto px-6">
                <div className="rounded-3xl bg-gradient-to-br from-[#111] to-black border border-white/10 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-40 bg-shivkara-orange/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <ShieldCheck className="w-8 h-8 text-shivkara-orange" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Certification of Participation</h3>
                            <p className="text-gray-400 leading-relaxed mb-6 font-light">
                                All attendees received a verified <strong className="text-white">Certificate of Participation</strong> from Shivkara Digital & Tech Lab.
                                Note: This acknowledges attendance and exposure to the curriculum, distinct from a skill-competency certification.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 text-center bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,0,0.1),transparent_70%)] pointer-events-none" />
                <div className="relative z-10 max-w-2xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase">
                        Ready for the <br /> <span className="text-shivkara-orange">Next Level?</span>
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        We regularly host specialized training events. Don't miss the next one.
                    </p>

                    <div className="flex justify-center">
                        <MagneticButton className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 group">
                            <Link href="/contact">
                                CONTACT US <ArrowRight className="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </MagneticButton>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
