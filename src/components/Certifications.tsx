"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, CheckCircle2 } from "lucide-react";

const certifications = [
    {
        name: "ISO 27001",
        description: "Information Security Management",
        icon: ShieldCheck
    },
    {
        name: "AWS Partner",
        description: "Advanced Consulting Partner",
        icon: Award
    },
    {
        name: "Google Cloud",
        description: "Certified Solutions Architect",
        icon: Award
    },
    {
        name: "SOC 2 Type II",
        description: "Security & Availability Compliant",
        icon: CheckCircle2
    }
];

export default function Certifications() {
    return (
        <section className="py-20 bg-black border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 px-10 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">Accredited Excellence</h3>
                        <p className="text-gray-400 text-sm">We maintain the highest standards of security and quality.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {certifications.map((cert, index) => (
                            <div key={index} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                                <cert.icon className="w-8 h-8 text-shivkara-orange" />
                                <div className="text-left">
                                    <div className="text-white font-bold text-sm leading-tight">{cert.name}</div>
                                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">{cert.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
