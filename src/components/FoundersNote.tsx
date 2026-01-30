"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";
import TiltCard from "./ui/TiltCard";

export default function FoundersNote() {
    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden flex items-center justify-center">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                <TiltCard className="relative bg-[#0A0A0A] border border-white/5 p-8 md:p-16 rounded-[3rem] overflow-hidden">
                    {/* Decorative Quote Icon */}
                    <Quote className="absolute top-8 left-8 w-24 h-24 text-white/[0.02]" />

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/3 flex flex-col items-center text-center md:text-left">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/10 mb-6 relative">
                                <Image
                                    src="/founder.png"
                                    fill
                                    alt="Vansh Gehlot"
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Vansh Gehlot</h3>
                            <p className="text-shivkara-orange font-mono text-xs uppercase tracking-widest mt-2">Founder & Lead Engineer</p>
                        </div>

                        <div className="w-full md:w-2/3">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                "We don't just write code. We write the <span className="text-gray-500">future of your business</span>."
                            </h2>
                            <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
                                <p>
                                    In a world saturated with digital noise, true craftsmanship is rare. I started Shivkara Digital with a single obsession: to build software that doesn't just function, but performs.
                                </p>
                                <p>
                                    We reject mediocrity. Every pixel, every line of backend logic, and every deployment strategy is executed with surgical precision. When you work with us, you aren't just hiring a dev shop; you're partnering with a team that takes your success as personally as you do.
                                </p>
                            </div>
                            <div className="mt-8">
                                <img src="/signature.png" alt="Signature" className="h-12 opacity-50 invert" />
                                {/* Placeholder for signature if not available */}
                            </div>
                        </div>
                    </div>
                </TiltCard>
            </div>
        </section>
    );
}
