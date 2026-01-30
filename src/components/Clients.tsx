"use client";

import { motion } from "framer-motion";

const clients = [
    { name: "Acme Corp", logo: "/logos/1.svg" }, // Placeholders, will use text if images missing or generic
    { name: "GlobalTech", logo: "/logos/2.svg" },
    { name: "Nebula", logo: "/logos/3.svg" },
    { name: "CloudScale", logo: "/logos/4.svg" },
    { name: "CyberSystems", logo: "/logos/5.svg" },
    { name: "FutureLabs", logo: "/logos/6.svg" },
    { name: "Innovate", logo: "/logos/7.svg" },
    { name: "Starlight", logo: "/logos/8.svg" }
];

// Since we don't have actual SVG files, we'll simulate logos with text for now
const PlaceHolderLogo = ({ name }: { name: string }) => (
    <div className="flex items-center justify-center px-8 opacity-50 hover:opacity-100 transition-opacity duration-300">
        <span className="text-xl md:text-2xl font-bold font-mono text-white uppercase tracking-widest whitespace-nowrap">
            {name}
        </span>
    </div>
);

export default function Clients() {
    return (
        <section className="py-12 bg-black border-b border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 mb-8 text-center">
                <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Trusted by innovative companies worldwide</p>
            </div>

            <div className="flex overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-16 items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear",
                    }}
                >
                    {[...clients, ...clients, ...clients].map((client, index) => (
                        <PlaceHolderLogo key={index} name={client.name} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
