"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; // Although not strictly used for nav, good to have
import Navbar from "@/components/Navbar"; // Assuming this path from current structure
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, Award, Users, CheckCircle, Info } from "lucide-react";

export default function Spunk2025Content() {
    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <Navbar />

            {/* 1. Hero Section (Above the Fold) */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Primary Visual */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bootcamp/bootcampheader.jpeg"
                        alt="SPUNK 2025 Bootcamp Header"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    {/* Clean Overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        {/* Meta Highlights */}
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium tracking-wide uppercase text-gray-300">
                            <span className="px-3 py-1 border border-white/20 rounded-full bg-black/20 backdrop-blur-md">Year: 2025</span>
                            <span className="px-3 py-1 border border-white/20 rounded-full bg-black/20 backdrop-blur-md">Category: Product Design</span>
                            <span className="px-3 py-1 border border-white/20 rounded-full bg-black/20 backdrop-blur-md">Format: Bootcamp</span>
                            <span className="px-3 py-1 border border-white/20 rounded-full bg-black/20 backdrop-blur-md">By: Shivkara Digital & Tech Lab</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-4">
                            SPUNK <span className="text-shivkara-orange">2025</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light">
                            Product Design Bootcamp
                        </p>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            A focused product design bootcamp organized by Shivkara Digital & Tech Lab in 2025.
                        </p>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
                </motion.div>
            </section>

            {/* 2. About the Bootcamp */}
            <section className="py-24 max-w-4xl mx-auto px-6">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-white border-l-4 border-shivkara-orange pl-4">About SPUNK 2025</h2>
                        <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                            <p>
                                SPUNK 2025 was a product design bootcamp organized by Shivkara Digital & Tech Lab with the objective of introducing participants to modern product design thinking, workflows, and industry-aligned practices. The bootcamp focused on structured learning sessions guided by experienced trainers and mentors, creating an environment for practical exposure and design-oriented problem solving.
                            </p>
                            <p>
                                This initiative reflects Shivkara Digital & Tech Lab’s commitment to building practical design talent and contributing to the growing product design ecosystem.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Focus Area */}
            <section className="py-24 bg-zinc-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-16 items-center"
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-8 text-white">Bootcamp Focus</h2>
                            <ul className="space-y-4">
                                {[
                                    "Product design fundamentals",
                                    "User experience and interface thinking",
                                    "Design workflows and processes",
                                    "Real-world product design exposure"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                                        <CheckCircle className="w-6 h-6 text-shivkara-orange shrink-0 mt-0.5" />
                                        <span className="text-lg text-gray-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-black/40 p-10 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-shivkara-orange/5 blur-3xl rounded-full pointer-events-none"></div>
                            <div className="relative z-10">
                                <p className="text-2xl font-light text-gray-400 italic">
                                    "Designed to bridge the gap between academic theory and the practical realities of building digital products."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4. Bootcamp Snapshot (Highlight Strip) */}
            <section className="py-12 border-y border-white/10 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-2 text-center md:text-left">
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Bootcamp Name</p>
                            <p className="text-xl font-bold text-white">SPUNK 2025</p>
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Year Conducted</p>
                            <p className="text-xl font-bold text-white">2025</p>
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Category</p>
                            <p className="text-xl font-bold text-white">Product Design</p>
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Type</p>
                            <p className="text-xl font-bold text-white">Training Program</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Organizers & Team */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center">Organizing Team</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {[
                        { name: "Sawai Singh", role: "Founder" },
                        { name: "Ashutosh Singh", role: "Training Incharge" },
                        { name: "Mohit", role: "Mentor" }
                    ].map((person, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-shivkara-orange/30 transition-colors"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-gray-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{person.name}</h3>
                            <p className="text-shivkara-orange text-sm font-medium uppercase tracking-wide">{person.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. Certification Note (Important) */}
            <section className="py-16 bg-zinc-900/20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-black border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
                        <div className="shrink-0 p-4 bg-shivkara-orange/10 rounded-full text-shivkara-orange">
                            <Award className="w-8 h-8" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">Participation Certificates</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Participants who attended SPUNK 2025 were issued <strong className="text-white">Certificates of Participation</strong> by Shivkara Digital & Tech Lab. These certificates confirm attendance at the bootcamp and do not imply certification, assessment, or skill validation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Visual Gallery Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center">Bootcamp Highlights</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        "/bootcamp/IMG_9702.jpg",
                        "/bootcamp/IMG_9703.jpg",
                        "/bootcamp/IMG_9704.jpg"
                    ].map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative aspect-video rounded-xl overflow-hidden group grayscale hover:grayscale-0 transition-all duration-500"
                        >
                            <Image
                                src={src}
                                alt={`SPUNK 2025 Highlight ${idx + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                unoptimized // Using external URLs without config
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 8. Brand Authority Footer CTA */}
            <section className="py-24 bg-gradient-to-t from-zinc-900 to-black text-center">
                <div className="max-w-3xl mx-auto px-6 space-y-8">
                    <h2 className="text-3xl font-bold text-white">Forging Future Talent</h2>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Shivkara Digital & Tech Lab regularly organizes training programs, bootcamps, and hands-on learning initiatives focused on real-world digital and product skills.
                    </p>
                    <div className="flex justify-center pt-4">
                        <Link href="/lets-talk" className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                            Join Our Next Initiative
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
