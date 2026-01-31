"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Users, Trophy, Sparkles, Cpu } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function BootcampsHighlight() {
    return (
        <section className="relative py-32 bg-black overflow-hidden">
            {/* Liquid Fluid Background */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[5000ms]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-shivkara-orange/20 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[7000ms]" />
            </div>

            {/* Tech Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Liquid Glass Container */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl">
                    {/* Internal Gloss Highlight */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                    <div className="p-8 md:p-12 relative">
                        {/* Decorative Circuit Lines */}
                        <div className="absolute top-12 left-12 w-24 h-24 border-l border-t border-white/10 rounded-tl-3xl pointer-events-none opacity-50" />
                        <div className="absolute bottom-12 right-12 w-24 h-24 border-r border-b border-white/10 rounded-br-3xl pointer-events-none opacity-50" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Text Content */}
                            <div className="lg:col-span-4 space-y-8 relative z-10 lg:sticky lg:top-12 text-center lg:text-left">
                                <div className="mb-8 p-4 rounded-xl bg-purple-900/20 border border-purple-500/20 backdrop-blur-sm flex items-start sm:items-center gap-4 relative overflow-hidden group mx-auto lg:mx-0 max-w-md lg:max-w-none text-left">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative flex h-3 w-3 shrink-0 mt-1 sm:mt-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                    </div>
                                    <p className="text-sm text-purple-200 font-light leading-relaxed">
                                        <span className="font-bold text-white uppercase tracking-wider mr-2">Student Program Alert:</span>
                                        Applications for Summer Internships, <span className="text-white font-medium">Industrial Training</span> & New Bootcamps opening soon.
                                    </p>
                                </div>

                                <div className="flex justify-center lg:justify-start">
                                    <MagneticBadge>
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span className="tracking-widest">Future Academy</span>
                                    </MagneticBadge>
                                </div>

                                <div className="space-y-4">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight"
                                    >
                                        Forge Your <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-purple-500">Digital Legacy</span>
                                    </motion.h2>
                                    <p className="text-lg text-gray-400 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                                        Join elite training programs designed to bridge the gap between academic theory and high-impact industry execution.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    <Tag icon={Cpu} label="Product Design" />
                                    <Tag icon={Trophy} label="Elite Mentorship" />
                                </div>
                            </div>

                            {/* Cards Container - Desktop (Grid/Flex) */}
                            <div className="hidden lg:col-span-8 lg:flex flex-col md:flex-row gap-6 justify-end">
                                {/* SPUNK 2025 Card */}
                                <TiltCard
                                    title="SPUNK 2025"
                                    badge="Completed"
                                    badgeColor="bg-green-500"
                                    image="/bootcamp/bootcampheader.jpeg"
                                    description="Master modern product design workflows in this intensive, hands-on bootcamp."
                                    link="/bootcamps/spunk-2025"
                                />

                                {/* NEW UI/UX Virtual Card */}
                                <TiltCard
                                    title="UI / UX Virtual"
                                    badge="Coming Soon"
                                    badgeColor="bg-yellow-500"
                                    image="/bootcamp/bootcampheader.jpeg"
                                    description="A comprehensive virtual bootcamp mastering the art of User Interface and Experience Design."
                                    link="#"
                                    isComingSoon={true}
                                />
                            </div>

                            {/* Cards Container - Mobile (Manual Scroll) */}
                            <div className="lg:hidden w-full overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-8 no-scrollbar flex gap-4">
                                <div className="min-w-[85vw] snap-center">
                                    <TiltCard
                                        title="SPUNK 2025"
                                        badge="Completed"
                                        badgeColor="bg-green-500"
                                        image="/bootcamp/bootcampheader.jpeg"
                                        description="Master modern product design workflows in this intensive, hands-on bootcamp."
                                        link="/bootcamps/spunk-2025"
                                    />
                                </div>
                                <div className="min-w-[85vw] snap-center">
                                    <TiltCard
                                        title="UI / UX Virtual"
                                        badge="Coming Soon"
                                        badgeColor="bg-yellow-500"
                                        image="/bootcamp/bootcampheader.jpeg"
                                        description="A comprehensive virtual bootcamp mastering the art of User Interface and Experience Design."
                                        link="#"
                                        isComingSoon={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Tag({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 uppercase tracking-wider">
            <Icon className="w-3 h-3 text-shivkara-orange" />
            {label}
        </div>
    );
}

function MagneticBadge({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x: x * 0.1, y: y * 0.1 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-xs font-bold uppercase hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
            {children}
        </motion.div>
    );
}

interface TiltCardProps {
    title: string;
    badge: string;
    badgeColor: string;
    image: string;
    description: string;
    link: string;
    isComingSoon?: boolean;
}

function TiltCard({ title, badge, badgeColor, image, description, link, isComingSoon = false }: TiltCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [20, -20]);
    const rotateY = useTransform(x, [-100, 100], [-20, 20]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const CardContent = (
        <div
            style={{ transform: "translateZ(0px)" }}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl shadow-2xl group-hover:border-shivkara-orange/50 transition-colors duration-500 h-full flex flex-col"
        >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-mono text-white border border-white/10 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${badgeColor} animate-pulse`} />
                    {badge}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 relative flex-1 flex flex-col">
                <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold text-shivkara-orange uppercase tracking-widest">
                        {isComingSoon ? "Upcoming" : "Flagship Event"}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-shivkara-orange transition-colors">{title}</h3>
                </div>

                <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    {!isComingSoon && (
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gray-800 border border-black flex items-center justify-center text-[8px] text-white">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    )}
                    <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider group-hover:translate-x-1 transition-transform ml-auto">
                        {isComingSoon ? "Notify Me" : "Explore"} <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ perspective: 1200 }}
            className="w-full md:w-[350px] shrink-0"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouse}
                onMouseLeave={handleMouseLeave}
                className="relative group cursor-pointer h-full"
            >
                {isComingSoon ? (
                    <div className="block h-full relative cursor-default">
                        {CardContent}
                    </div>
                ) : (
                    <Link href={link} className="block h-full relative">
                        {CardContent}
                    </Link>
                )}
            </motion.div>
        </motion.div>
    );
}
