"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    CreditCard,
    Lock,
    ShieldCheck,
    Zap,
    ChevronRight,
    CheckCircle2,
    QrCode,
    Smartphone
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState("upi");

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="relative pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">

                    {/* Left Column: Order Summary & Trust */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl md:text-5xl font-black mb-2">Secure Checkout</h1>
                            <p className="text-gray-400">Complete your registration to secure your spot.</p>
                        </motion.div>

                        {/* Order Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden"
                        >
                            <div className="p-6 md:p-8 flex gap-6 items-start">
                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-shivkara-orange to-red-600 shrink-0 hidden md:block" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold">Full Stack Web Development</h3>
                                            <p className="text-sm text-gray-500">Cohort: SPUNK 2025</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold">₹7,800</span>
                                            <span className="text-xs text-gray-500 line-through">₹15,000</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mb-6">
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">LIFETIME ACCESS</span>
                                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px] font-bold border border-purple-500/20">CERTIFIED</span>
                                    </div>

                                    <div className="space-y-2">
                                        {["Live Mentorship", "Project-Based Learning", "Career Support"].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 flex justify-between items-center text-sm font-mono border-t border-white/5 md:px-8">
                                <span className="text-gray-400">TOTAL PAYABLE</span>
                                <span className="text-xl font-bold text-white">₹7,800</span>
                            </div>
                        </motion.div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: ShieldCheck, label: "SSL Secure" },
                                { icon: Zap, label: "Instant Access" },
                                { icon: Lock, label: "Encrypted" },
                                { icon: CheckCircle2, label: "Money Back" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <item.icon size={20} className="text-gray-500 mb-2" />
                                    <span className="text-xs font-bold text-gray-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Payment Form */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-8 sticky top-32 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="text-shivkara-orange" />
                                Enter Details
                            </h3>

                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 ml-1">FIRST NAME</label>
                                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-shivkara-orange/50 transition-colors placeholder-gray-700 font-medium" placeholder="John" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 ml-1">LAST NAME</label>
                                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-shivkara-orange/50 transition-colors placeholder-gray-700 font-medium" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 ml-1">EMAIL ADDRESS</label>
                                    <input type="email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-shivkara-orange/50 transition-colors placeholder-gray-700 font-medium" placeholder="john@example.com" />
                                </div>

                                <div className="pt-4 pb-2">
                                    <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block">SELECT PAYMENT METHOD</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'bg-white/10 border-shivkara-orange text-white' : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'}`}
                                        >
                                            <Smartphone size={24} />
                                            <span className="text-xs font-bold">UPI / QR</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-white/10 border-shivkara-orange text-white' : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'}`}
                                        >
                                            <CreditCard size={24} />
                                            <span className="text-xs font-bold">CARD</span>
                                        </button>
                                    </div>
                                </div>

                                <button className="w-full py-4 mt-4 bg-gradient-to-r from-shivkara-orange to-red-600 rounded-xl font-black text-lg shadow-[0_0_30px_-10px_rgba(255,122,0,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    Pay ₹7,800
                                    <ChevronRight size={20} strokeWidth={3} />
                                </button>

                                <p className="text-center text-[10px] text-gray-600 mt-4 leading-relaxed">
                                    By clicking the button above, you agree to our <span className="underline cursor-pointer hover:text-white">Terms of Service</span> and <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>.
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
