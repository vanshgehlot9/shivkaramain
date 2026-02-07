"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import {
    Cpu, Target, Users, CheckCircle, AlertTriangle,
    ArrowRight, Clock, Eye, Rocket, Lock, Terminal
} from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import CheckoutModal from "@/components/CheckoutModal";

// --- Components ---

const GlassCard = ({ children, className = "", hoverEffect = true }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
    <div className={`relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl ${hoverEffect ? 'group hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500' : ''} ${className}`}>
        {/* Gloss Gradient - Industrial Steel */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30" />

        {/* Hover Glow - Shivkara Orange */}
        {hoverEffect && (
            <div className="absolute -inset-px bg-gradient-to-r from-transparent via-shivkara-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: '1.5s' }} />
        )}

        {children}
    </div>
);

const SectionHeader = ({ subtitle, title, description, align = "center" }: { subtitle: string, title: React.ReactNode, description?: string, align?: "center" | "left" }) => (
    <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-shivkara-orange uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
            /// {subtitle}
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
            {title}
        </h2>
        {description && (
            <p className="text-lg text-gray-400 font-light max-w-2xl leading-relaxed opacity-80 mix-blend-screen" style={{ margin: align === "center" ? "0 auto" : "0" }}>
                {description}
            </p>
        )}
    </div>
);

const MobileAutoSlider = ({ slides, duration = 30 }: { slides: React.ReactNode[], duration?: number }) => {
    return (
        <div className="relative w-full overflow-hidden">
            {/* Gradient Masks for Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10" />

            <motion.div
                className="flex gap-6 px-6 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: duration }}
            >
                {/* Double the items for seamless loop */}
                {[...slides, ...slides].map((slide, i) => (
                    <div key={i} className="w-[85vw] max-w-[400px] shrink-0">
                        {slide}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const LiquidBlob = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse ${className}`} />
);

export default function DesignLabContent() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Live Counter Logic
    const [seatsLeft, setSeatsLeft] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeatsLeft(prev => prev > 4 ? prev - 1 : 4);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Mouse Parallax for Hero
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const moveX = clientX - window.innerWidth / 2;
        const moveY = clientY - window.innerHeight / 2;
        mouseX.set(moveX * 0.05); // low sensitivity
        mouseY.set(moveY * 0.05);
    };

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <main
            ref={containerRef}
            className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black overflow-hidden perspective-1000 font-sans"
            onMouseMove={handleMouseMove}
        >
            <Navbar />

            {/* --- Global Background Layers --- */}

            {/* 1. Noise Grain */}
            <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.04] pointer-events-none z-[50] mix-blend-overlay" />

            {/* 2. Grid System */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-[0.15] z-0 pointer-events-none" />

            {/* 3. Liquid Fluids - WARMER TONES (No generic AI purple/blue) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <LiquidBlob className="top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-zinc-800 duration-[10s]" />
                <LiquidBlob className="bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-shivkara-orange/10 duration-[15s]" />
                <LiquidBlob className="top-[40%] left-[30%] w-[40vw] h-[40vw] bg-orange-900/10 duration-[20s]" />
            </div>


            {/* --- 1. Hero Section: Immersive Glass --- */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 px-4 sm:px-6 z-10">
                <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Hero Text */}
                    <div className="lg:col-span-8 relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shivkara-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-shivkara-orange"></span>
                            </span>
                            <span className="text-gray-300 font-mono text-xs tracking-widest uppercase">Applications Open • Batch 04</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-white mb-6 sm:mb-8 leading-[0.9]">
                            SHIVKARA <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">DESIGN LAB</span>
                        </h1>

                        <p className="text-base sm:text-xl md:text-2xl text-gray-400 font-light max-w-2xl mb-8 sm:mb-10 leading-relaxed mix-blend-screen">
                            This is not a course. It is a <span className="text-white font-medium">studio simulation</span> designed to bridge the gap between Figma fundamentals and deployment-ready execution.
                        </p>

                        <MagneticButton className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 group text-sm tracking-widest uppercase">
                            <button onClick={() => setIsCheckoutOpen(true)} className="flex items-center gap-2 w-full h-full">
                                Reserve Seat <ArrowRight className="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform" />
                            </button>
                        </MagneticButton>
                    </div>

                    {/* Hero Visual - Abstract Glass Structure */}
                    <div className="lg:col-span-4 relative h-[400px] lg:h-[600px] hidden lg:block perspective-[2000px]">
                        <motion.div
                            style={{
                                x: mouseX,
                                y: mouseY,
                                rotateY: useTransform(mouseX, [-50, 50], [-10, 10]),
                                rotateX: useTransform(mouseY, [-50, 50], [10, -10])
                            }}
                            className="w-full h-full relative"
                        >
                            {/* Card 1: Warm/Industrial Theme */}
                            <GlassCard className="absolute top-10 right-0 w-[300px] h-[400px] z-10 p-8 flex flex-col justify-between !bg-white/[0.05] !backdrop-blur-2xl border-white/20">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-shivkara-orange to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                        <Cpu className="text-white w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Logic + <br />Magic</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[70%] bg-shivkara-orange" />
                                    </div>
                                    <div className="flex justify-between text-xs font-mono text-gray-400">
                                        <span>SYSTEMS</span>
                                        <span>70%</span>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Card 2: Neutral/Steel Theme */}
                            <GlassCard className="absolute bottom-20 left-10 w-[280px] h-[200px] z-20 p-6 !bg-black/60 !backdrop-blur-xl border-white/10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-xs font-mono text-white/60 uppercase">/// Outcome</div>
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-lg font-medium text-white mb-2">Deployable Designers</div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    We build portfolios that survive production environments, not just Dribbble feeds.
                                </p>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* --- 2. Positioning Manifesto --- */}
            <section className="py-16 sm:py-24 md:py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div className="sticky top-32 self-start">
                            <span className="text-shivkara-orange font-mono text-xs tracking-[0.3em] uppercase mb-4 block">Manifesto</span>
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 sm:mb-8 leading-none">
                                NO <br />FLUFF.
                            </h2>
                            <p className="text-xl text-gray-300 font-light leading-relaxed mb-8">
                                The industry doesn&apos;t need more certificate collectors. It needs problem solvers. We stripped away distinctive gimmicks to focus purely on competence.
                            </p>

                            <div className="flex flex-col gap-4">
                                {[
                                    { label: "No Cashback", icon: Lock },
                                    { label: "No Wallet Deductions", icon: Lock },
                                    { label: "No Discount Gimmicks", icon: Lock }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-gray-400 font-mono text-sm uppercase tracking-wider group hover:text-white transition-colors">
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-shivkara-orange/50 transition-colors">
                                            <item.icon className="w-3 h-3 group-hover:text-shivkara-orange transition-colors" />
                                        </div>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-1 min-w-0">
                            {/* Desktop: Vertical Stack */}
                            <div className="hidden md:flex flex-col gap-6">
                                {[
                                    {
                                        title: "Figma Fundamentals",
                                        desc: "Master auto-layout, components, and variables. Not just how to use tools, but how to abuse them for speed.",
                                        icon: Target
                                    },
                                    {
                                        title: "Design Systems",
                                        desc: "Build scalable tokens and libraries. Learn why consistency beats creativity in product teams.",
                                        icon: Cpu
                                    },
                                    {
                                        title: "Developer Handoff",
                                        desc: "Stop making pretty pictures. Start making implementable interfaces. Learn the language of frontend.",
                                        icon: Terminal
                                    },
                                    {
                                        title: "Real Client Simulation",
                                        desc: "Receive vague briefs, conflicting feedback, and impossible constraints. Just like the real world.",
                                        icon: AlertTriangle
                                    }
                                ].map((module, i) => (
                                    <GlassCard key={i} className="p-8 group hover:-translate-y-2 transition-transform duration-500">
                                        <div className="flex items-start gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-shivkara-orange/10 group-hover:border-shivkara-orange/20 transition-colors shrink-0">
                                                <module.icon className="w-5 h-5 text-gray-300 group-hover:text-shivkara-orange transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-3">{module.title}</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">{module.desc}</p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>

                            {/* Mobile: Infinite Auto-Slider */}
                            <div className="md:hidden -mx-6">
                                <MobileAutoSlider
                                    slides={[
                                        {
                                            title: "Figma Fundamentals",
                                            desc: "Master auto-layout & variables. Abuse tools for speed.",
                                            icon: Target
                                        },
                                        {
                                            title: "Design Systems",
                                            desc: "Build scalable tokens. Consistency > Creativity.",
                                            icon: Cpu
                                        },
                                        {
                                            title: "Developer Handoff",
                                            desc: "Stop making pretty pictures. Make implementable interfaces.",
                                            icon: Terminal
                                        },
                                        {
                                            title: "Real Client Simulation",
                                            desc: "Vague briefs, constraints & rejections. Real world realism.",
                                            icon: AlertTriangle
                                        }
                                    ].map((item, i) => (
                                        <GlassCard key={i} className="p-6 h-full flex flex-col justify-center border-white/5 bg-white/[0.01]">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                    <item.icon className="w-5 h-5 text-shivkara-orange" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                        </GlassCard>
                                    ))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* --- 3. Industry Mechanics (Bento Grid) --- */}
            <section className="py-16 sm:py-24 md:py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/20 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeader
                        subtitle="Production Grade"
                        title={<>Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-yellow-500">Simulation</span></>}
                        description="We engineered mechanisms to replicate the pressure, standards, and workflow of a top-tier product studio."
                    />

                    {/* Desktop View: Bento Grid */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                        {/* Shadow Designer - Large Card */}
                        <GlassCard className="md:col-span-2 md:row-span-2 p-10 flex flex-col justify-between relative overflow-hidden group">
                            {/* Changed orb from Blue to Orange/Amber for Fire feel */}
                            <div className="absolute top-0 right-0 p-[300px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none group-hover:bg-orange-600/15 transition-colors" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs font-mono mb-6">
                                    <Eye className="w-3 h-3" /> Top 10-15% Exclusive
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-4">Shadow Designer System</h3>
                                <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                                    Top performers don&apos;t just learn; they observe. Gain listen-only access to real Shivkara client calls, briefs, and rejections. See how deals are closed and designs are defended.
                                </p>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <div className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                                    <div className="text-xs text-gray-500 uppercase font-mono mb-1">Access Level</div>
                                    <div className="text-white font-bold">Read / Listen Only</div>
                                </div>
                                <div className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                                    <div className="text-xs text-gray-500 uppercase font-mono mb-1">Realism</div>
                                    <div className="text-white font-bold">100% Client Data</div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Design Council */}
                        <GlassCard className="p-8 flex flex-col justify-center relative group">
                            <Users className="w-8 h-8 text-white mb-6 group-hover:text-shivkara-orange transition-colors" />
                            <h3 className="text-2xl font-bold text-white mb-2">Design Council</h3>
                            <p className="text-gray-400 text-sm">
                                Top students become the jury. Review peer work, shortlist assignments, and influence the final grading curve.
                            </p>
                        </GlassCard>

                        {/* Silent Mentor */}
                        <GlassCard className="p-8 flex flex-col justify-center relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Lock className="w-8 h-8 text-gray-400 mb-6 group-hover:text-red-500 transition-colors" />
                            <h3 className="text-2xl font-bold text-white mb-2">Silent Review</h3>
                            <p className="text-gray-400 text-sm">
                                One blind submission. No hints. No guidance. A pure test of your independent decision-making capability.
                            </p>
                        </GlassCard>
                    </div>

                    {/* Mobile View: Auto Slider */}
                    <div className="md:hidden -mx-6">
                        <MobileAutoSlider
                            duration={40}
                            slides={[
                                <GlassCard key="shadow" className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-[200px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs font-mono mb-6">
                                            <Eye className="w-3 h-3" /> Top 10-15% Exclusive
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-4">Shadow Designer</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Observe real interactions. Listen-only access to client calls and rejections.
                                        </p>
                                    </div>
                                </GlassCard>,
                                <GlassCard key="council" className="p-8 h-full flex flex-col justify-center relative">
                                    <Users className="w-8 h-8 text-white mb-6" />
                                    <h3 className="text-2xl font-bold text-white mb-2">Design Council</h3>
                                    <p className="text-gray-400 text-sm">
                                        Top students become the jury. Influence the grading curve.
                                    </p>
                                </GlassCard>,
                                <GlassCard key="silent" className="p-8 h-full flex flex-col justify-center relative">
                                    <Lock className="w-8 h-8 text-gray-400 mb-6" />
                                    <h3 className="text-2xl font-bold text-white mb-2">Silent Review</h3>
                                    <p className="text-gray-400 text-sm">
                                        One blind submission. No hints. Pure independent testing.
                                    </p>
                                </GlassCard>
                            ]}
                        />
                    </div>
                </div>
            </section>


            {/* --- 4. Growth System (Referrals) --- */}
            <section className="py-16 sm:py-24 md:py-32 relative bg-black/50 overflow-hidden">
                {/* Background Tech Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-30 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeader
                        subtitle="Unlockables"
                        title="Growth System"
                        description="Referral rewards are performance-locked. We only reward active contributors, not just distinct sign-ups."
                    />

                    {/* Desktop View: Grid */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                tier: "01",
                                name: "Performance Boost",
                                req: "10 Referrals",
                                perks: ["₹500 Fee Reduction", "Priority Eval", "Extra Critique Session"],
                                color: "text-white", // Neutral/Silver Tier
                                hover: "group-hover:text-white",
                                border: "group-hover:border-white/40"
                            },
                            {
                                tier: "02",
                                name: "Access Upgrade",
                                req: "15 Referrals",
                                perks: ["Bootcamp FREE (Credit)", "Fast-track Scoring", "Early Access Future Events"],
                                color: "text-shivkara-orange", // Orange Tier
                                hover: "group-hover:text-shivkara-orange",
                                border: "group-hover:border-shivkara-orange/50"
                            },
                            {
                                tier: "03",
                                name: "Elite Track",
                                req: "25 Referrals (Limit 5)",
                                perks: ["Paid Project Role", "Shivkara Goodies Kit", "Student Spotlight"],
                                color: "text-yellow-400", // Gold Tier
                                hover: "group-hover:text-yellow-400",
                                border: "group-hover:border-yellow-500/50"
                            }
                        ].map((card, i) => (
                            <GlassCard key={i} className={`p-8 relative group ${card.border}`}>
                                <div className="absolute top-4 right-4 text-xs font-mono text-gray-600 group-hover:text-white transition-colors">TIER {card.tier}</div>

                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">{card.name}</h3>
                                <div className={`text-sm font-mono ${card.color} mb-8`}>{card.req}</div>

                                <ul className="space-y-4">
                                    {card.perks.map((perk, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                                            <div className={`w-1.5 h-1.5 rounded-full ${card.color.replace('text', 'bg')}`} />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Mobile View: Auto Slider */}
                    <div className="md:hidden -mx-6">
                        <MobileAutoSlider
                            slides={[
                                {
                                    tier: "01",
                                    name: "Performance Boost",
                                    req: "10 Referrals",
                                    perks: ["₹500 Fee Reduction", "Priority Eval", "Extra Critique Session"],
                                    color: "text-white"
                                },
                                {
                                    tier: "02",
                                    name: "Access Upgrade",
                                    req: "15 Referrals",
                                    perks: ["Bootcamp FREE", "Fast-track Scoring", "Early Access Events"],
                                    color: "text-shivkara-orange"
                                },
                                {
                                    tier: "03",
                                    name: "Elite Track",
                                    req: "25 Referrals (Limit 5)",
                                    perks: ["Paid Project Role", "Shivkara Goodies Kit", "Student Spotlight"],
                                    color: "text-yellow-400"
                                }
                            ].map((card, i) => (
                                <GlassCard key={i} className="p-8 h-full relative border-white/5 bg-white/[0.01]">
                                    <div className="absolute top-4 right-4 text-xs font-mono text-gray-600">TIER {card.tier}</div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{card.name}</h3>
                                    <div className={`text-sm font-mono ${card.color} mb-8`}>{card.req}</div>
                                    <ul className="space-y-4">
                                        {card.perks.map((perk, j) => (
                                            <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                                                <div className={`w-1.5 h-1.5 rounded-full ${card.color.replace('text', 'bg')}`} />
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                </GlassCard>
                            ))}
                        />
                    </div>
                </div>
            </section>

            {/* --- 5. Final CTA / Pricing --- */}
            <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6" id="pricing">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-2xl sm:rounded-[3rem] overflow-hidden p-1">
                        {/* Animated Border Gradient - Orange */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-shivkara-orange/30 to-transparent opacity-30 animate-pulse" />

                        <div className="relative bg-[#050505] rounded-xl sm:rounded-[2.9rem] p-8 sm:p-12 md:p-20 text-center overflow-hidden">
                            {/* Inner Glow - Orange */}
                            <div className="absolute top-0 right-0 p-[400px] bg-orange-600/5 blur-[200px] rounded-full pointer-events-none" />

                            <div className="relative z-10">
                                <span className="inline-block py-1 px-4 rounded-full bg-white/10 text-xs font-bold text-white uppercase tracking-widest mb-6 sm:mb-8">
                                    Final Intake Phase
                                </span>

                                <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 sm:mb-6">₹1,500</h2>
                                <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-12">Total Fee. No Upsells. Just Access.</p>

                                <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <Clock className="w-4 h-4 text-shivkara-orange" /> 4 Weeks Virtual
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <Rocket className="w-4 h-4 text-shivkara-orange" /> Live Project
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <MagneticButton className="px-12 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]">
                                        <button onClick={() => setIsCheckoutOpen(true)} className="w-full h-full">
                                            SECURE YOUR SPOT
                                        </button>
                                    </MagneticButton>
                                </div>
                                <p className="mt-6 text-xs text-gray-600 font-mono uppercase tracking-widest">
                                    First 48h Bonus: Unlock Real Client Briefs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
        </main >
    );
}
