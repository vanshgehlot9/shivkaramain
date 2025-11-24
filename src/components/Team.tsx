"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Terminal, Code2, Cpu } from "lucide-react";

const team = [
    {
        name: "Vansh Gehlot",
        role: "Lead Developer Founder",
        icon: Terminal,
        skills: ["Full Stack", "Mobile Development", "Cloud Native" ,"AI Engineer"],
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
        name: "Shubham Dadhich",
        role: "Senior Developer",
        icon: Code2,
        skills: ["Frontend Specialist", "Content Creation", "Video Editing", "Social Media Management"],
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
        name: "Virender Parihar",
        role: "Senior Developer",
        icon: Cpu,
        skills: ["UI/UX", "Graphic Design", ],
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
];

export default function Team() {
    return (
        <section id="agency" className="py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-24 text-center"
                >
                    <h3 className="text-shivkara-orange font-bold tracking-widest uppercase mb-4">The Minds Behind</h3>
                    <h2 className="text-5xl md:text-7xl font-black uppercase">
                        Core <span className="text-white">Team</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:border-shivkara-orange/50 transition-colors duration-300 relative overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-shivkara-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-shivkara-orange/10 transition-colors duration-500" />

                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 group-hover:border-shivkara-orange/30 transition-colors duration-300">
                                    <member.icon className="w-8 h-8 text-shivkara-orange" />
                                </div>
                                <div className="flex gap-3">
                                    <a href={member.socials.github} className="text-gray-500 hover:text-white transition-colors">
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a href={member.socials.linkedin} className="text-gray-500 hover:text-white transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                            <p className="text-shivkara-orange font-mono text-sm uppercase tracking-wider mb-6">
                                {member.role}
                            </p>

                            <div className="space-y-3">
                                <div className="h-px w-full bg-white/10" />
                                <div className="flex flex-wrap gap-2">
                                    {member.skills.map((skill, i) => (
                                        <span key={i} className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
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
