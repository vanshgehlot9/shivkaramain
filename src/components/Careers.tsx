"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MoveRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Link from "next/link";

const roles = [
    {
        title: "Senior Full Stack Engineer",
        type: "Remote",
        department: "Engineering"
    },
    {
        title: "UI/UX Designer",
        type: "On-site / Hybrid",
        department: "Design"
    },
    {
        title: "Project Manager",
        type: "Remote",
        department: "Product"
    }
];

export default function Careers() {
    return (
        <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[#0A0A0A] opacity-50" />
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-shivkara-orange/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                <div>
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-6 block">/// Join the Elite</span>
                    <h2 className="text-5xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none mb-8">
                        Build the <br /> <span className="text-gray-600">Impossible</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-light leading-relaxed mb-10 max-w-md">
                        We are efficient, dedicated, and obsessed with quality. If you are ready to do the best work of your life, we want you.
                    </p>

                    <MagneticButton
                        className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all hover:scale-105"
                    >
                        <Link href="/careers" className="relative z-10 flex items-center gap-2">
                            VIEW ALL POSITIONS <MoveRight className="w-4 h-4" />
                        </Link>
                        <div className="absolute inset-0 bg-shivkara-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    </MagneticButton>
                </div>

                <div className="space-y-4">
                    {roles.map((role, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-6 md:p-8 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-pointer"
                        >
                            <div>
                                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-shivkara-orange transition-colors">{role.title}</h4>
                                <div className="flex gap-3 text-xs font-mono text-gray-500">
                                    <span>{role.department}</span>
                                    <span>•</span>
                                    <span>{role.type}</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
