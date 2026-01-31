"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How long does a typical project take?",
        answer: "Timeline depends on complexity. A simple website might take 2-4 weeks, while a complex enterprise platform could take 3-6 months. We provide detailed timelines during our discovery phase."
    },
    {
        question: "Do you provide post-launch support?",
        answer: "Absolutely. We offer various maintenance packages to ensure your digital product remains secure, up-to-date, and performs optimally after launch."
    },
    {
        question: "What is your pricing model?",
        answer: "We offer both fixed-price project based models and dedicated team retainer models. This flexibility allows us to adapt to your specific budget and requirement needs."
    },
    {
        question: "Can you take over an existing project?",
        answer: "Yes, we specialize in code audits and project rescue. We'll analyze your current codebase, identify issues, and propose a roadmap to stabilize and scale it."
    },
    {
        question: "Do you work with international clients?",
        answer: "Yes, we work with clients globally. We use modern collaboration tools to ensure seamless communication across different time zones."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-32 bg-[#030303] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-shivkara-orange/5 to-transparent blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-6 backdrop-blur-md">
                        <HelpCircle size={14} className="text-shivkara-orange" />
                        <span>FREQUENTLY ASKED</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Questions</span>
                    </h2>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index
                                    ? "bg-white/[0.03] border-shivkara-orange/30"
                                    : "border-white/5 hover:border-white/10 bg-white/[0.01]"
                                }`}>
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                                >
                                    <span className={`text-lg md:text-xl font-bold transition-colors duration-300 pr-4 ${activeIndex === index ? "text-white" : "text-gray-400 group-hover:text-white"
                                        }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 ${activeIndex === index
                                            ? "bg-shivkara-orange border-shivkara-orange"
                                            : "border-white/10 group-hover:border-white/20"
                                        }`}>
                                        <Plus className={`absolute w-5 h-5 transition-all duration-300 ${activeIndex === index ? "opacity-0 rotate-90" : "opacity-100 text-white"
                                            }`} />
                                        <Minus className={`absolute w-5 h-5 transition-all duration-300 ${activeIndex === index ? "opacity-100 text-black" : "opacity-0 -rotate-90"
                                            }`} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 md:px-8 pb-8 text-gray-400 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
