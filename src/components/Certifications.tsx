"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, CheckCircle2, Cloud, Lock } from "lucide-react";

const certifications = [
    {
        name: "ISO 27001",
        description: "Information Security Management",
        icon: ShieldCheck
    },
    {
        name: "AWS Partner",
        description: "Advanced Consulting Partner",
        icon: Cloud
    },
    {
        name: "Google Cloud",
        description: "Certified Solutions Architect",
        icon: Award
    },
    {
        name: "SOC 2 Type II",
        description: "Security & Availability Compliant",
        icon: Lock
    }
];

export default function Certifications() {
    return (
        <section className="py-12 bg-black border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-shivkara-orange/5 blur-3xl opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="relative rounded-3xl p-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10">
                    <div className="bg-black/80 backdrop-blur-xl rounded-[1.3rem] p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden">

                        {/* Scanning Line Effect */}
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-shivkara-orange/50 to-transparent animate-scan" />

                        <div className="text-center lg:text-left max-w-md shrink-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shivkara-orange/10 border border-shivkara-orange/20 text-shivkara-orange text-[10px] font-mono tracking-widest uppercase mb-3">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Excellence
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Accredited Quality</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Our architecture meets the highest global standards for security, compliance, and scalability.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-6 w-full">
                            {certifications.map((cert, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-shivkara-orange/30 transition-all duration-300 min-w-[240px] flex-1 max-w-[300px]"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-gray-400 group-hover:text-shivkara-orange transition-colors border border-white/5 shadow-inner">
                                        <cert.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm leading-tight mb-0.5 group-hover:text-shivkara-orange transition-colors">{cert.name}</div>
                                        <div className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">{cert.description}</div>
                                    </div>

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-1.5 h-1.5 rounded-full bg-shivkara-orange shadow-[0_0_8px_rgba(255,77,0,0.8)]" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { left: 0; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}</style>
        </section>
    );
}
