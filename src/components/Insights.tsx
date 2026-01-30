"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const posts = [
    {
        title: "The Future of AI in Enterprise Software",
        excerpt: "How Large Language Models are reshaping business logic and automating complex workflows.",
        category: "Artificial Intelligence",
        date: "Oct 12, 2024",
        author: "Vansh Gehlot",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Scalable Microservices Architecture",
        excerpt: "Best practices for breaking down monolithic applications into resilient, independent services.",
        category: "Engineering",
        date: "Sep 28, 2024",
        author: "Shubham Dadhich",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Optimizing Next.js for Performance",
        excerpt: "Deep dive into server components, edge caching, and image optimization strategies.",
        category: "Development",
        date: "Sep 15, 2024",
        author: "Virender Parihar",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
    }
];

export default function Insights() {
    return (
        <section className="py-32 bg-[#030303] relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Thoughts</span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                            Latest <span className="text-gray-600">Insights</span>
                        </h2>
                    </div>

                    <Link href="/blog" className="group flex items-center gap-2 text-white font-bold uppercase tracking-wider hover:text-shivkara-orange transition-colors">
                        View All Articles <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-[250px] mb-6 rounded-2xl overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500" />

                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                                    <Tag className="w-3 h-3 text-shivkara-orange" />
                                    <span className="text-xs font-mono text-white uppercase tracking-wider">{post.category}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {post.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {post.author}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-shivkara-orange transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center gap-2 text-shivkara-orange text-sm font-bold uppercase tracking-widest opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                Read More <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
