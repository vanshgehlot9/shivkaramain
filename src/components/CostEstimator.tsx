"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ShoppingBag, PenTool, Briefcase, Activity, Plane, Database, Zap, Layers } from "lucide-react";
import MagneticButton from "./MagneticButton";
import PriceRequestModal from "./PriceRequestModal";

type Package = {
    id: string;
    label: string;
    subLabel: string;
    price: number;
    description: string;
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
            { id: "woo", label: "Startup Store", subLabel: "WordPress + Woo", price: 19999, description: "Everything you need to start selling. Includes Domain, Hosting, & Setup.", popular: true },
            { id: "custom_ecom", label: "Custom Scale", subLabel: "React / Next.js", price: 29999, description: "Blazing fast custom store designed for performance and growth." },
            { id: "shopify", label: "Shopify Elite", subLabel: "Shopify Setup", price: 34999, description: "Scalable Shopify store with premium theme customization." },
            { id: "app_web_ecom", label: "Omnichannel", subLabel: "Web + Mobile App", price: 44999, description: "Dominate the market with a synchronized Website and Mobile App." },
        ]
    },
    {
        id: "blog",
        label: "Blogging",
        icon: PenTool,
        packages: [
            { id: "custom_blog", label: "Pro Blog", subLabel: "Next.js Custom", price: 7999, description: "A beautifully designed, ultra-fast blog to build your audience.", popular: true },
            { id: "wp_blog", label: "WP Classic", subLabel: "WordPress", price: 9999, description: "The classic choice. Easy to manage content and plugins." },
            { id: "blog_app", label: "Media Brand", subLabel: "Blog + App", price: 12999, description: "Turn your blog into a media empire with a dedicated mobile app." },
        ]
    },
    {
        id: "business",
        label: "Business",
        icon: Briefcase,
        packages: [
            { id: "static", label: "Digital Card", subLabel: "Static Site", price: 6999, description: "Perfect for establishing a professional online presence. 3-5 Pages." },
            { id: "dynamic", label: "Growth Site", subLabel: "Dynamic CMS", price: 12999, description: "Editable content and dynamic features for growing businesses.", popular: true },
        ]
    },
    {
        id: "health",
        label: "Health & Fit",
        icon: Activity,
        packages: [
            { id: "basic_fit", label: "Fitness Starter", subLabel: "Basic App", price: 24999, description: "Diet plans, workout logs, and basic analytics." },
            { id: "adv_fit", label: "Health Eco", subLabel: "App + Dashboard", price: 59999, description: "Complete platform with payment gateway and coach dashboard." },
        ]
    },
    {
        id: "travel",
        label: "Travel",
        icon: Plane,
        packages: [
            { id: "tour_booking", label: "Agency Web", subLabel: "Booking Site", price: 19999, description: "Showcase tours and accept bookings online effortlessly." },
            { id: "adv_booking", label: "Travel Aggregator", subLabel: "Multi-Service Platform", price: 49999, description: "Flights, hotels, and bus booking system with mobile app." },
        ]
    },
    {
        id: "erp",
        label: "ERP / CRM",
        icon: Database,
        packages: [
            { id: "small_erp", label: "Biz Manager", subLabel: "Small Biz ERP", price: 14999, description: "Streamline operations: Inventory, Billing, and HR basics." },
            { id: "enterprise_erp", label: "Enterprise Core", subLabel: "Advanced ERP", price: 54999, description: "Full-scale management system with analytics and custom modules." },
        ]
    },
];

const addons = [
    { id: "social_img", label: "Social Graphics", desc: "12 Custom Posts/mo", price: 3499, icon: Layers },
    { id: "social_vid", label: "Reels / Shorts", desc: "4 Edited Videos/mo", price: 1499, icon: Zap },
    { id: "social_manage", label: "Social Manager", desc: "Posting & Engagement", price: 3999, icon: Activity },
];

export default function CostEstimator() {
    const [selectedCategory, setSelectedCategory] = useState<string>("ecommerce");
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const calculateTotal = () => {
        let total = 0;
        const category = categories.find(c => c.id === selectedCategory);
        const pkg = category?.packages.find(p => p.id === selectedPackage);
        if (pkg) total += pkg.price;
        selectedAddons.forEach(id => {
            const addon = addons.find(a => a.id === id);
            if (addon) total += addon.price;
        });
        return total;
    };

    const total = calculateTotal();

    return (
        <section className="py-24 bg-[#030303] relative overflow-hidden" id="estimator">
            {/* Vibrant Background Glows */}
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-shivkara-orange/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Budget Planner</span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-6">
                        Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-yellow-500">Vision</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Select your industry and needs to get an instant, budget-friendly estimate.
                    </p>
                </div>

                {/* Category Navigation */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => { setSelectedCategory(cat.id); setSelectedPackage(null); }}
                                className={`flex items-center gap-2 px-4 py-3 md:px-6 md:py-3 rounded-full border transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start ${isSelected
                                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="font-bold uppercase tracking-wide text-xs md:text-sm">{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Packages Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <AnimatePresence mode="wait">
                            {categories.find(c => c.id === selectedCategory)?.packages.map(pkg => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => setSelectedPackage(pkg.id)}
                                    className={`relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border cursor-pointer group transition-all duration-300 ${selectedPackage === pkg.id
                                        ? "bg-[#0A0A0A] border-shivkara-orange shadow-[0_0_30px_rgba(255,107,0,0.15)] ring-1 ring-shivkara-orange/50"
                                        : "bg-[#0A0A0A] border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                        }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute top-4 right-4 px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-shivkara-orange to-red-500 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                            Best Value
                                        </div>
                                    )}

                                    <div className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-wider mb-2">{pkg.subLabel}</div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{pkg.label}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 min-h-[30px] md:min-h-[40px]">
                                        {pkg.description}
                                    </p>

                                    <div className="flex items-end justify-between">
                                        <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                            ₹{pkg.price.toLocaleString()}
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedPackage === pkg.id ? "bg-shivkara-orange text-black" : "bg-white/10 text-gray-500 group-hover:bg-white/20"
                                            }`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary & Addons Panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Summary Card */}
                            <div className="bg-[#080808] border border-white/10 rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-shivkara-orange/5 to-transparent pointer-events-none" />

                                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest opacity-60">Estimation</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Package</span>
                                        <span className="text-white font-medium text-right max-w-[150px]">
                                            {categories.find(c => c.id === selectedCategory)?.packages.find(p => p.id === selectedPackage)?.subLabel || "None Selected"}
                                        </span>
                                    </div>
                                    {selectedAddons.length > 0 && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Add-ons ({selectedAddons.length})</span>
                                            <span className="text-shivkara-orange font-medium">Included</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                                    <span className="text-xl md:text-2xl text-gray-600 align-top mr-1">₹</span>
                                    {total.toLocaleString()}
                                </div>
                                <p className="text-xs text-gray-500 mb-8">*Exclusive of taxes</p>

                                <div onClick={() => setIsModalOpen(true)}>
                                    <MagneticButton className="w-full bg-shivkara-orange text-black font-black py-4 rounded-xl hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-shadow cursor-pointer">
                                        Get This Price
                                    </MagneticButton>
                                </div>
                            </div>

                            {/* Add-ons List */}
                            <div className="bg-[#080808] border border-white/10 rounded-[2rem] p-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recommended Add-ons</h4>
                                <div className="space-y-3">
                                    {addons.map(addon => (
                                        <div
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${selectedAddons.includes(addon.id)
                                                ? "bg-white/5 border-white/30"
                                                : "bg-transparent border-transparent hover:bg-white/[0.02]"
                                                }`}
                                        >
                                            <div className="p-2 bg-white/5 rounded-lg text-shivkara-orange flex-shrink-0">
                                                <addon.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-white truncate">{addon.label}</div>
                                                <div className="text-xs text-gray-500 truncate">{addon.desc}</div>
                                            </div>
                                            <div className="text-sm font-mono font-bold text-gray-300 flex-shrink-0">
                                                +₹{(addon.price / 1000).toFixed(1)}k
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedAddons.includes(addon.id) ? "bg-shivkara-orange border-shivkara-orange text-black" : "border-white/20"
                                                }`}>
                                                {selectedAddons.includes(addon.id) && <Check className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <PriceRequestModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={{
                        category: categories.find(c => c.id === selectedCategory)?.label || "",
                        package: categories.find(c => c.id === selectedCategory)?.packages.find(p => p.id === selectedPackage)?.label || "Custom Build",
                        price: total,
                        addons: addons.filter(a => selectedAddons.includes(a.id)).map(a => a.label)
                    }}
                />
            </div>
        </section>
    );
}
