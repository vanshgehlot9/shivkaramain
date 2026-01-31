"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function LeadPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem("shivkara_popup_seen");
            if (!hasSeenPopup) {
                setIsOpen(true);
            }
        }, 8000); // Show after 8 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("shivkara_popup_seen", "true");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Submitted email:", email);
        setSubmitted(true);
        setIsSubmitting(false);

        setTimeout(() => {
            handleClose();
        }, 2500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-shivkara-orange/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10">
                            {!submitted ? (
                                <>
                                    <div className="w-14 h-14 bg-gradient-to-br from-shivkara-orange/20 to-orange-600/10 rounded-2xl flex items-center justify-center mb-6 border border-shivkara-orange/20">
                                        <Sparkles className="w-7 h-7 text-shivkara-orange" />
                                    </div>

                                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                                        Unlock Your <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-red-500">Digital Potential</span>
                                    </h3>

                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        Get a free consultation and discover how we can transform your digital presence.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <input
                                                type="email"
                                                required
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-shivkara-orange/50 focus:bg-white/[0.05] transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-shivkara-orange transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Get Free Consultation
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <p className="text-xs text-gray-600 mt-6 text-center">
                                        No spam. Unsubscribe anytime.
                                    </p>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                                        <Check className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                                    <p className="text-gray-400">We'll be in touch shortly.</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
