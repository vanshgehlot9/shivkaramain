"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "CEO, TechFlow",
        content: "Shivkara Digital transformed our operations. Their ability to translate complex requirements into elegant code is unmatched. A true technical partner.",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        name: "Priya Sharma",
        role: "Founder, DesignStudio",
        content: "The attention to UI detail paired with robust backend performance is rare. They delivered our app ahead of schedule and bug-free.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "Amit Patel",
        role: "Director, RetailGiant",
        content: "Our e-commerce conversion rate doubled after the redesign. Their data-driven approach to UX is incredibly effective.",
        image: "https://randomuser.me/api/portraits/men/86.jpg"
    },
    {
        name: "Sarah Jenkins",
        role: "CTO, InnovateX",
        content: "Scalability was our main concern, and Shivkara nailed it. The architecture they built handles our traffic spikes effortlessly.",
        image: "https://randomuser.me/api/portraits/women/65.jpg"
    }
];

export default function Testimonials() {
    return (
        <section className="py-32 bg-black relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 mb-24 text-center">
                <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Endorsements</span>
                <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">
                    Client <span className="text-gray-600">Stories</span>
                </h2>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                <motion.div
                    className="flex gap-8 w-max px-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 60,
                        ease: "linear",
                    }}
                >
                    {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                        <div
                            key={index}
                            className="w-[85vw] md:w-[600px] flex-shrink-0 glass-card-premium rounded-3xl p-10 md:p-12 relative group transition-colors duration-500 hover:bg-white/[0.04]"
                        >
                            <Quote className="absolute top-10 right-10 w-12 h-12 text-white/5 group-hover:text-shivkara-orange/20 transition-colors" />

                            <div className="flex gap-1 mb-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-5 h-5 text-shivkara-orange fill-shivkara-orange/20" />
                                ))}
                            </div>

                            <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light mb-10">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-5 border-t border-white/5 pt-8">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 group-hover:border-shivkara-orange transition-colors">
                                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg leading-tight">{testimonial.name}</h4>
                                    <span className="text-gray-500 text-sm font-mono uppercase tracking-wider">{testimonial.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
