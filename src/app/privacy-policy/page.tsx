"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Shield,
    Lock,
    Eye,
    Database,
    Globe,
    Server,
    FileText,
    CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPolicy() {
    const sections = [
        {
            title: "Information Collection",
            icon: Database,
            content: [
                "We collect personal information that you voluntarily provide to us when you register for the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.",
                "The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use.",
                "We may collect the following: Name, phone number, email address, mailing address, usernames, passwords, contact preferences, and similar security information."
            ]
        },
        {
            title: "How We Use Data",
            icon: Server,
            content: [
                "To provide and facilitate delivery of services to the user.",
                "To send administrative information to you regarding your account, product updates, or policy changes.",
                "To fulfill and manage your orders. We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.",
                "To protect our Services. We may use your information as part of our efforts to keep our Services safe and secure (e.g., for fraud monitoring and prevention)."
            ]
        },
        {
            title: "Data Sharing",
            icon: Globe,
            content: [
                "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.",
                "We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, or Legal Obligations.",
                "We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work."
            ]
        },
        {
            title: "Security Measures",
            icon: Lock,
            content: [
                "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.",
                "However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk.",
                "You should only access the Services within a secure environment."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-shivkara-orange/30">
            <Navbar />

            {/* Decorative Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-transparent" />
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-shivkara-orange/5 rounded-full blur-[120px] animate-pulse-slow" />
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
                            <Shield size={14} className="text-shivkara-orange" />
                            <span>LATEST UPDATE: JAN 2026</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Policy</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Your privacy is critically important to us. This policy clearly outlines how we collect, use, and protect your personal data in compliance with global standards.
                        </p>
                    </motion.div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none opacity-50" />

                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <div className="h-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-20 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />

                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-105 transition-transform text-blue-400">
                                    <section.icon size={28} />
                                </div>

                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    {section.title}
                                    <div className="h-px flex-1 bg-white/5" />
                                </h3>

                                <ul className="space-y-4">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 md:p-12 text-center"
                >
                    <h2 className="text-2xl font-bold mb-4">Questions about your data?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        If you have any questions or concerns about this privacy policy or our practices with regards to your personal information, please contact us.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/contact" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                            Contact Privacy Team
                        </Link>
                        <Link href="/terms-and-conditions" className="px-8 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-semibold">
                            View Terms
                        </Link>
                    </div>
                </motion.div>

            </main>
            <Footer />
        </div>
    );
}
