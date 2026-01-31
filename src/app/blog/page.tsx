"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseBackground from "@/components/ui/NoiseBackground";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";

export default function BlogListing() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", "Tech", "Business", "Design", "Shivkara"];

    const filteredPosts = selectedCategory === "All"
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <NoiseBackground />
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-6">
                {/* Header */}
                <div className="mb-16 border-b border-white/10 pb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6"
                    >
                        INSIGHTS
                    </motion.h1>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
                            Thoughts on <span className="text-white">Engineering</span>, <span className="text-white">Design Systems</span>, and the future of the <span className="text-white">Digital Experience</span>.
                        </p>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wider border transition-all duration-300 ${selectedCategory === cat
                                            ? "bg-shivkara-orange text-black border-shivkara-orange"
                                            : "bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`} className="group block h-full">
                                <article className="h-full flex flex-col bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-shivkara-orange/30 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden relative">
                                    {/* Image */}
                                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 relative">
                                        <div className="absolute inset-0 bg-shivkara-orange/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                                        />
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-4">
                                        <span className="text-shivkara-orange">{post.category}</span>
                                        <span>{post.readTime}</span>
                                    </div>

                                    {/* Content */}
                                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-shivkara-orange transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed mb-6 line-clamp-3 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-white/10" />
                                            <span className="text-xs text-gray-300">{post.author}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-shivkara-orange group-hover:text-black group-hover:border-shivkara-orange transition-all duration-300">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
