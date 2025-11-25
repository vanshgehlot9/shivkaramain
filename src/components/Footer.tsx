"use client";

import { ArrowUpRight, ArrowUp, Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white pt-24 pb-8 border-t border-white/10">
            <div className="container mx-auto px-6">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

                    {/* Brand Section - Col Span 4 */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                                <img src="/shivkaralogo.jpg" alt="Shivkara" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">SHIVKARA<span className="text-shivkara-orange">.</span></span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            We build digital experiences that define the future. Merging art, technology, and strategy to create lasting value for ambitious brands.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
                        </div>
                    </div>

                    {/* Navigation - Col Span 2 */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/#services">Services</FooterLink>
                            <FooterLink href="/#work">Our Work</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* Services - Col Span 2 */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold mb-6 text-white text-lg">Services</h4>
                        <ul className="space-y-4 text-gray-400">
                            <FooterLink href="#">Web Development</FooterLink>
                            <FooterLink href="#">Mobile Apps</FooterLink>
                            <FooterLink href="#">UI/UX Design</FooterLink>
                            <FooterLink href="#">Cloud Solutions</FooterLink>
                            <FooterLink href="#">AI Integration</FooterLink>
                        </ul>
                    </div>

                    {/* Contact/CTA - Col Span 3 */}
                    <div className="md:col-span-3">
                        <h4 className="font-bold mb-6 text-white text-lg">Get in Touch</h4>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:info@shivkaradigital.com" className="text-2xl font-light hover:text-shivkara-orange transition-colors">
                                info@shivkaradigital.com
                            </a>
                            <p className="text-gray-400">
                                Jodhpur, Rajasthan<br />
                                India
                            </p>
                            <Link href="/lets-talk" className="inline-flex items-center gap-2 text-shivkara-orange font-bold mt-4 group">
                                Start a Project
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <div className="flex gap-6">
                        <span>&copy; {currentYear} Shivkara Digital. All rights reserved.</span>
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
                        <Link href="/cookies-policy" className="hover:text-white transition-colors">Cookies Policy</Link>
                        <Link href="/cancellation-and-refunds" className="hover:text-white transition-colors">Cancellation & Refunds</Link>
                        <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
                    </div>
                    <button onClick={scrollToTop} className="flex items-center gap-2 hover:text-white transition-colors">
                        Back to Top <ArrowUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-shivkara-orange transition-colors duration-200 block">
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a href={href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-shivkara-orange hover:text-black transition-all duration-300 border border-white/5 hover:border-shivkara-orange">
            {icon}
        </a>
    );
}
