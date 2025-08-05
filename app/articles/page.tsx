"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";

const articles = [
  {
    id: 1,
    title: "The Evolution of Modern Web Development",
    excerpt: "Explore the journey from static HTML to modern web frameworks and what's next in web development.",
    date: "August 1, 2023",
    readTime: "5 min read",
    category: "Web Development",
    image: "/blog/web-dev.jpg"
  },
  {
    id: 2,
    title: "Mastering Digital Marketing in 2023",
    excerpt: "Learn the latest strategies and tools that are shaping the future of digital marketing.",
    date: "July 28, 2023",
    readTime: "7 min read",
    category: "Digital Marketing",
    image: "/blog/digital-marketing.jpg"
  },
  {
    id: 3,
    title: "UX Design Principles for Better Conversion",
    excerpt: "Discover how user experience design can significantly improve your website's conversion rates.",
    date: "July 25, 2023",
    readTime: "6 min read",
    category: "UX Design",
    image: "/blog/ux-design.jpg"
  },
  // Add more articles here
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Latest Articles
          </motion.h1>
          <p className="text-xl text-gray-600">
            Insights and guides from our expert team
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.article
              key={article.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {article.category}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{article.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{article.date}</span>
                  <Link
                    href={`/articles/the-evolution-of-modern-web-development`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
