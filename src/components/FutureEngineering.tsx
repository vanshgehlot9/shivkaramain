"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, GraduationCap, Code2, Rocket, CircuitBoard, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FutureEngineering() {
    return (
        <section className="py-32 bg-black relative overflow-hidden" id="education">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-shivkara-orange/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
            </div>

            {/* Tech Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,transparent,white,transparent)] opacity-10 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-shivkara-orange text-xs font-mono tracking-widest uppercase mb-6"
                    >
                        <CircuitBoard className="w-3 h-3" />
                        <span>Next Gen Protocol</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-none mb-6"
                    >
                        Engineer Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange via-white to-blue-500 animate-gradient-x">Future</span>
                    </motion.h2>

                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Bridge the gap between academic theory and enterprise execution.
                        Two pathways to excellence.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="flex flex-nowrap lg:grid lg:grid-cols-2 gap-4 lg:gap-16 max-w-5xl mx-auto overflow-x-auto snap-x snap-mandatory -mx-6 px-6 lg:mx-auto lg:px-0 pb-8 lg:pb-0 no-scrollbar">

                    {/* Track 1: Merged Training & Internships */}
                    <div className="min-w-[85vw] lg:min-w-0 snap-center h-auto">
                        <TechCard
                            title="Training & Internships"
                            subtitle="Coming Soon"
                            description="Intensive industrial training geared towards real-world application. Master modern tech stacks and gain internship experience with live projects."
                            icon={Rocket}
                            image="/bootcamp/bootcampheader.jpeg"
                            link="#"
                            tags={["Certification", "Stipend Opportunity", "Live Projects", "Mentorship"]}
                            color="orange"
                            hideCta={true}
                        />
                    </div>

                    {/* Track 2: Virtual Class */}
                    <div className="min-w-[85vw] lg:min-w-0 snap-center h-auto">
                        <TechCard
                            title="Virtual Academy"
                            subtitle="Coming Soon"
                            description="Global access to our premium curriculum. Master UI/UX and Full Stack from anywhere in the world."
                            icon={Code2}
                            image="/bootcamp/bootcampheader.jpeg"
                            link="#"
                            tags={["Shivkara Swag Kit", "Global Community", "LMS Access"]}
                            color="purple"
                            hideCta={true}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}

function TechCard({ title, subtitle, description, icon: Icon, image, link, tags, color, hideCta }: any) {
    const isOrange = color === "orange";
    const isBlue = color === "blue";
    // const isPurple = color === "purple"; // default fallthrough

    let accentColor = "bg-purple-500";
    let accentText = "text-purple-500";
    let accentBorder = "group-hover:border-purple-500/50";
    let overlayColor = "bg-purple-600/20";

    if (isOrange) {
        accentColor = "bg-shivkara-orange";
        accentText = "text-shivkara-orange";
        accentBorder = "group-hover:border-shivkara-orange/50";
        overlayColor = "bg-shivkara-orange/20";
    } else if (isBlue) {
        accentColor = "bg-blue-500";
        accentText = "text-blue-500";
        accentBorder = "group-hover:border-blue-500/50";
        overlayColor = "bg-blue-600/20";
    }

    return (
        <Link href={link} className={`group relative block h-full ${hideCta ? 'cursor-default' : 'cursor-pointer'}`} onClick={(e) => hideCta && e.preventDefault()}>
            <div className={`relative h-full rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 ${accentBorder} overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl`}>

                {/* Image Header */}
                <div className="h-64 relative overflow-hidden">
                    <div className={`absolute inset-0 ${overlayColor} mix-blend-overlay z-10`} />
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />

                    {/* Floating Icon */}
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center z-20">
                        <Icon className={`w-6 h-6 ${accentText}`} />
                    </div>

                    {/* Badge */}
                    <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 z-20">
                        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${accentText}`}>{subtitle}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10">
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-white transition-colors">{title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-8 font-light text-lg">
                        {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {tags.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-mono uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    {!hideCta && (
                        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest group-hover:gap-4 transition-all">
                            <span>Explore Program</span>
                            <ArrowUpRight className={`w-4 h-4 ${accentText}`} />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
