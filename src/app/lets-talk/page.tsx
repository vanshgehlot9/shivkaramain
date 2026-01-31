"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone, Send, Loader2, Sparkles } from "lucide-react";
import { z } from "zod";

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    company: z.string().optional(),
    budget: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormErrors = {
    [key: string]: string[] | undefined;
};

export default function LetsTalk() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        company: "",
        budget: "",
        message: ""
    });

    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrors({});

        const result = contactFormSchema.safeParse(formState);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus('success');
                setFormState({ name: "", email: "", company: "", budget: "", message: "" });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans selection:bg-shivkara-orange/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6 min-h-screen flex items-center relative overflow-hidden">
                {/* Background Art */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-shivkara-orange/5 to-transparent blur-[150px] rounded-full opacity-60" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full opacity-50" />
                </div>

                <div className="container mx-auto relative z-10 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                        {/* Left Column: Info */}
                        <motion.div
                            className="lg:col-span-5 space-y-12"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-6 backdrop-blur-md">
                                    <Sparkles size={14} className="text-shivkara-orange" />
                                    <span>START A PROJECT</span>
                                </div>
                                <h1 className="text-6xl md:text-7xl font-black uppercase leading-none mb-6 tracking-tighter">
                                    Let's <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Create.</span>
                                </h1>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                                    Ready to build something extraordinary? Tell us about your vision, and let's engineer the future together.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: Mail, label: "Email Us", value: "info@shivkaradigital.com" },
                                    { icon: Phone, label: "Call Us", value: "+91 9521699090", sub: "Mon-Fri, 9am - 6pm IST" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-default border border-transparent hover:border-white/5">
                                        <div className="p-3 bg-white/5 rounded-xl text-shivkara-orange group-hover:scale-110 transition-transform">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{item.label}</h3>
                                            <p className="text-lg font-bold text-white">{item.value}</p>
                                            {item.sub && <p className="text-xs text-gray-500 mt-1">{item.sub}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-[200px] w-full bg-[#0a0a0a] border border-white/10 rounded-3xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/73.0243,26.2389,12,0/800x400?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <div className="flex items-center gap-2 text-shivkara-orange mb-1">
                                        <MapPin size={16} />
                                        <span className="text-xs font-bold tracking-widest uppercase">Jodhpur, India</span>
                                    </div>
                                    <p className="text-sm text-gray-300">Sardarpura C Road, Rajasthan 342001</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Dynamic Form */}
                        <motion.div
                            className="lg:col-span-7"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-shivkara-orange/20 to-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-wider">Your Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formState.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className={`w-full bg-black/40 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder:text-white/20 ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs ml-2">{errors.name[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-wider">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className={`w-full bg-black/40 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder:text-white/20 ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs ml-2">{errors.email[0]}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-wider">Company (Optional)</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formState.company}
                                                onChange={handleChange}
                                                placeholder="Acme Inc."
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder:text-white/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-wider">Budget</label>
                                            <div className="relative">
                                                <select
                                                    name="budget"
                                                    value={formState.budget}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" className="bg-[#111] text-gray-500">Select Project Range</option>
                                                    <option value="7k-25k" className="bg-[#111]">₹7k - ₹25k</option>
                                                    <option value="25k-50k" className="bg-[#111]">₹25k - ₹50k</option>
                                                    <option value="50k-1L" className="bg-[#111]">₹50k - ₹1L</option>
                                                    <option value="1L-5L" className="bg-[#111]">₹1L - ₹5L</option>
                                                    <option value="5L-10L" className="bg-[#111]">₹5L - ₹10L</option>
                                                    <option value="10L+" className="bg-[#111]">₹10L+</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-wider">Project Details</label>
                                        <textarea
                                            name="message"
                                            value={formState.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Tell us about your goals, timeline, and requirements..."
                                            className={`w-full bg-black/40 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-shivkara-orange/50 focus:bg-black/60 transition-all placeholder:text-white/20 resize-none ${errors.message ? 'border-red-500' : 'border-white/10'}`}
                                        />
                                        {errors.message && <p className="text-red-500 text-xs ml-2">{errors.message[0]}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Proposal</span>
                                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                            </>
                                        )}
                                    </button>

                                    {submitStatus === 'success' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center text-sm font-bold">
                                            Message received! We will be in touch shortly.
                                        </motion.div>
                                    )}
                                    {submitStatus === 'error' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm font-bold">
                                            Something went wrong. Please try again later.
                                        </motion.div>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
