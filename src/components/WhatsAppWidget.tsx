"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ChevronRight, Send, Clock, ShieldCheck, Smartphone, ShoppingBag, Code2, Globe } from "lucide-react";

const supportOptions = [
    {
        id: 1,
        text: "Get instant quote for website",
        icon: Globe,
        message: "Hi, I'm interested in getting a quote for a website development project."
    },
    {
        id: 2,
        text: "Mobile app development pricing",
        icon: Smartphone,
        message: "Hi, I'd like to know more about your mobile app development pricing."
    },
    {
        id: 3,
        text: "E-commerce store development",
        icon: ShoppingBag,
        message: "Hi, I need help with developing an e-commerce store."
    },
    {
        id: 4,
        text: "Custom software solution",
        icon: Code2,
        message: "Hi, I'm looking for a custom software solution for my business."
    }
];

export default function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const phoneNumber = "919521699090";

    const handleOptionClick = (message: string) => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-4 w-[340px] md:w-[380px] bg-[#0a0a0a] backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 font-sans"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-5 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                                    <img src="/shivkaralogo.jpg" alt="Shivkara Logo" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">Shivkara Digital</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        <span className="text-white/80 text-xs font-medium">Online Now</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors relative z-10 p-2 hover:bg-white/10 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar space-y-4">
                            {/* Welcome Message */}
                            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl rounded-tl-none">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    👋 Hi! Welcome to Shivkara Digital. How can we help you today?
                                </p>
                                <span className="text-[10px] text-gray-600 mt-2 block text-right font-mono">Just now</span>
                            </div>

                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Quick Actions</p>

                            <div className="space-y-2">
                                {supportOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionClick(option.message)}
                                        className="w-full bg-white/[0.03] hover:bg-white/[0.06] p-3 rounded-xl border border-white/5 hover:border-white/10 flex items-center justify-between group transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                                                <option.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-300 text-left group-hover:text-white transition-colors">{option.text}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#25D366] transition-colors" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handleOptionClick("Hi, I have a custom query.")}
                                className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                                <span>Send Custom Message</span>
                            </button>

                            {/* Footer Info */}
                            <div className="pt-4 border-t border-white/5 space-y-3">
                                <div className="bg-blue-500/10 p-3 rounded-xl flex items-start gap-3 border border-blue-500/10">
                                    <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-bold text-blue-300 mb-0.5">Business Hours</h4>
                                        <p className="text-[10px] text-blue-400/80">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Your privacy is protected</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <div className="relative group">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0a0a0a] border border-white/10 px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap hidden md:block backdrop-blur-xl"
                        >
                            <p className="text-sm font-medium text-white">Need help? Chat with us!</p>
                            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0a0a0a] transform rotate-45 border-r border-t border-white/10" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full shadow-2xl shadow-green-500/30 flex items-center justify-center relative z-20 transition-colors"
                >
                    {isOpen ? (
                        <X className="w-7 h-7 text-white" />
                    ) : (
                        <MessageCircle className="w-7 h-7 text-white" />
                    )}

                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#030303] flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="text-[10px] font-bold text-white relative z-10">1</span>
                        </span>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
