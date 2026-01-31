"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Copy, Check, ExternalLink, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/admin/TiltCard";

export default function EmailPage() {
    const [copied, setCopied] = useState(false);
    const email = "info@shivkaradigital.com";

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans selection:bg-purple-500/30 flex flex-col">
            <Navbar />

            <section className="flex-grow flex items-center justify-center relative overflow-hidden py-32 px-6">
                {/* Background Ambience */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-8 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>INBOX OPEN 24/7</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-8 tracking-tighter">
                            Drop Us A <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Line</span>
                        </h1>
                        <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
                            Whether you have a breakthrough idea or just want to say hello, we are ready to listen.
                        </p>

                        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-3xl mx-auto">

                            {/* Copy Card */}
                            <motion.div
                                className="flex-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <TiltCard>
                                    <div className="h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-1 group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="bg-[#0a0a0a] rounded-[22px] px-8 py-8 h-full flex flex-col items-center justify-center gap-4 relative z-10">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Official Email</p>
                                            <h3 className="text-xl md:text-2xl font-mono font-bold text-white tracking-tight break-all">
                                                {email}
                                            </h3>
                                            <button
                                                onClick={handleCopy}
                                                className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-sm font-bold text-gray-300 group-hover:text-white"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-emerald-400">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span>Copy Address</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>

                            {/* Action Button */}
                            <motion.a
                                href={`mailto:${email}`}
                                className="flex-1 group relative min-h-[160px] flex md:block" // Ensure height match
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl opacity-80 blur-xl group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full bg-white text-black rounded-3xl p-8 flex flex-col items-center justify-center gap-4 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 bg-gray-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50" />

                                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <ExternalLink className="w-6 h-6 text-black" />
                                    </div>
                                    <span className="text-xl font-black uppercase tracking-wide">Open Mail App</span>
                                    <div className="flex items-center gap-2 text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span>LAUNCH CLIENT</span>
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </motion.a>

                        </div>

                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
