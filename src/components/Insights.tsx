"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";

export default function Insights() {
    const posts = blogPosts.slice(0, 3);

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

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <Link href={`/blog/${post.slug}`} className="block">
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
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Scroll */}
                <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-2 no-scrollbar flex gap-4">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="w-[300px] flex-shrink-0 snap-center"
                        >
                            <div className="relative h-[200px] mb-4 rounded-2xl overflow-hidden border border-white/10">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                                    <Tag className="w-3 h-3 text-shivkara-orange" />
                                    <span className="text-[10px] font-mono text-white uppercase tracking-wider">{post.category}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {post.date}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                                {post.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
