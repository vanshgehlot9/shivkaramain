"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code, Smartphone, Globe, Database, Cpu, Layers, Zap, Shield } from "lucide-react";
import { MouseEvent, useRef } from "react";

const services = [
    {
        title: "Custom Software",
        description: "Tailored enterprise solutions that solve complex business challenges with precision and scalability.",
        icon: Code,
        colSpan: "md:col-span-2",
        bg: "bg-gradient-to-br from-purple-900/20 to-blue-900/20",
        tech: ["React", "Node.js", "Python"]
    },
    {
        title: "Mobile Evolution",
        description: "Native and cross-platform apps designed for maximum user engagement and retention.",
        icon: Smartphone,
        colSpan: "md:col-span-1",
        bg: "bg-gradient-to-br from-orange-900/20 to-red-900/20",
        tech: ["Flutter", "Swift", "Kotlin"]
    },
    {
        title: "Web Platforms",
        description: "High-performance web applications built with Next.js and modern edge technologies.",
        icon: Globe,
        colSpan: "md:col-span-1",
        bg: "bg-gradient-to-br from-green-900/20 to-emerald-900/20",
        tech: ["Next.js", "Vercel", "Tailwind"]
    },
    {
        title: "Cloud Infrastructure",
        description: "Scalable cloud architectures on AWS/Azure ensuring 99.99% uptime and security.",
        icon: Database,
        colSpan: "md:col-span-2",
        bg: "bg-gradient-to-br from-blue-900/20 to-cyan-900/20",
        tech: ["AWS", "Docker", "Kubernetes"]
    },
    {
        title: "AI Integration",
        description: "Leveraging LLMs and machine learning to automate workflows and generate insights.",
        icon: Cpu,
        colSpan: "md:col-span-3",
        bg: "bg-gradient-to-br from-pink-900/20 to-rose-900/20",
        tech: ["OpenAI", "TensorFlow", "PyTorch"]
    },
];

function ServiceCard({ service, index }: { service: any; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const xSpring = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(mouseY, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);

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
            <div className={`relative h-full border border-white/5 bg-[#050505] overflow-hidden rounded-3xl p-8 hover:border-white/10 transition-colors duration-500`}>
                {/* Spotlight Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])},
                                rgba(255, 255, 255, 0.05),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${service.bg} blur-3xl`} />

                <div className="relative z-10 h-full flex flex-col justify-between transform-gpu translate-z-10">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/50 text-white">
                            <service.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase mb-3 tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">{service.title}</h3>
                        <p className="text-gray-500 leading-relaxed max-w-md group-hover:text-gray-300 transition-colors duration-300">{service.description}</p>
                    </div>

                    <div className="mt-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {service.tech.map((t: string) => (
                                <span key={t} className="text-xs font-mono px-2 py-1 rounded border border-white/10 bg-white/5 text-gray-400 group-hover:border-white/20 group-hover:text-white transition-colors">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <span>EXPLORE</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

import { ArrowUpRight } from "lucide-react";

export default function Services() {
    return (
        <section id="services" className="py-32 bg-[#030303] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-shivkara-orange font-mono text-sm tracking-widest uppercase mb-4">/// Capabilities</h3>
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none text-white tracking-tighter">
                            System <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Architecture</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-500 max-w-md text-lg pb-2 border-b border-white/10 font-light"
                    >
                        Engineering digital dominance through cutting-edge technology and precision design.
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
