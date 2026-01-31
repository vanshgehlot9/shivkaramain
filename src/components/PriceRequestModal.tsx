"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2, Sparkles, Send } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    data: {
        category: string;
        package: string;
        price: number;
        addons: string[];
    };
};

export default function PriceRequestModal({ isOpen, onClose, data }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        details: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, ...data }),
            });

            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setFormData({ name: "", email: "", phone: "", details: "" });
                }, 2500);
            } else {
                throw new Error("Failed to submit");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]"
                    >
                        {/* Top Glow */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-shivkara-orange/10 blur-[100px] rounded-full pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                                    transition={{ type: "spring", damping: 10 }}
                                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                                >
                                    <CheckCircle className="w-10 h-10" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                                <p className="text-gray-400">We'll get back to you within 24 hours with a detailed proposal.</p>
                            </motion.div>
                        ) : (
                            <>
                                <div className="mb-8 relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-shivkara-orange/10 flex items-center justify-center text-shivkara-orange border border-shivkara-orange/20">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Final Step</h3>
                                            <p className="text-xs text-gray-500">Almost there!</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-2">
                                        <p className="text-gray-400 text-sm">
                                            Selected: <span className="text-shivkara-orange font-bold">{data.package}</span>
                                        </p>
                                        <p className="text-white font-mono text-lg mt-1">₹{data.price.toLocaleString()}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/20 transition-all"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/20 transition-all"
                                                placeholder="+91..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/20 transition-all"
                                            placeholder="you@company.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Details (Optional)</label>
                                        <textarea
                                            value={formData.details}
                                            onChange={e => setFormData({ ...formData, details: e.target.value })}
                                            rows={3}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/20 transition-all resize-none"
                                            placeholder="Brief description of your project..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-shivkara-orange to-red-500 text-white font-black py-4 rounded-xl hover:shadow-[0_0_40px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Confirm Request
                                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
