"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ExternalLink, MessageSquare, ArrowUpRight } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-shivkara-orange font-bold tracking-widest uppercase mb-4 block"
                    >
                        Contact Us
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase mb-8"
                    >
                        Let's <span className="text-white">Connect</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Map (Span 7) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 w-full"
                    >
                        <div className="group relative bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:border-shivkara-orange/50 transition-colors duration-500">
                            {/* Browser Header */}
                            <div className="bg-[#0A0A0A] px-6 py-4 flex items-center space-x-4 border-b border-white/5">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="inline-block px-4 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 font-mono tracking-wider">
                                        shivkara.com/location
                                    </div>
                                </div>
                            </div>

                            {/* Map Frame */}
                            <div className="h-[500px] w-full relative grayscale group-hover:grayscale-0 transition-all duration-700">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.878757077656!2d73.0064393150305!3d26.26569998340954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c3920197d6d%3A0x6283b544b9292789!2sSardarpura%2C%20Jodhpur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1645516723456!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    className="opacity-80 hover:opacity-100 transition-opacity duration-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Details (Span 5) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Address Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowUpRight className="w-6 h-6 text-shivkara-orange" />
                            </div>
                            <div className="mb-6 p-4 bg-blue-500/10 rounded-2xl w-fit text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-white">Headquarters</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                Sardarpura C Road, Jodhpur,<br />
                                Rajasthan, India - 342001
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Phone */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="group bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="mb-4 p-3 bg-green-500/10 rounded-xl w-fit text-green-500">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-white">Call Us</h3>
                                <p className="text-gray-400 font-mono">+91 9521699090</p>
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="group bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="mb-4 p-3 bg-shivkara-orange/10 rounded-xl w-fit text-shivkara-orange">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-white">Email Us</h3>
                                <p className="text-gray-400 text-sm">info@shivkaradigital.com</p>
                            </motion.div>
                        </div>

                        {/* Business Hours */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Business Hours</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Mon - Fri</span>
                                    <span className="text-white font-mono">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Saturday</span>
                                    <span className="text-white font-mono">10:00 - 16:00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Sunday</span>
                                    <span className="text-red-500 font-bold uppercase text-sm">Closed</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
