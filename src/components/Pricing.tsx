"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import BookingModal from "./BookingModal";

const plans = [
    {
        name: "Starter",
        price: "₹6,000",
        rawPrice: 6000,
        description: "Essential digital presence for individuals.",
        features: [
            "Single Page Website",
            "Basic SEO Setup",
            "Contact Form",
            "Mobile Responsive",
            "1 Month Support"
        ],
        popular: false,
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        name: "Professional",
        price: "₹15,000",
        rawPrice: 15000,
        description: "Perfect for small businesses & startups.",
        features: [
            "5 Page Website",
            "CMS Integration",
            "Social Media Links",
            "Google Maps Integration",
            "3 Months Support"
        ],
        popular: true,
        gradient: "from-shivkara-orange/20 to-red-500/20"
    },
    {
        name: "Business",
        price: "₹25,000",
        rawPrice: 25000,
        description: "Advanced features for growing brands.",
        features: [
            "10 Page Dynamic Website",
            "Admin Dashboard",
            "Blog/News Section",
            "Advanced Analytics",
            "6 Months Support"
        ],
        popular: false,
        gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        name: "Premium",
        price: "₹70,000",
        rawPrice: 70000,
        description: "Full-scale custom web application.",
        features: [
            "Custom Web App (React/Next.js)",
            "User Authentication",
            "Database Integration",
            "Payment Gateway",
            "1 Year Support"
        ],
        popular: false,
        gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
        name: "Enterprise",
        price: "₹1,00,000+",
        rawPrice: 100000,
        description: "Complete digital transformation solution.",
        features: [
            "Mobile App (iOS & Android)",
            "Cloud Infrastructure",
            "Custom AI Integration",
            "Priority 24/7 Support",
            "Source Code Access"
        ],
        popular: false,
        gradient: "from-orange-500/20 to-yellow-500/20"
    }
];

function PricingCard({ plan, index, onSelect, isSelected }: { plan: any; index: number; onSelect: (plan: any) => void; isSelected: boolean }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const isHighlighted = plan.popular || isSelected;

    return (
        <div className={`h-full relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseMove={handleMouseMove}
                onClick={() => onSelect(plan)} // Make whole card clickable to select
                className={`group relative h-full flex flex-col border bg-black/40 backdrop-blur-xl rounded-3xl p-6 overflow-hidden transition-all duration-500 cursor-pointer
                    ${isHighlighted
                        ? 'border-[#FF7A00] shadow-[0_0_30px_rgba(255,122,0,0.15)] scale-105 z-10'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
            >
                {/* Spotlight Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.1),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl`} />

                {/* Popular Badge - Always visible if popular */}
                {plan.popular && (
                    <div className="absolute top-0 inset-x-0 flex justify-center -mt-3 z-20">
                        <span className="bg-[#FF7A00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Most Popular
                        </span>
                    </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 text-center">
                        <h3 className={`text-lg font-bold uppercase mb-2 ${isHighlighted ? 'text-[#FF7A00]' : 'text-gray-400'}`}>
                            {plan.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            <span className="text-3xl font-black text-white">{plan.price}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed min-h-[40px]">{plan.description}</p>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${isHighlighted ? 'bg-[#FF7A00] text-black' : 'bg-white/10 text-gray-400'}`}>
                                    <Check className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-gray-300 leading-tight">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent double trigger
                            onSelect(plan);
                        }}
                        className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 transform active:scale-95 ${isHighlighted
                            ? 'bg-[#FF7A00] text-black hover:bg-[#FF7A00] hover:shadow-[0_0_20px_rgba(255,122,0,0.4)]'
                            : 'bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black'
                            }`}>
                        Choose {plan.name}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default function Pricing() {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    // Initialize with the popular plan selected by default
    const [activePlanId, setActivePlanId] = useState<string>("Professional");

    const handleSelectPlan = (plan: any) => {
        setSelectedPlan(plan);
        setActivePlanId(plan.name); // Set active border
        setBookingModalOpen(true);
    };

    return (
        <section id="pricing" className="py-24 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-shivkara-orange/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h3 className="text-[#FF7A00] font-bold tracking-widest uppercase mb-4 text-sm">Investment Plans</h3>
                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight">
                        Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Pricing</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Choose the perfect plan for your business needs. <span className="text-white font-semibold">30% Advance</span> to start.
                    </p>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto">
                    {plans.map((plan, index) => (
                        <div key={index} className="w-full h-full min-w-0">
                            <PricingCard
                                plan={plan}
                                index={index}
                                onSelect={handleSelectPlan}
                                isSelected={activePlanId === plan.name}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/lets-talk" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FF7A00] transition-colors group">
                        <Zap className="w-4 h-4 group-hover:animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider border-b border-transparent group-hover:border-[#FF7A00] pb-0.5">
                            Need a custom enterprise solution? Let's talk
                        </span>
                    </Link>
                </div>
            </div>

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                initialPlan={selectedPlan}
            />
        </section>
    );
}
