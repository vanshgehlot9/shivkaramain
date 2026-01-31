"use client";

import { motion } from "framer-motion";
import {
    Network,
    Globe,
    Cpu,
    Shield,
    Zap,
    Layers,
    Box,
    Hexagon
} from "lucide-react";

/**
 * Placeholder logos using Lucide icons to represent tech-forward clients.
 * In production, these should be replaced with actual SVG logos.
 */
const clients = [
    { name: "NeoSys", icon: Network },
    { name: "GlobalCore", icon: Globe },
    { name: "CyberDyne", icon: Cpu },
    { name: "Tachyon", icon: Zap },
    { name: "Aegis", icon: Shield },
    { name: "Stratum", icon: Layers },
    { name: "Vortex", icon: Box },
    { name: "Helix", icon: Hexagon }
];

const ClientItem = ({ name, icon: Icon }: { name: string, icon: any }) => (
    <div className="flex items-center justify-center gap-3 px-8 group opacity-40 hover:opacity-100 transition-all duration-500 cursor-default">
        <Icon className="w-8 h-8 text-gray-400 group-hover:text-shivkara-orange transition-colors" />
        <span className="text-xl font-bold font-mono text-gray-500 group-hover:text-white uppercase tracking-widest whitespace-nowrap transition-colors">
            {name}
        </span>
    </div>
);

export default function Clients() {
    return (
        <section className="py-16 bg-[#050505] border-y border-white/5 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] opacity-[0.05] pointer-events-none" />

            <div className="container mx-auto px-6 mb-10 text-center relative z-10">
                <p className="text-shivkara-orange/80 text-[10px] font-mono uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                    <span className="w-8 h-px bg-shivkara-orange/20" />
                    Trusted by Industry Leaders
                    <span className="w-8 h-px bg-shivkara-orange/20" />
                </p>
            </div>

            <div className="flex overflow-hidden relative z-10">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-16 items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear",
                    }}
                >
                    {[...clients, ...clients, ...clients].map((client, index) => (
                        <ClientItem key={index} name={client.name} icon={client.icon} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
