"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="py-32 bg-shivkara-orange relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] rounded-full border-[100px] border-black/5" />
                <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full border-[80px] border-black/5" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-8xl font-black text-black tracking-tighter uppercase mb-8 leading-[0.9]"
                >
                    Ready to <br />
                    Disrupt?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-black/70 text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Looking for a partner who cares about your product as much as you do? Let's build something extraordinary together.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <MagneticButton
                        className="group relative inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold text-lg tracking-wide overflow-hidden transition-all hover:scale-105 shadow-2xl hover:shadow-black/30"
                    >
                        <Link href="/contact" className="relative z-10 flex items-center gap-2">
                            LET'S TALK <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    </MagneticButton>
                </motion.div>
            </div>
        </section>
    );
}
