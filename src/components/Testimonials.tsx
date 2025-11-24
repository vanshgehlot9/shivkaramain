"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "CEO, TechFlow",
        content: "Shivkara Digital transformed our online presence. Their attention to detail and technical expertise is unmatched. The team went above and beyond to deliver a product that exceeded our expectations.",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        name: "Priya Sharma",
        role: "Founder, DesignStudio",
        content: "The best development team we've worked with. They delivered our mobile app ahead of schedule and it looks stunning. Their communication throughout the project was exemplary.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "Amit Patel",
        role: "Director, RetailGiant",
        content: "Our e-commerce sales increased by 200% after the redesign. Highly recommend their consulting services. They truly understand the intersection of design and business.",
        image: "https://randomuser.me/api/portraits/men/86.jpg"
    },
    {
        name: "Sarah Jenkins",
        role: "CTO, InnovateX",
        content: "A partner that actually cares about code quality. The scalability of the solution they built allowed us to grow 10x in six months without a hitch.",
        image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
        name: "Michael Chang",
        role: "VP Product, FutureScale",
        content: "World-class design chops backed by solid engineering. Shivkara is the agency you want in your corner when the stakes are high.",
        image: "https://randomuser.me/api/portraits/men/22.jpg"
    }
];

export default function Testimonials() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-shivkara-orange/50 to-transparent" />

            <div className="container mx-auto px-6 relative z-10 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h3 className="text-shivkara-orange font-bold tracking-widest uppercase mb-4">Testimonials</h3>
                    <h2 className="text-4xl md:text-6xl font-black uppercase">
                        Client <span className="text-white">Stories</span>
                    </h2>
                </motion.div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                <motion.div
                    className="flex gap-8 w-max px-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 50,
                        ease: "linear",
                    }}
                >
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div
                            key={index}
                            className="w-[85vw] md:w-[500px] flex-shrink-0 bg-[#0A0A0A] border border-white/10 p-6 md:p-10 rounded-3xl relative group hover:border-shivkara-orange/50 transition-colors duration-500"
                        >
                            <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                                <Quote className="w-8 h-8 md:w-12 md:h-12 text-shivkara-orange" />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-4 h-4 text-shivkara-orange fill-shivkara-orange" />
                                ))}
                            </div>

                            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 relative z-10">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-shivkara-orange transition-colors duration-500">
                                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-base md:text-lg">{testimonial.name}</h4>
                                    <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wider">{testimonial.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
