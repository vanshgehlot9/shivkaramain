"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { MouseEvent } from "react";

const plans = [
    {
        name: "Starter",
        price: "₹7,000",
        description: "Perfect for small businesses and personal portfolios.",
        features: [
            "Responsive Website (3 Pages)",
            "Basic SEO Setup",
            "Contact Form Integration",
            "Mobile Friendly Design",
            "1 Month Support"
        ],
        popular: false,
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        name: "Growth",
        price: "₹45,000",
        description: "Ideal for growing businesses needing more power.",
        features: [
            "Dynamic Website (10 Pages)",
            "Admin Dashboard",
            "Advanced SEO & Analytics",
            "Social Media Integration",
            "3 Months Support"
        ],
        popular: true,
        gradient: "from-shivkara-orange/20 to-red-500/20"
    },
    {
        name: "Enterprise",
        price: "₹1,00,000",
        description: "Full-scale digital transformation for large organizations.",
        features: [
            "Custom Web Application",
            "Mobile App (Android/iOS)",
            "Cloud Infrastructure Setup",
            "Priority 24/7 Support",
            "Full Source Code Access"
        ],
        popular: false,
        gradient: "from-purple-500/20 to-pink-500/20"
    }
];

function PricingCard({ plan, index }: { plan: any; index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link href={`/checkout?plan=${encodeURIComponent(plan.name)}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseMove={handleMouseMove}
                className={`group relative h-full border border-white/10 bg-black rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:border-white/30 ${plan.popular ? 'scale-105 z-10 shadow-2xl shadow-shivkara-orange/10' : 'scale-100 opacity-80 hover:opacity-100'}`}
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

                {/* Popular Badge */}
                {plan.popular && (
                    <div className="absolute top-0 right-0 bg-shivkara-orange text-black text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                        Most Popular
                    </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold uppercase mb-2 text-gray-400">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl md:text-5xl font-black text-white">{plan.price}</span>
                            <span className="text-sm text-gray-500">/project</span>
                        </div>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="h-px w-full bg-white/10 mb-8" />

                    <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className={`mt-1 p-1 rounded-full ${plan.popular ? 'bg-shivkara-orange/20 text-shivkara-orange' : 'bg-white/10 text-gray-400'}`}>
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 ${plan.popular
                        ? 'bg-shivkara-orange text-black hover:bg-white hover:text-black shadow-lg shadow-shivkara-orange/20'
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black'
                        }`}>
                        Choose {plan.name}
                    </button>
                </div>
            </motion.div>
        </Link>
    );
}

export default function Pricing() {
    return (
        <section id="pricing" className="py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <h3 className="text-shivkara-orange font-bold tracking-widest uppercase mb-4">Investment Plans</h3>
                    <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">
                        Transparent <span className="text-white">Pricing</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Choose the perfect plan for your business needs. No hidden fees, just transparent value.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} index={index} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/lets-talk" className="inline-flex items-center gap-2 text-gray-400 hover:text-shivkara-orange transition-colors border-b border-transparent hover:border-shivkara-orange pb-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">Need a custom enterprise solution? Let's talk</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
