"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Scale,
    FileText,
    AlertCircle,
    Copyright,
    Users,
    Ban,
    Globe2,
    ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
    const termsSections = [
        {
            title: "Agreement to Terms",
            icon: Scale,
            content: "By accessing and using the Shivkara Digital platform, you agree to be legally bound by these Terms and Conditions. If you do not agree to any of these terms, you are prohibited from using or accessing this site."
        },
        {
            title: "Intellectual Property",
            icon: Copyright,
            content: "All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Shivkara Digital or its content suppliers and protected by international copyright laws."
        },
        {
            title: "User Representatives",
            icon: Users,
            content: "By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information."
        },
        {
            title: "Prohibited Activities",
            icon: Ban,
            content: "You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us."
        },
        {
            title: "Limitation of Liability",
            icon: AlertCircle,
            content: "In no event shall Shivkara Digital, nor any of its officers, directors, and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise."
        },
        {
            title: "Governing Law",
            icon: Globe2,
            content: "These Terms shall be governed by and defined following the laws of India. Shivkara Digital and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms."
        }
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-orange-500/30">
            <Navbar />

            <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-mono text-orange-400 mb-6 backdrop-blur-md">
                            <FileText size={14} />
                            <span>LEGAL AGREEMENT</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Conditions</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Please read these terms carefully before using our services. They outline your rights, obligations, and the rules of engagement for using the Shivkara platform.
                        </p>
                    </motion.div>
                </div>

                {/* Terms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {termsSections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="h-full bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-orange-500/30 transition-all duration-300 group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                                        <section.icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-orange-400 transition-colors">{section.title}</h3>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed text-justify">
                                    {section.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Final Statement */}
                <div className="border-t border-white/10 pt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Effective Date</p>
                            <p className="font-mono text-white">January 1, 2026</p>
                        </div>

                        <div className="flex items-center gap-8">
                            <p className="text-sm text-gray-500 max-w-md hidden md:block text-right">
                                We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.
                            </p>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                Accept & Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
