"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Globe2,
    Clock,
    Loader2,
    CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TiltCard } from "@/components/admin/TiltCard";

export default function Contact() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        company: "", // Added company for consistency with API
        budget: "",  // Added budget (optional)
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus('success');
                setFormState({ name: "", email: "", company: "", budget: "", message: "" });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: "Email Us",
            value: "info@shivkaradigital.com",
            link: "mailto:info@shivkaradigital.com",
            color: "text-shivkara-orange"
        },
        {
            icon: Phone,
            label: "Call Us",
            value: "+91 9521699090",
            link: "tel:+919521699090",
            color: "text-blue-400"
        },
        {
            icon: MapPin,
            label: "Visit HQ",
            value: "Sardarpura C Road, Jodhpur",
            link: "https://maps.google.com",
            color: "text-emerald-400"
        }
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-b from-shivkara-orange/5 to-transparent blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-t from-blue-600/5 to-transparent blur-[120px]" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-6 backdrop-blur-md">
                            <MessageSquare size={14} className="text-shivkara-orange" />
                            <span>24/7 SUPPORT AVAILABLE</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-red-500">Talk</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                            Have a project in mind or need help with a course? Our team is ready to assist you.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

                    {/* Contact Info Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {contactInfo.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <TiltCard>
                                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-6 group hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                                <item.icon size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                                                <a href={item.link} className="text-lg font-bold text-white hover:text-shivkara-orange transition-colors">
                                                    {item.value}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}

                        {/* Map / Location Vibe */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden h-[300px] flex flex-col justify-end group"
                        >
                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/73.0243,26.2389,12,0/800x600?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-shivkara-orange mb-2">
                                    <Globe2 size={16} />
                                    <span className="text-xs font-bold tracking-widest uppercase">Global HQ</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white">Jodhpur, India</h3>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                                    <Clock size={14} />
                                    <span>Open 9:00 AM - 6:00 PM IST</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-shivkara-orange/10 rounded-full blur-[80px]" />

                            <h3 className="text-2xl font-bold mb-8 relative z-10 flex items-center gap-3">
                                Send a Message
                                <div className="h-px flex-1 bg-white/10" />
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 ml-2">YOUR NAME</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder-gray-700"
                                            placeholder="Enter your name"
                                            value={formState.name}
                                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 ml-2">EMAIL ADDRESS</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder-gray-700"
                                            placeholder="Enter your email"
                                            value={formState.email}
                                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-2">COMPANY (OPTIONAL)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder-gray-700"
                                        placeholder="Your company name"
                                        value={formState.company}
                                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-2">MESSAGE</label>
                                    <textarea
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 h-32 outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder-gray-700 resize-none"
                                        placeholder="Tell us how we can help..."
                                        value={formState.message}
                                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Send Message</span>
                                            <Send size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {submitStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} />
                                        Message sent successfully! We will be in touch shortly.
                                    </motion.div>
                                )}
                                {submitStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm font-bold"
                                    >
                                        Something went wrong. Please try again.
                                    </motion.div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
