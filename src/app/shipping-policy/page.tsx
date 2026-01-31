"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Truck,
    Package,
    Globe,
    Clock,
    MapPin,
    FileCheck,
    AlertTriangle,
    Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-6 backdrop-blur-md">
                            <Truck size={14} />
                            <span>LOGISTICS & FULFILLMENT</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                            Shipping <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Policy</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Whether it's digital access or physical merchandise, we ensure timely and secure delivery. Here is how we handle orders.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

                    {/* Digital Delivery Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 flex items-center justify-center mb-8">
                                <Zap size={32} className="text-emerald-400" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">Digital Products</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Courses, workshops, and digital assets are delivered instantly upon successful payment verification.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <Clock className="text-emerald-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-sm">Instant Access</h4>
                                        <p className="text-xs text-gray-500 mt-1">Login credentials sent via email immediately.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <FileCheck className="text-emerald-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-sm">License Activation</h4>
                                        <p className="text-xs text-gray-500 mt-1">Software licenses activated within 5 minutes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Physical Shipping Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
                    >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 flex items-center justify-center mb-8">
                                <Package size={32} className="text-blue-400" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">Physical Merchandise</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Certificates, welcome kits, and swag packs are shipped via our courier partners.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <Truck className="text-blue-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-sm">Processing Time</h4>
                                        <p className="text-xs text-gray-500 mt-1">Orders processed within 24-48 hours.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <Globe className="text-blue-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-sm">Delivery Estimates</h4>
                                        <p className="text-xs text-gray-500 mt-1">Domestic: 3-5 days. International: 7-14 days.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Improved Tracking Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 md:p-12 relative overflow-hidden text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <AlertTriangle className="mx-auto text-amber-500 mb-6" size={40} />
                        <h2 className="text-2xl font-bold mb-4">Shipping Delays & Issues</h2>
                        <p className="text-gray-400 mb-8">
                            While we strive for perfection, external factors may cause delays. If you haven't received your tracking number within 48 hours or your package is delayed, please reach out.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Link href="/contact" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                Report Issue
                            </Link>
                            <Link href="/dashboard" className="px-8 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-semibold">
                                Track Order
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </main>
            <Footer />
        </div>
    );
}
