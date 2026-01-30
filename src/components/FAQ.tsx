"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

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
        <section className="py-32 bg-black relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Support</span>
                    <h2 className="text-5xl md:text-6xl font-black uppercase text-white tracking-tighter">
                        Common <span className="text-gray-600">Questions</span>
                    </h2>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? "bg-white/[0.03] border-shivkara-orange/20" : "hover:border-white/20"}`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                            >
                                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${activeIndex === index ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                                    {faq.question}
                                </span>
                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border border-white/10 transition-all duration-300 ${activeIndex === index ? "bg-shivkara-orange border-shivkara-orange rotate-180" : "group-hover:border-white"}`}>
                                    <Plus className={`absolute w-4 h-4 transition-opacity duration-300 ${activeIndex === index ? "opacity-0" : "opacity-100 text-white"}`} />
                                    <Minus className={`absolute w-4 h-4 transition-opacity duration-300 ${activeIndex === index ? "opacity-100 text-black" : "opacity-0"}`} />
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
                                        <div className="px-6 md:px-8 pb-8 text-gray-400 leading-relaxed font-light">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
