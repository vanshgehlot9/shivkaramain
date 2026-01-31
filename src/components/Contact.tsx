"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Globe, Sparkles } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-shivkara-orange/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
            </div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">

                    {/* Left Column: Command Center */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mb-8 backdrop-blur-md"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                            <span className="text-shivkara-orange font-mono text-xs tracking-[0.2em] uppercase text-shadow-neon">/// Get Started</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-8"
                        >
                            Let's Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">The Future</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl"
                        >
                            Ready to transform your business? Initiate the protocol. <span className="text-white font-medium">We are ready to deploy.</span>
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <a
                                href="mailto:info@shivkaradigital.com"
                                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                <span className="relative z-10 flex items-center gap-2">Initiate Contact <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                                <div className="absolute inset-0 bg-gradient-to-r from-shivkara-orange to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                            </a>
                            <a
                                href="tel:+919521699090"
                                className="group inline-flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors backdrop-blur-sm"
                            >
                                <Phone className="w-4 h-4 text-shivkara-orange" />
                                <span>+91 95216 99090</span>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard icon={Mail} title="Communication" value="info@shivkaradigital.com" />
                            <InfoCard icon={Clock} title="Operations" value="Mon-Fri: 09:00 - 18:00" />
                        </div>
                    </div>

                    {/* Right Column: Glass Map Module */}
                    <div className="relative h-full min-h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0A0A]/50 backdrop-blur-xl shadow-2xl group">
                        {/* Map Overlay Effects */}
                        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-0 z-10 pointer-events-none bg-[url('/grid.svg')] opacity-10" />

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.3976864194487!2d75.77123957613583!3d26.85908226238697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5c450165555%3A0x6a04df9045731b53!2sMansarovar%20Plaza!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                            allowFullScreen
                            loading="lazy"
                            className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                        />

                        {/* Location Badge */}
                        <div className="absolute bottom-8 left-8 right-8 z-20">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-start gap-5 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="p-3 bg-shivkara-orange/10 border border-shivkara-orange/20 rounded-2xl text-shivkara-orange shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">HQ Coordinates</h3>
                                    <p className="text-gray-400 text-sm font-mono leading-relaxed">
                                        Floor No 5, Office No. 518,<br />
                                        Mansarovar Plaza, Jaipur<br />
                                        <span className="text-xs text-shivkara-orange/70 mt-1 block">LAT: 26.8590° N, LONG: 75.7712° E</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .text-shadow-neon {
                    text-shadow: 0 0 10px rgba(255,107,0,0.5);
                }
            `}</style>
        </section>
    );
}

function InfoCard({ icon: Icon, title, value }: { icon: any, title: string, value: string }) {
    return (
        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.05] transition-colors group">
            <div className="flex items-center gap-4 mb-3">
                <Icon className="w-5 h-5 text-gray-500 group-hover:text-shivkara-orange transition-colors" />
                <h3 className="text-white font-bold text-sm tracking-wide uppercase">{title}</h3>
            </div>
            <p className="text-gray-400 font-mono text-xs">{value}</p>
        </div>
    );
}
