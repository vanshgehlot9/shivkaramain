"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code, Smartphone, Globe, Database, Cpu } from "lucide-react";
import { MouseEvent, useRef } from "react";

const services = [
    {
        title: "Custom Software",
        description: "Tailored enterprise solutions that solve complex business challenges with precision and scalability.",
        icon: Code,
        colSpan: "md:col-span-2",
        bg: "bg-gradient-to-br from-purple-900/20 to-blue-900/20"
    },
    {
        title: "Mobile Evolution",
        description: "Native and cross-platform apps designed for maximum user engagement and retention.",
        icon: Smartphone,
        colSpan: "md:col-span-1",
        bg: "bg-gradient-to-br from-orange-900/20 to-red-900/20"
    },
    {
        title: "Web Platforms",
        description: "High-performance web applications built with Next.js and modern edge technologies.",
        icon: Globe,
        colSpan: "md:col-span-1",
        bg: "bg-gradient-to-br from-green-900/20 to-emerald-900/20"
    },
    {
        title: "Cloud Infrastructure",
        description: "Scalable cloud architectures on AWS/Azure ensuring 99.99% uptime and security.",
        icon: Database,
        colSpan: "md:col-span-2",
        bg: "bg-gradient-to-br from-blue-900/20 to-cyan-900/20"
    },
    {
        title: "AI Integration",
        description: "Leveraging LLMs and machine learning to automate workflows and generate insights.",
        icon: Cpu,
        colSpan: "md:col-span-3",
        bg: "bg-gradient-to-br from-pink-900/20 to-rose-900/20"
    },
];

function ServiceCard({ service, index }: { service: any; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const xSpring = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(mouseY, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);

    function handleMouseMove({ clientX, clientY }: MouseEvent) {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`group relative perspective-1000 ${service.colSpan}`}
        >
            <div className={`relative h-full border border-white/10 bg-[#0A0A0A] overflow-hidden rounded-3xl p-8 hover:border-white/20 transition-colors duration-500`}>
                {/* Spotlight Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])},
                                rgba(255, 107, 0, 0.15),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${service.bg} blur-3xl`} />

                <div className="relative z-10 h-full flex flex-col justify-between transform-gpu translate-z-10">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/50">
                            <service.icon className="w-7 h-7 text-shivkara-orange" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase mb-3 tracking-tight text-white group-hover:text-shivkara-orange transition-colors duration-300">{service.title}</h3>
                        <p className="text-gray-400 leading-relaxed max-w-md group-hover:text-gray-300 transition-colors duration-300">{service.description}</p>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-sm font-bold text-shivkara-orange opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <span>LEARN MORE</span>
                        <span className="text-lg">→</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Services() {
    return (
        <section id="services" className="py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,0,0.05),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-shivkara-orange font-bold tracking-widest uppercase mb-4">Our Expertise</h3>
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none text-white">
                            Digital <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Mastery</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-400 max-w-md text-lg pb-2 border-b border-shivkara-orange/30"
                    >
                        We combine engineering excellence with creative innovation to build software that matters.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-2000">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
