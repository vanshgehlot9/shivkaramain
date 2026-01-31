"use client";

import { ArrowUp, Linkedin, Twitter, Instagram, Github, Globe, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#030303] text-white relative overflow-hidden pt-24 pb-8 md:pt-32">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-shivkara-orange/5 rounded-full blur-[150px]" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col justify-between min-h-[60vh]">

                {/* Top Section: CTA & Brand */}
                <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-20 border-b border-white/5 pb-16">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">System Status: Operational</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-red-500">Upgrade</span> Your Reality?
                        </h2>
                        <p className="text-xl text-gray-400 font-light leading-relaxed max-w-xl">
                            We architect digital excellence for ambitious brands. Let's build something extraordinary together.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Link
                            href="/contact"
                            className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] transition-shadow duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start a Project <ExternalLink size={18} />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-shivkara-orange to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>

                        <div className="flex items-center gap-4">
                            <SocialLink href="https://www.linkedin.com/company/shivkara-digital" icon={<Linkedin size={20} />} label="LinkedIn" />
                            <SocialLink href="https://www.instagram.com/shivkaradigital/" icon={<Instagram size={20} />} label="Instagram" />
                            <SocialLink href="https://twitter.com/shivkaradigital" icon={<Twitter size={20} />} label="Twitter" />
                            <SocialLink href="https://github.com/shivkaradigital" icon={<Github size={20} />} label="GitHub" />
                        </div>
                    </div>
                </div>

                {/* Main Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-12 mb-20">

                    {/* Column 1: Contact */}
                    <div className="col-span-2 lg:col-span-4 space-y-6">
                        <h4 className="font-bold text-white text-xs uppercase tracking-[0.2em] mb-6">Contact Info</h4>
                        <div className="space-y-4">
                            <ContactItem icon={Mail} text="info@shivkaradigital.com" href="mailto:info@shivkaradigital.com" />
                            <ContactItem icon={Phone} text="+91 9521699090" href="tel:+919521699090" />
                            <ContactItem icon={MapPin} text="Sardarpura C Road, Jodhpur, India" href="https://maps.google.com" />
                        </div>
                    </div>

                    {/* Column 2: Services */}
                    <div className="col-span-1 lg:col-span-2">
                        <LinkColumn title="Services" links={[
                            { label: 'Web Development', href: '/#services' },
                            { label: 'App Development', href: '/#services' },
                            { label: 'UI/UX Design', href: '/#services' },
                            { label: 'Digital Marketing', href: '/#services' },
                        ]} />
                    </div>

                    {/* Column 3: Company */}
                    <div className="col-span-1 lg:col-span-2">
                        <LinkColumn title="Company" links={[
                            { label: 'About Us', href: '/about' },
                            { label: 'Our Work', href: '/#work' },
                            { label: 'Bootcamps', href: '/bootcamps/spunk-2025' },
                            { label: 'Careers', href: '/careers' },
                            { label: 'Verify Certificate', href: '/verify/CERT-ID' }, // Example link
                        ]} />
                    </div>

                    {/* Column 4: Legal */}
                    <div className="col-span-2 lg:col-span-4">
                        <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <h4 className="font-bold text-white text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-shivkara-orange" /> Legal & Policy
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
                                <Link href="/shipping-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Shipping Policy</Link>
                                <Link href="/refund-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Refund Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] md:text-xs text-center md:text-left text-gray-600 font-mono uppercase tracking-widest">
                        <span>&copy; {currentYear} Shivkara Digital. All Rights Reserved.</span>
                        <span className="hidden md:inline text-white/10">|</span>
                        <span>Designed with <span className="text-red-500">♥</span> in India</span>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white"
                    >
                        Back to Top
                        <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Massive Brand Text - Lower Opacity */}
            <div className="w-full overflow-hidden select-none pointer-events-none opacity-[0.03] absolute bottom-0 left-0 right-0 z-0">
                <h1 className="text-[20vw] leading-[0.75] font-black tracking-tighter text-white text-center w-full translate-y-[20%]">
                    SHIVKARA
                </h1>
            </div>
        </footer>
    );
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function LinkColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
    return (
        <div className="flex flex-col h-full">
            <h4 className="font-bold mb-6 text-white text-xs uppercase tracking-[0.2em]">{title}</h4>
            <ul className="space-y-4 font-light">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link href={link.href} className="text-gray-400 hover:text-shivkara-orange hover:translate-x-1 transition-all duration-300 inline-block text-sm">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300 border border-white/10 hover:border-white shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110"
        >
            {icon}
        </a>
    );
}

function ContactItem({ icon: Icon, text, href }: { icon: any, text: string, href: string }) {
    return (
        <a href={href} className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-shivkara-orange group-hover:bg-shivkara-orange/10 transition-colors">
                <Icon size={14} />
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{text}</span>
        </a>
    );
}
