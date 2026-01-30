"use client";

import { motion } from "framer-motion";

const metrics = [
    {
        value: "₹2Cr+",
        label: "Revenue Impact",
        description: "Value generated for our clients through our custom software solutions."
    },
    {
        value: "99.9%",
        label: "System Uptime",
        description: "We build resilient architecture that stays online when it matters most."
    },
    {
        value: "200%",
        label: "Avg. ROI",
        description: "Our clients typically see a 2x return on investment within the first year."
    },
    {
        value: "50k+",
        label: "Active Users",
        description: "Scalable systems supporting thousands of daily active users across platforms."
    }
];

export default function Results() {
    return (
        <section className="py-24 bg-shivkara-orange text-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-16">
                    <span className="font-mono text-xs tracking-widest uppercase mb-4 block text-black/60">/// Impact</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                        Driving Real <br />Business Value
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-black/10 pt-12">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">
                                {metric.value}
                            </div>
                            <h3 className="font-bold text-lg mb-3 uppercase tracking-wide">{metric.label}</h3>
                            <p className="text-black/70 leading-relaxed text-sm font-medium">
                                {metric.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
