"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Cookie,
    Shield,
    Settings,
    Globe,
    Lock,
    X,
    Check,
    Save
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link"; // Added Link

export default function CookiesPolicy() {
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // Always true
        performance: true,
        functionality: true,
        marketing: false
    });

    const togglePreference = (key: keyof typeof preferences) => {
        if (key === 'essential') return;
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSavePreferences = () => {
        // Logic to save to local storage or backend would go here
        setIsPreferencesOpen(false);
        // Optional: Show a toast notification
    };

    const policySections = [
        {
            id: "essential",
            title: "Essential Cookies",
            icon: Shield,
            description: "These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.",
            details: ["Authentication tokens", "Security verification", "Session management"],
            required: true
        },
        {
            id: "performance",
            title: "Performance & Analytics",
            icon: BarChart3Icon,
            description: "These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.",
            details: ["Google Analytics", "Page load speeds", "User navigation paths"],
            required: false
        },
        {
            id: "functionality",
            title: "Functionality",
            icon: Settings,
            description: "These cookies allow our website to remember choices you make when you use our website, such as remembering your login details or language preference.",
            details: ["Language settings", "Theme preferences", "Local storage data"],
            required: false
        },
        {
            id: "marketing",
            title: "Marketing & Targeting",
            icon: Globe,
            description: "These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from reappearing continuously.",
            details: ["Ad personalization", "Conversion tracking", "Third-party pixels"],
            required: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            {/* Background Magic */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-[#030303] to-[#030303]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] animate-pulse-slow" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 mb-6 backdrop-blur-md">
                            <Cookie size={14} />
                            <span>DATA PRIVACY</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                            Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Policy</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. Here is a transparent breakdown of what we track and why.
                        </p>
                    </motion.div>
                </div>

                {/* Policy Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {policySections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="h-full bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-purple-500/20 transition-all duration-300">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                        <section.icon size={24} />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border ${section.required ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                                        {section.required ? 'Required' : 'Optional'}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3">{section.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">{section.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {section.details.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400 font-mono">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Consent Control Area */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <Lock size={48} className="mx-auto text-gray-600 mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Your Privacy, Your Control</h2>
                        <p className="text-gray-400 mb-8">
                            You can change your cookie preferences at any time by clicking the "Cookie Settings" button below or by adjusting your browser settings.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => setIsPreferencesOpen(true)}
                                className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                            >
                                Manage Preferences
                            </button>
                            <Link href="/privacy-policy" className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold transition-colors flex items-center justify-center">
                                Read Privacy Policy
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-12 text-center text-xs text-gray-600 font-mono">
                    LAST UPDATED: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} // SHIVKARA COMPLIANCE v2.0
                </div>

            </main>

            {/* Preferences Modal */}
            <AnimatePresence>
                {isPreferencesOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsPreferencesOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl pointer-events-auto">
                                {/* Modal Header */}
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                    <div>
                                        <h3 className="text-xl font-bold">Cookie Preferences</h3>
                                        <p className="text-xs text-gray-400 mt-1">Manage what data we collect from you.</p>
                                    </div>
                                    <button onClick={() => setIsPreferencesOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {policySections.map((section) => (
                                        <div key={section.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-bold text-sm">{section.title}</h4>
                                                    {section.required && (
                                                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">REQUIRED</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                                            </div>

                                            <button
                                                onClick={() => togglePreference(section.id as keyof typeof preferences)}
                                                disabled={section.required}
                                                className={`
                                            relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                                            ${preferences[section.id as keyof typeof preferences] ? 'bg-purple-600' : 'bg-gray-700'}
                                            ${section.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                            >
                                                <motion.div
                                                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
                                                    animate={{ x: preferences[section.id as keyof typeof preferences] ? 24 : 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsPreferencesOpen(false)}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSavePreferences}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

// Helper Icon for Graphics
function BarChart3Icon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
        </svg>
    )
}
