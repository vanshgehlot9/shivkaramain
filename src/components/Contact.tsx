"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Contact() {
    return (
        <section id="contact" className="py-32 bg-black relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left Column: Text & CTA */}
                    <div>
                        <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-6 block">/// Get Started</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-none mb-8">
                            Let's Build <br />
                            <span className="text-gray-600">The Future</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl">
                            Ready to transform your business? Stop waiting. Start creating. Our team is ready to engineer your digital success.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-20">
                            <a
                                href="mailto:info@shivkaradigital.com"
                                className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                Send us an Email <ArrowUpRight className="w-5 h-5" />
                            </a>
                            <a
                                href="tel:+919521699090"
                                className="inline-flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
                            >
                                +91 95216 99090
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl">
                                <Mail className="w-8 h-8 text-shivkara-orange mb-6" />
                                <h3 className="text-white font-bold mb-2">Email</h3>
                                <p className="text-gray-500 font-mono text-sm">info@shivkaradigital.com</p>
                            </div>
                            <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl">
                                <Clock className="w-8 h-8 text-shivkara-orange mb-6" />
                                <h3 className="text-white font-bold mb-2">Hours</h3>
                                <p className="text-gray-500 font-mono text-sm">Mon-Fri: 09:00 - 18:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Map & Address */}
                    <div className="space-y-6">
                        <div className="h-[400px] w-full rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/10 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.878757077656!2d73.0064393150305!3d26.26569998340954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c3920197d6d%3A0x6283b544b9292789!2sSardarpura%2C%20Jodhpur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1645516723456!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                className="opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 pointer-events-none border-[6px] border-[#0A0A0A]/50 rounded-[2rem]" />
                        </div>

                        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[2rem] flex items-start gap-6">
                            <div className="p-4 bg-white/5 rounded-2xl text-white">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Headquarters</h3>
                                <p className="text-gray-400 leading-relaxed text-lg font-light">
                                    Sardarpura C Road, Jodhpur,<br />
                                    Rajasthan, India - 342001
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[2rem] flex items-start gap-6">
                            <div className="p-4 bg-white/5 rounded-2xl text-white">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Development Center</h3>
                                <p className="text-gray-400 leading-relaxed text-lg font-light">
                                    Plot No.69, Transport Nagar,<br />
                                    Basni 2nd Phase, M.I.A. 1st Phase,<br />
                                    Jodhpur, Rajasthan 342011
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
