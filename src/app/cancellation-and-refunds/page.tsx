"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    RefreshCcw,
    AlertCircle,
    Clock,
    FileText,
    CheckCircle2,
    Mail,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CancellationAndRefunds() {
    const sections = [
        {
            title: "Cancellation Policy",
            icon: AlertCircle,
            content: [
                "You may cancel your enrollment in any bootcamp or course within 24 hours of purchase for a full refund, no questions asked.",
                "To cancel, you must submit a request via our official support email or through your student dashboard.",
                "Cancellations made after the 24-hour window but before the course start date may be eligible for a 50% refund or credit towards future courses, subject to review."
            ]
        },
        {
            title: "Refund Eligibility",
            icon: RefreshCcw,
            content: [
                "Refunds are processed within 7-10 business days after the cancellation request is approved.",
                "If you are removed from a bootcamp due to a violation of our code of conduct, you will not be eligible for a refund.",
                "In the event that Shivkara cancels a course, you will receive a 100% refund including any registration fees."
            ]
        },
        {
            title: "Digital Products",
            icon: FileText,
            content: [
                "Due to the nature of digital goods, downloadable resources, templates, and pre-recorded workshops are non-refundable once accessed or downloaded.",
                "If you experience technical issues accessing the content, our support team will assist you in resolving them immediately."
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-shivkara-orange/30">
            <Navbar />

            {/* Decorative Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-shivkara-blue/10 to-transparent" />
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-shivkara-orange/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-6 backdrop-blur-md">
                            <ShieldCheck size={14} className="text-shivkara-orange" />
                            <span>TRANSPARENCY & TRUST</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                            Cancellation & <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Refund Policy</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            We believe in fair and transparent policies. Here is everything you need to know about cancellations, refunds, and your rights as a student.
                        </p>
                    </motion.div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group"
                        >
                            <div className="h-full bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <section.icon size={24} className="text-shivkara-orange" />
                                </div>

                                <h3 className="text-xl font-bold mb-4 group-hover:text-shivkara-orange transition-colors">{section.title}</h3>

                                <ul className="space-y-4">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0 group-hover:bg-shivkara-orange transition-colors" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Improved FAQ / Info Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 p-8 md:p-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-shivkara-orange/50 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need help with a refund?</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                If you have specific questions about your eligibility or need to submit a request, our support team is ready to assist you. Please have your order ID ready.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                    <Mail size={18} />
                                    Contact Support
                                </Link>
                                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold">
                                    Go to Dashboard
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Clock size={20} className="text-emerald-400 mb-3" />
                                <h4 className="font-bold text-sm mb-1">7-10 Days</h4>
                                <p className="text-xs text-gray-500">Average processing time for refunds.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <CheckCircle2 size={20} className="text-blue-400 mb-3" />
                                <h4 className="font-bold text-sm mb-1">Bank Verified</h4>
                                <p className="text-xs text-gray-500">Secure transactions directly to your source.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </main>
            <Footer />
        </div>
    );
}
