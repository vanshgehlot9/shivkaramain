"use client";

import { motion } from "framer-motion";
import { Lock, Server, Shield, FileKey, Eye, Fingerprint } from "lucide-react";

const features = [
    {
        title: "End-to-End Encryption",
        description: "Data is encrypted at rest and in transit using military-grade AES-256 protocols.",
        icon: Lock
    },
    {
        title: "GDPR & HIPAA Compliant",
        description: "We build systems that strictly adhere to global data privacy regulations and standards.",
        icon: FileKey
    },
    {
        title: "Zero Trust Architecture",
        description: "Never trust, always verify. Strict identity access management (IAM) ensures data integrity.",
        icon: Fingerprint
    },
    {
        title: "DDoS Protection",
        description: "Advanced mitigation strategies to keep your services available 24/7/365.",
        icon: Shield
    },
    {
        title: "24/7 Threat Monitoring",
        description: "Real-time surveillance of your infrastructure to detect and neutralize threats instantly.",
        icon: Eye
    },
    {
        title: "Secure Infrastructure",
        description: "Hardened server configurations and automated patch management.",
        icon: Server
    }
];

export default function Security() {
    return (
        <section className="py-24 bg-[#030303] border-t border-white/5 relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Safety First</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">
                            Enterprise <span className="text-gray-600">Security</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-md text-sm font-light leading-relaxed">
                        Security isn't an afterthought; it's our foundation. We protect your intellectual property and user data with an ironclad defense strategy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/40 border border-white/10 p-8 rounded-2xl hover:border-shivkara-orange/40 transition-all duration-300 group"
                        >
                            <feature.icon className="w-10 h-10 text-gray-500 mb-6 group-hover:text-shivkara-orange transition-colors" />
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
