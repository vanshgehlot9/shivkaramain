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
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] select-none pointer-events-none">
                FAQ
            </div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h3 className="text-shivkara-orange font-bold tracking-widest uppercase mb-4">Common Questions</h3>
                    <h2 className="text-4xl md:text-6xl font-black uppercase">
                        Got <span className="text-white">Questions?</span>
                    </h2>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-white/10"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between py-8 text-left group"
                            >
                                <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${activeIndex === index ? "text-shivkara-orange" : "text-white group-hover:text-shivkara-orange"}`}>
                                    {faq.question}
                                </span>
                                <div className={`relative flex items-center justify-center w-8 h-8 transition-transform duration-300 ${activeIndex === index ? "rotate-180" : "rotate-0"}`}>
                                    <Plus className={`absolute w-6 h-6 transition-opacity duration-300 ${activeIndex === index ? "opacity-0" : "opacity-100 text-white"}`} />
                                    <Minus className={`absolute w-6 h-6 transition-opacity duration-300 ${activeIndex === index ? "opacity-100 text-shivkara-orange" : "opacity-0"}`} />
                                </div>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-8 text-gray-400 text-lg leading-relaxed max-w-3xl">
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
