"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Terminal, Code2, Palette, ChevronRight } from "lucide-react";

const team = [
    {
        name: "Vansh Gehlot",
        role: "Lead Developer & Founder",
        icon: Terminal,
        skills: ["Full Stack", "Mobile Dev", "Cloud Native", "AI/ML"],
        gradient: "from-shivkara-orange to-red-500",
        socials: { linkedin: "https://linkedin.com/in/vanshgehlot", github: "https://github.com/vanshgehlot", email: "vansh@shivkaradigital.com" }
    },
    {
        name: "Shubham Dadhich",
        role: "Senior Developer",
        icon: Code2,
        skills: ["Frontend", "Content Creation", "Video Editing", "Social Media"],
        gradient: "from-blue-500 to-cyan-500",
        socials: { linkedin: "#", github: "#", email: "#" }
    },
    {
        name: "Virender Parihar",
        role: "Senior Designer",
        icon: Palette,
        skills: ["UI/UX", "Graphic Design", "Brand Identity", "Prototyping"],
        gradient: "from-purple-500 to-pink-500",
        socials: { linkedin: "#", github: "#", email: "#" }
    },
];

export default function Team() {
    return (
        <section id="agency" className="py-32 bg-[#030303] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,77,0,0.05),transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-shivkara-orange/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-24 text-center"
                >
                    <span className="text-shivkara-orange font-mono text-xs tracking-[0.3em] uppercase mb-6 block">/// The Minds</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter">
                        Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Team</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative rounded-3xl p-8 bg-white/[0.02] border border-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                        >
                            {/* Top Gradient Accent */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${member.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Glow Effect */}
                            <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-700`} />

                            <div className="flex items-start justify-between mb-10 relative z-10">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,107,0,0.3)] transition-all duration-300`}>
                                    <member.icon className="w-7 h-7" />
                                </div>
                                <div className="flex gap-3">
                                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all">
                                        <Github className="w-4 h-4" />
                                    </a>
                                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                    {member.name}
                                </h3>
                                <p className={`text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} font-mono text-xs uppercase tracking-widest mb-8`}>
                                    {member.role}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {member.skills.map((skill, i) => (
                                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5 group-hover:border-white/10 group-hover:text-gray-300 transition-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
