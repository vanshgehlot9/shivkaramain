"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Terminal, Code2, Cpu } from "lucide-react";

const team = [
    {
        name: "Vansh Gehlot",
        role: "Lead Developer & Founder",
        icon: Terminal,
        skills: ["Full Stack", "Mobile Development", "Cloud Native", "AI Engineer"],
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
        name: "Shubham Dadhich",
        role: "Senior Developer",
        icon: Code2,
        skills: ["Frontend Specialist", "Content Creation", "Video Editing", "Social Media"],
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
        name: "Virender Parihar",
        role: "Senior Designer",
        icon: Cpu,
        skills: ["UI/UX", "Graphic Design", "Brand Identity", "Prototyping"],
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
];

export default function Team() {
    return (
        <section id="agency" className="py-32 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,77,0,0.05),transparent_60%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-24 text-center"
                >
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// The Minds</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter">
                        Core <span className="text-gray-600">Team</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group glass-card-premium rounded-[2rem] p-8 relative overflow-hidden transition-all duration-500 hover:bg-white/[0.05]"
                        >
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-shivkara-orange/0 via-shivkara-orange/50 to-shivkara-orange/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                            <div className="flex items-start justify-between mb-10 relative z-10">
                                <div className="w-14 h-14 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-shivkara-orange group-hover:border-shivkara-orange group-hover:text-black text-white transition-all duration-300">
                                    <member.icon className="w-6 h-6" />
                                </div>
                                <div className="flex gap-4">
                                    <a href={member.socials.github} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a href={member.socials.linkedin} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                    {member.name}
                                </h3>
                                <p className="text-shivkara-orange font-mono text-xs uppercase tracking-widest mb-8">
                                    {member.role}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {member.skills.map((skill, i) => (
                                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.05] group-hover:border-white/10">
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
