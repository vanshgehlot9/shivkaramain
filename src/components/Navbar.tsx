"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Services", href: "#services" },
        { name: "Work", href: "#work" },
        { name: "Process", href: "#process" },
        { name: "Agency", href: "#agency" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? "py-4" : "py-8"}`}
            >
                <div
                    className={`
                        relative flex items-center justify-between px-2 pr-2 rounded-full transition-all duration-500
                        ${scrolled
                            ? "w-[90%] max-w-5xl bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] pl-6 py-2"
                            : "w-[95%] max-w-7xl bg-transparent border border-transparent pl-0 py-0"
                        }
                    `}
                >
                    {/* Logo */}
                    <Link href="/" className="relative z-10 flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                            <img src="/shivkaralogo.jpg" alt="Shivkara" className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? "text-white" : "text-white"}`}>
                            SHIVKARA<span className="text-shivkara-orange">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-sm ml-auto mr-4">
                        {navLinks.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                            >
                                {hoveredIndex === index && (
                                    <motion.div
                                        layoutId="nav-hover"
                                        className="absolute inset-0 bg-white/10 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <MagneticButton className="group relative px-6 py-3 bg-white text-black rounded-full text-sm font-bold overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                            <Link href="/lets-talk" className="flex items-center gap-2 relative z-10">
                                <span className="group-hover:text-white transition-colors duration-300">Let's Talk</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:text-white transition-colors duration-300" />
                            </Link>
                            <div className="absolute inset-0 bg-shivkara-orange translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </MagneticButton>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden relative z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors ml-auto"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-8">
                            {navLinks.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover:to-shivkara-orange transition-all uppercase tracking-tighter"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8"
                            >
                                <Link
                                    href="/lets-talk"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-10 py-5 bg-shivkara-orange text-black text-xl font-bold rounded-full inline-flex items-center gap-3 hover:bg-white transition-colors"
                                >
                                    Start Project <ArrowUpRight />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
