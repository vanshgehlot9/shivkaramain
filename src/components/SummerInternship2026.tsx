"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowUpRight,
    BrainCircuit,
    Briefcase,
    Calendar,
    CheckCircle2,
    Code2,
    Palette,
    Rocket,
} from "lucide-react";

const tracks = [
    {
        title: "UI/UX Design",
        description: "Design real product experiences, from research to high-fidelity prototypes.",
        icon: Palette,
    },
    {
        title: "Full Stack Development",
        description: "Build production-ready web apps with modern frontend and backend workflows.",
        icon: Code2,
    },
    {
        title: "Generative AI",
        description: "Work on practical AI features using prompts, APIs, and automation pipelines.",
        icon: BrainCircuit,
    },
];

const highlights = ["Live Projects", "Industry Mentors", "Certificate", "Placement Guidance"];

export default function SummerInternship2026() {
    return (
        <section className="relative py-28 bg-black overflow-hidden" id="summer-internship-2026">
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-shivkara-orange/15 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/15 blur-[140px] rounded-full" />
            </div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,transparent,white,transparent)] opacity-15 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-3xl border border-white/10 bg-zinc-900/45 backdrop-blur-xl p-8 md:p-12"
                >
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shivkara-orange/10 border border-shivkara-orange/30 text-shivkara-orange text-xs font-bold uppercase tracking-wider mb-5">
                                <Rocket className="w-3.5 h-3.5" />
                                Summer Internship 2026 Started
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05]">
                                Build Your Career <br />
                                <span className="text-shivkara-orange">
                                    With Real Experience
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg mt-5 max-w-2xl leading-relaxed">
                                A career-focused internship track inspired by our hiring model. Learn directly from production teams and ship real outcomes.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 min-w-[260px]">
                            <div className="flex items-center gap-3 text-white font-semibold">
                                <Calendar className="w-5 h-5 text-shivkara-orange" />
                                Batch: April 2026 Onwards
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Duration: 8–12 weeks • Onsite</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        {tracks.map((track) => (
                            <div
                                key={track.title}
                                className="rounded-2xl border border-white/10 bg-black/45 p-6 hover:border-shivkara-orange/40 transition-colors"
                            >
                                <track.icon className="w-9 h-9 text-shivkara-orange mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{track.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-white font-semibold mb-3">
                                <Briefcase className="w-4 h-4 text-shivkara-orange" />
                                What you get
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {highlights.map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-gray-200"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link href="/internship" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-shivkara-orange hover:text-white transition-colors w-full lg:w-auto">
                            Apply Now
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
