"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Article {
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

interface Articles {
  [key: string]: Article;
}

// This would typically come from a CMS or API
const articles: Articles = {
  "the-evolution-of-modern-web-development": {
    title: "The Evolution of Modern Web Development",
    content: `Modern web development has come a long way from the days of static HTML pages. This evolution has been driven by changing user expectations, technological advancements, and the need for more interactive and dynamic web applications.

In the early days of the web, pages were simple documents linked together. Today, we build complex applications that run in the browser, offering desktop-like experiences with instant updates, offline functionality, and rich interactivity.

Key milestones in this evolution include:

1. The Rise of JavaScript Frameworks
- Angular revolutionized front-end development with two-way data binding
- React introduced the virtual DOM and component-based architecture
- Vue.js combined the best aspects of both while remaining lightweight

2. Modern Build Tools and Workflows
- Webpack and other bundlers optimize code delivery
- ESNext features are transpiled for broader browser support
- CSS preprocessors and postprocessors enhance styling capabilities

3. API-First Architecture
- RESTful services became the standard for data exchange
- GraphQL introduced more efficient data querying
- Webhooks enable real-time updates and integrations

4. Progressive Web Apps
- Service workers enable offline functionality
- Push notifications increase engagement
- App-like experiences on mobile devices

The future of web development continues to evolve with:
- WebAssembly bringing near-native performance
- Edge computing moving processing closer to users
- AI and ML becoming integral parts of web applications`,
    author: "Sarah Johnson",
    date: "August 1, 2023",
    readTime: "5 min read",
    category: "Web Development",
    image: "/blog/web-dev.jpg",
    tags: ["Web Development", "JavaScript", "Programming", "Technology"]
  },
  // Add more articles here
};

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link href="/articles" className="text-blue-600 hover:text-blue-800">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/articles"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          <header className="mb-8">
            <div className="flex items-center mb-4 space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {article.category}
              </span>
              <span className="text-gray-500">{article.readTime}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <span>By {article.author}</span>
              <span className="mx-2">•</span>
              <time>{article.date}</time>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        </motion.article>
      </div>
    </div>
  );
}
