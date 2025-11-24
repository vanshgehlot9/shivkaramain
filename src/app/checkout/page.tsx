"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, CreditCard, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const planName = searchParams.get("plan") || "Custom Plan";
    const planPrice = searchParams.get("price") || "Contact for Quote";

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Column: Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link href="/" className="text-gray-500 hover:text-white mb-8 inline-flex items-center space-x-2 transition-colors">
                            <span>← Back to Home</span>
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">Checkout</h1>
                        <p className="text-gray-400 mb-12">Complete your purchase to start your digital transformation.</p>

                        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-8">
                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-wider mb-6">Order Summary</h3>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                <span className="text-2xl font-bold">{planName}</span>
                                <span className="text-2xl font-bold text-shivkara-orange">{planPrice}</span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center space-x-3 text-gray-400">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Secure Payment Gateway</span>
                                </li>
                                <li className="flex items-center space-x-3 text-gray-400">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Instant Project Kickoff</span>
                                </li>
                                <li className="flex items-center space-x-3 text-gray-400">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Money Back Guarantee</span>
                                </li>
                            </ul>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Taxes & Fees</span>
                                <span>Calculated at next step</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col items-center text-center">
                                <ShieldCheck className="w-8 h-8 text-shivkara-orange mb-2" />
                                <span className="text-xs text-gray-400">Secure Payment</span>
                            </div>
                            <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col items-center text-center">
                                <Zap className="w-8 h-8 text-shivkara-orange mb-2" />
                                <span className="text-xs text-gray-400">Fast Delivery</span>
                            </div>
                            <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col items-center text-center">
                                <CreditCard className="w-8 h-8 text-shivkara-orange mb-2" />
                                <span className="text-xs text-gray-400">All Cards Accepted</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#111] border border-white/10 rounded-2xl p-8"
                    >
                        <h3 className="text-2xl font-bold mb-8">Billing Details</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 uppercase tracking-wider">First Name</label>
                                    <input type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-shivkara-orange transition-colors" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 uppercase tracking-wider">Last Name</label>
                                    <input type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-shivkara-orange transition-colors" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 uppercase tracking-wider">Email Address</label>
                                <input type="email" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-shivkara-orange transition-colors" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 uppercase tracking-wider">Phone Number</label>
                                <input type="tel" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-shivkara-orange transition-colors" placeholder="+91 98765 43210" />
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <button type="button" className="w-full bg-shivkara-orange text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center space-x-2">
                                    <span>Proceed to Payment</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <p className="text-center text-gray-500 text-xs mt-4">
                                    By clicking the button, you agree to our Terms of Service.
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
