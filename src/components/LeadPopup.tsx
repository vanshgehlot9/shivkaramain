"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function LeadPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem("shivkara_popup_seen");
            if (!hasSeenPopup) {
                setIsOpen(true);
            }
        }, 5000); // Show after 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("shivkara_popup_seen", "true");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the email to your API
        console.log("Submitted email:", email);
        setSubmitted(true);
        setTimeout(() => {
            handleClose();
        }, 2000);
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="relative z-10">
                            {!submitted ? (
                                <>
                                    <div className="w-12 h-12 bg-shivkara-orange/20 rounded-full flex items-center justify-center mb-6">
                                        <ArrowRight className="w-6 h-6 text-shivkara-orange" />
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-2">
                                        Unlock Your <br />
                                        <span className="text-shivkara-orange">Digital Potential</span>
                                    </h3>

                                    <p className="text-gray-400 mb-8">
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
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-shivkara-orange/50 transition-colors"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-shivkara-orange transition-colors flex items-center justify-center gap-2"
                                        >
                                            Get Free Consultation
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>

                                    <p className="text-xs text-gray-600 mt-4 text-center">
                                        No spam. Unsubscribe anytime.
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                        <Check className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                                    <p className="text-gray-400">We'll be in touch shortly.</p>
                                </div>
                            )}
                        </div>

                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-shivkara-orange/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
