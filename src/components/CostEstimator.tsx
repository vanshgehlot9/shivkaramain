"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ShoppingBag, PenTool, Briefcase, Activity, Plane, Database, Zap, Layers, Cpu, Server, Smartphone, Globe } from "lucide-react";
import MagneticButton from "./MagneticButton";
import PriceRequestModal from "./PriceRequestModal";

// --- data structures ---
type Package = {
    id: string;
    label: string;
    subLabel: string;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
};

type Category = {
    id: string;
    label: string;
    icon: any;
    packages: Package[];
};

const categories: Category[] = [
    {
        id: "ecommerce",
        label: "E-Commerce",
        icon: ShoppingBag,
        packages: [
            {
                id: "woo",
                label: "Startup Store",
                subLabel: "WordPress + Woo",
                price: 19999,
                description: "Launch your brand with a solid foundation.",
                features: ["50 Products", "Payment Gateway", "Basic SEO"],
                popular: true
            },
            {
                id: "custom_ecom",
                label: "Scale Custom",
                subLabel: "React / Next.js",
                price: 29999,
                description: "High-performance store for scaling brands.",
                features: ["Unlimited Products", "Advanced Analytics", "Custom UI/UX"]
            },
            {
                id: "app_web_ecom",
                label: "Omnichannel",
                subLabel: "Web + App",
                price: 44999,
                description: "Dominate mobile and web markets simultaneously.",
                features: ["iOS & Android App", "Real-time Sync", "Push Notifs"]
            },
        ]
    },
    {
        id: "business",
        label: "Business",
        icon: Briefcase,
        packages: [
            {
                id: "static",
                label: "Digital Card",
                subLabel: "Static Site",
                price: 6999,
                description: "Professional digital presence.",
                features: ["5 Pages", "Contact Form", "Fast Loading"]
            },
            {
                id: "dynamic",
                label: "Growth Engine",
                subLabel: "Dynamic CMS",
                price: 12999,
                description: "Manage your content dynamically.",
                features: ["Admin Panel", "Blog Section", "Lead Capture"],
                popular: true
            },
        ]
    },
    {
        id: "saas",
        label: "SaaS / App",
        icon: Cpu,
        packages: [
            {
                id: "mvp",
                label: "MVP Launch",
                subLabel: "Standard Stack",
                price: 39999,
                description: "Validate your idea with a working product.",
                features: ["User Auth", "Database", "Core Features"]
            },
            {
                id: "scale_saas",
                label: "Pro Platform",
                subLabel: "Advanced Arch",
                price: 89999,
                description: "Built for thousands of concurrent users.",
                features: ["Microservices", "AI Integration", "High Security"]
            },
        ]
    },
    {
        id: "health",
        label: "Health",
        icon: Activity,
        packages: [
            { id: "basic_fit", label: "Fitness App", subLabel: "Basic Tracking", price: 24999, description: "Track workouts and diets.", features: ["User Profiles", "Progress Charts"] },
            { id: "adv_fit", label: "Health Eco", subLabel: "Full Platform", price: 59999, description: "Complete telemedicine or coaching system.", features: ["Video Calls", "Subscription Mgmt"] },
        ]
    }
];

const addons = [
    { id: "social_img", label: "Social Kit", desc: "12 Posts/mo", price: 3499, icon: Layers },
    { id: "seo_pro", label: "SEO Pro", desc: "Rank Higher", price: 4999, icon: Globe },
    { id: "server_setup", label: "Cloud Ops", desc: "AWS/GCP Setup", price: 2999, icon: Server },
    { id: "maintenance", label: "AMC Support", desc: "Yearly Maint.", price: 9999, icon: Zap },
];

export default function CostEstimator() {
    const [selectedCategory, setSelectedCategory] = useState<string>("ecommerce");
    const [selectedPackage, setSelectedPackage] = useState<string | null>("woo");
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [animatedTotal, setAnimatedTotal] = useState(0);
    const [currentDate, setCurrentDate] = useState<string>("");

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);

    const activeCategory = categories.find(c => c.id === selectedCategory);

    const calculateTotal = () => {
        let total = 0;
        const pkg = activeCategory?.packages.find(p => p.id === selectedPackage);
        if (pkg) total += pkg.price;
        selectedAddons.forEach(id => {
            const addon = addons.find(a => a.id === id);
            if (addon) total += addon.price;
        });
        return total;
    };

    const targetTotal = calculateTotal();

    // Smooth counter animation
    useEffect(() => {
        let start = animatedTotal;
        const end = targetTotal;
        const duration = 500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setAnimatedTotal(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [targetTotal]);

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    return (
        <section className="py-24 bg-black relative overflow-hidden" id="estimator">
            {/* Background Tech Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shivkara-orange/10 border border-shivkara-orange/20 text-shivkara-orange text-[10px] font-mono tracking-widest uppercase mb-4">
                        <Database className="w-3 h-3" />
                        System Configurator
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">
                        Budget <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">Planner</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT PANEL: Controls */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* 1. Industry Selection */}
                        <div className="space-y-4">
                            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">01 // Select Network</label>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat.id); setSelectedPackage(null); }}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${selectedCategory === cat.id
                                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                            : "bg-[#0A0A0A] text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        <cat.icon className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase tracking-wide">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Scale Selection */}
                        <div className="space-y-4">
                            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">02 // Select Architecture</label>
                            <div className="flex overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-8 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 md:px-0 md:mx-0 no-scrollbar gap-4">
                                <AnimatePresence mode="popLayout">
                                    {activeCategory?.packages.map(pkg => (
                                        <motion.div
                                            key={pkg.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => setSelectedPackage(pkg.id)}
                                            className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 group overflow-hidden min-w-[85vw] md:min-w-0 snap-center ${selectedPackage === pkg.id
                                                ? "bg-[#0A0A0A] border-shivkara-orange/50 shadow-[0_0_20px_rgba(255,77,0,0.1)]"
                                                : "bg-[#0A0A0A] border-white/10 hover:border-white/20"
                                                }`}
                                        >
                                            {/* Selection Indicator */}
                                            <div className={`absolute top-0 right-0 p-3 transition-opacity ${selectedPackage === pkg.id ? "opacity-100" : "opacity-0"}`}>
                                                <div className="w-2 h-2 rounded-full bg-shivkara-orange shadow-[0_0_8px_#FF4D00]" />
                                            </div>

                                            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">{pkg.subLabel}</div>
                                            <h3 className="text-xl font-bold text-white mb-2">{pkg.label}</h3>
                                            <p className="text-gray-400 text-xs leading-relaxed mb-4">{pkg.description}</p>

                                            <div className="space-y-1">
                                                {pkg.features.map((feat, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500">
                                                        <Check className="w-3 h-3 text-shivkara-orange" />
                                                        {feat}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-white font-mono font-bold">₹{(pkg.price / 1000).toFixed(0)}k</span>
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedPackage === pkg.id ? "border-shivkara-orange bg-shivkara-orange text-black" : "border-white/20 text-transparent"}`}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* 3. Add-ons */}
                        <div className="space-y-4">
                            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">03 // Extensions</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {addons.map(addon => (
                                    <div
                                        key={addon.id}
                                        onClick={() => toggleAddon(addon.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedAddons.includes(addon.id)
                                            ? "bg-white/10 border-white/30"
                                            : "bg-[#0A0A0A] border-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <addon.icon className={`w-5 h-5 mb-3 ${selectedAddons.includes(addon.id) ? "text-shivkara-orange" : "text-gray-500"}`} />
                                        <div className="text-xs font-bold text-white mb-0.5">{addon.label}</div>
                                        <div className="text-[10px] text-gray-500">+₹{addon.price.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Receipt */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl">
                                {/* Digital Noise Overlay */}
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                    <span className="font-mono text-xs text-gray-500 uppercase">Est. Receipt // {currentDate}</span>
                                    <Activity className="w-4 h-4 text-shivkara-orange animate-pulse" />
                                </div>

                                <div className="space-y-4 mb-8 min-h-[160px]">
                                    {/* Line Items */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Core Architecture</span>
                                        <span className="text-white font-mono">
                                            ₹{(activeCategory?.packages.find(p => p.id === selectedPackage)?.price || 0).toLocaleString()}
                                        </span>
                                    </div>

                                    <AnimatePresence>
                                        {selectedAddons.map(id => {
                                            const addon = addons.find(a => a.id === id);
                                            return (
                                                <motion.div
                                                    key={id}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex justify-between text-sm overflow-hidden"
                                                >
                                                    <span className="text-gray-400 pl-4 border-l border-white/10">{addon?.label}</span>
                                                    <span className="text-gray-300 font-mono">+₹{addon?.price.toLocaleString()}</span>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>

                                {/* Total Display */}
                                <div className="border-t border-dashed border-white/20 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <div className="text-xs font-mono text-gray-500 uppercase">Estimated Total</div>
                                        <div className="text-4xl font-black text-white tracking-tighter">
                                            ₹{animatedTotal.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-shivkara-orange"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((targetTotal / 100000) * 100, 100)}%` }}
                                            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                                        />
                                    </div>
                                </div>

                                <div onClick={() => setIsModalOpen(true)}>
                                    <MagneticButton className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-shivkara-orange hover:text-white transition-colors flex items-center justify-center gap-2 group">
                                        Launch Project
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </MagneticButton>
                                    <p className="text-[10px] text-center text-gray-600 mt-4">
                                        *Final quote may vary based on exact requirements.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <PriceRequestModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={{
                        category: activeCategory?.label || "",
                        package: activeCategory?.packages.find(p => p.id === selectedPackage)?.label || "Custom",
                        price: targetTotal,
                        addons: addons.filter(a => selectedAddons.includes(a.id)).map(a => a.label)
                    }}
                />
            </div>
        </section>
    );
}
