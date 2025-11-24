"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
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
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrors({});

        // Validate form
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus('success');
                setFormState({
                    name: "",
                    email: "",
                    company: "",
                    budget: "",
                    message: ""
                });
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
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <Navbar />

            <section className="pt-40 pb-20 px-6 min-h-screen flex items-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-shivkara-orange/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Left Column: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-shivkara-orange font-bold tracking-widest uppercase mb-4 block">
                                Start a Project
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black uppercase leading-tight mb-8">
                                Let's Build <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                                    The Future.
                                </span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 max-w-lg">
                                We help ambitious brands and startups create digital products that define their industry. Tell us about your vision.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-shivkara-orange/50 transition-colors">
                                        <Mail className="w-6 h-6 text-shivkara-orange" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Email Us</h3>
                                        <p className="text-gray-400">info@shivkaradigital.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-shivkara-orange/50 transition-colors">
                                        <Phone className="w-6 h-6 text-shivkara-orange" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Call Us</h3>
                                        <p className="text-gray-400">+91 9521699090</p>
                                        <p className="text-gray-400">Mon-Fri, 9am - 6pm IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-shivkara-orange/50 transition-colors">
                                        <MapPin className="w-6 h-6 text-shivkara-orange" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Visit Us</h3>
                                        <p className="text-gray-400">
                                            Sardarpura C Road, Jodhpur,<br />
                                            Rajasthan, India - 342001
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-shivkara-orange via-purple-500 to-blue-500" />

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-shivkara-orange transition-colors placeholder:text-white/20 ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formState.email}
                                            onChange={handleChange}
                                            placeholder="john@company.com"
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-shivkara-orange transition-colors placeholder:text-white/20 ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formState.company}
                                            onChange={handleChange}
                                            placeholder="Acme Inc."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-shivkara-orange transition-colors placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Budget</label>
                                        <select
                                            name="budget"
                                            value={formState.budget}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-shivkara-orange transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-black text-gray-500">Select Range</option>
                                            <option value="7k-25k" className="bg-black">₹7k - ₹25k</option>
                                            <option value="25k-50k" className="bg-black">₹25k - ₹50k</option>
                                            <option value="50k-1L" className="bg-black">₹50k - ₹1L</option>
                                            <option value="1L-5L" className="bg-black">₹1L - ₹5L</option>
                                            <option value="5L-10L" className="bg-black">₹5L - ₹10L</option>
                                            <option value="10L+" className="bg-black">₹10L+</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Message</label>
                                    <textarea
                                        name="message"
                                        value={formState.message}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell us about your project goals..."
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-shivkara-orange transition-colors placeholder:text-white/20 resize-none ${errors.message ? 'border-red-500' : 'border-white/10'}`}
                                        required
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message[0]}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-shivkara-orange transition-colors duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span>Sending...</span>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                                {submitStatus === 'success' && (
                                    <p className="text-green-500 text-center font-bold mt-4">Message sent successfully! We'll be in touch.</p>
                                )}
                                {submitStatus === 'error' && (
                                    <p className="text-red-500 text-center font-bold mt-4">Something went wrong. Please try again.</p>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
