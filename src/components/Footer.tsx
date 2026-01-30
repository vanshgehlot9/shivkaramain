"use client";

import { ArrowUp, Linkedin, Twitter, Instagram, Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden">

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">

                    {/* Brand */}
                    <div className="md:w-1/3">
                        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-white/20 group-hover:border-shivkara-orange/50 transition-colors">
                                <img src="/shivkaralogo.jpg" alt="Shivkara" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">SHIVKARA<span className="text-shivkara-orange">.</span></span>
                        </Link>
                        <p className="text-gray-500 text-lg font-light leading-relaxed max-w-sm">
                            Architecting digital excellence for ambitious brands. We merge strategy, design, and technology to build the extraordinary.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">
                        <div>
                            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Sitemap</h4>
                            <ul className="space-y-4 text-gray-400 font-light">
                                <li><Link href="/about" className="hover:text-shivkara-orange transition-colors">About</Link></li>
                                <li><Link href="/#services" className="hover:text-shivkara-orange transition-colors">Services</Link></li>
                                <li><Link href="/#work" className="hover:text-shivkara-orange transition-colors">Work</Link></li>
                                <li><Link href="/contact" className="hover:text-shivkara-orange transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Legal</h4>
                            <ul className="space-y-4 text-gray-400 font-light">
                                <li><Link href="/privacy-policy" className="hover:text-shivkara-orange transition-colors">Privacy</Link></li>
                                <li><Link href="/terms-and-conditions" className="hover:text-shivkara-orange transition-colors">Terms</Link></li>
                                <li><Link href="/cookies-policy" className="hover:text-shivkara-orange transition-colors">Cookies</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Connect</h4>
                            <div className="flex gap-4">
                                <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
                                <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                                <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
                                <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 font-mono">
                    <span>&copy; {currentYear} Shivkara Digital</span>

                    <button onClick={scrollToTop} className="flex items-center gap-2 hover:text-white transition-colors uppercase tracking-wider text-xs">
                        Back to Top <ArrowUp className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a href={href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 border border-white/10 hover:border-white">
            {icon}
        </a>
    );
}
