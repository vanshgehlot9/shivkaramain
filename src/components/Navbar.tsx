"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import BookingModal from "./BookingModal";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
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
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? "py-4" : "py-6"}`}
            >
                <div
                    className={`
                        relative flex items-center justify-between px-2 pr-2 rounded-full transition-all duration-500 box-border
                        ${scrolled
                            ? "w-[90%] max-w-5xl bg-[#050505]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pl-4 py-2"
                            : "w-[95%] max-w-7xl bg-transparent border border-transparent pl-0 py-0"
                        }
                    `}
                >
                    {/* Logo */}
                    <Link href="/" className="relative z-10 flex items-center gap-3 group pl-2">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-shivkara-orange/50 transition-colors duration-300">
                            <img src="/shivkaralogo.jpg" alt="Shivkara" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-shivkara-orange transition-colors duration-300">
                            SHIVKARA<span className="text-shivkara-orange group-hover:text-white transition-colors duration-300">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-full p-1.5 border border-white/[0.08] backdrop-blur-md ml-auto mr-4 shadow-inner">
                        {navLinks.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative px-5 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
                            >
                                {hoveredIndex === index && (
                                    <motion.div
                                        layoutId="nav-hover"
                                        className="absolute inset-0 bg-white/[0.08] rounded-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`relative z-10 transition-colors duration-300 ${hoveredIndex === index ? "text-white" : ""}`}>
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <MagneticButton
                            onClick={() => setBookingModalOpen(true)}
                            className="group relative px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] border border-transparent hover:border-shivkara-orange/20"
                        >
                            <span className="flex items-center gap-2 relative z-10">
                                <span className="group-hover:text-white transition-colors duration-300">Start Project</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:text-white transition-colors duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-shivkara-orange translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </MagneticButton>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden relative z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors ml-auto group"
                    >
                        {mobileMenuOpen ?
                            <X className="group-hover:text-shivkara-orange transition-colors" /> :
                            <Menu className="group-hover:text-shivkara-orange transition-colors" />
                        }
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
                        className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')] opacity-10 animate-noise pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-shivkara-orange/10 blur-[150px] rounded-full pointer-events-none" />

                        <div className="flex flex-col items-center gap-8 relative z-10">
                            {navLinks.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover:to-shivkara-orange transition-all uppercase tracking-tighter"
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
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setBookingModalOpen(true);
                                    }}
                                    className="px-10 py-5 bg-shivkara-orange text-black text-xl font-bold rounded-full inline-flex items-center gap-3 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,77,0,0.3)]"
                                >
                                    Start Project <ArrowUpRight />
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
        </>
    );
}
