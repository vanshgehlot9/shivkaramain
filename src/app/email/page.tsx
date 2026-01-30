"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function EmailPage() {
    const [copied, setCopied] = useState(false);
    const email = "info@shivkaradigital.com";

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black flex flex-col">
            <Navbar />

            <section className="flex-grow flex items-center justify-center relative overflow-hidden px-6">
                {/* Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-shivkara-orange/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-12">
                            <Mail className="w-10 h-10 text-shivkara-orange" />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tight">
                            Drop us a line
                        </h1>
                        <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto">
                            Whether you have a project in mind or just want to say hello, our inbox is always open.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            {/* Email Display & Copy */}
                            <div className="group relative flex items-center gap-4 bg-[#0A0A0A] border border-white/10 rounded-2xl px-8 py-6 hover:border-shivkara-orange/50 transition-all duration-300">
                                <span className="text-2xl md:text-4xl font-mono font-bold text-white tracking-tight">
                                    {email}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative"
                                    title="Copy to clipboard"
                                >
                                    {copied ? (
                                        <Check className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <Copy className="w-6 h-6" />
                                    )}
                                </button>
                            </div>

                            {/* Open Mail App */}
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center gap-3 bg-white text-black px-8 py-6 rounded-2xl font-bold text-lg uppercase tracking-wider hover:bg-shivkara-orange transition-colors duration-300"
                            >
                                <span>Open Mail App</span>
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
