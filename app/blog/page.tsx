"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserIcon, TagIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  readTime: string;
  tags: string[];
  category: string;
  featured: boolean;
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
}

const SUGGESTED_BLOG_POSTS = [
  {
    id: 'outsource-app-development-jodhpur',
    title: 'Why Outsource App Development to Jodhpur? Cost Benefits & Quality Assurance',
    excerpt: 'Discover why Jodhpur is becoming a preferred destination for outsourcing mobile app development. Learn about cost benefits, quality standards, and how local expertise can transform your business.',
    author: 'Shivkara Digitals Team',
    publishedAt: new Date('2024-01-15'),
    readTime: '8 min read',
    tags: ['Outsourcing', 'Mobile Development', 'Cost Benefits', 'Jodhpur'],
    category: 'Business Strategy',
    featured: true,
    seoTitle: 'Outsource App Development to Jodhpur - Cost Benefits & Quality | Shivkara Digitals',
    metaDescription: 'Learn why outsourcing app development to Jodhpur offers 60% cost savings with world-class quality. Discover local expertise, time zone advantages, and success stories.',
    slug: 'outsource-app-development-jodhpur'
  },
  {
    id: 'offshore-development-india-benefits',
    title: 'Cost Benefits of Offshore Development from India: A Complete Guide',
    excerpt: 'Comprehensive analysis of offshore software development from India. Explore cost savings, quality metrics, cultural compatibility, and best practices for successful partnerships.',
    author: 'Tech Strategy Team',
    publishedAt: new Date('2024-01-20'),
    readTime: '12 min read',
    tags: ['Offshore Development', 'Cost Analysis', 'India', 'Software Development'],
    category: 'Development Strategy',
    featured: true,
    seoTitle: 'Offshore Development India: Cost Benefits & Quality Analysis | Shivkara Digitals',
    metaDescription: 'Complete guide to offshore software development from India. Discover 40-60% cost savings, quality standards, and how to choose the right development partner.',
    slug: 'offshore-development-india-benefits'
  },
  {
    id: 'rajasthan-tech-ecosystem-2024',
    title: 'Rajasthan\'s Growing Tech Ecosystem: Opportunities for Startups in 2024',
    excerpt: 'Explore Rajasthan\'s emerging technology landscape. From government initiatives to startup incubators, discover why Rajasthan is becoming a tech hub for innovative companies.',
    author: 'Industry Analysis Team',
    publishedAt: new Date('2024-02-01'),
    readTime: '10 min read',
    tags: ['Rajasthan', 'Tech Ecosystem', 'Startups', 'Government Policy'],
    category: 'Industry Analysis',
    featured: false,
    seoTitle: 'Rajasthan Tech Ecosystem 2024: Startup Opportunities & Growth | Shivkara Digitals',
    metaDescription: 'Discover Rajasthan\'s booming tech ecosystem. Learn about startup incentives, government support, infrastructure development, and emerging opportunities in 2024.',
    slug: 'rajasthan-tech-ecosystem-2024'
  },
  {
    id: 'react-native-vs-flutter-2024',
    title: 'React Native vs Flutter 2024: Complete Comparison for Business Owners',
    excerpt: 'Detailed comparison of React Native and Flutter for cross-platform mobile development. Performance, cost, development time, and use case analysis for informed decision making.',
    author: 'Mobile Development Team',
    publishedAt: new Date('2024-02-05'),
    readTime: '15 min read',
    tags: ['React Native', 'Flutter', 'Mobile Development', 'Technology Comparison'],
    category: 'Technology',
    featured: false,
    seoTitle: 'React Native vs Flutter 2024: Complete Business Comparison | Shivkara Digitals',
    metaDescription: 'Compare React Native vs Flutter for your mobile app project. Performance analysis, cost comparison, development time, and expert recommendations for business owners.',
    slug: 'react-native-vs-flutter-2024'
  },
  {
    id: 'digital-transformation-small-business',
    title: 'Digital Transformation for Small Businesses: A Step-by-Step Guide',
    excerpt: 'Practical roadmap for small businesses to embrace digital transformation. From basic automation to advanced solutions, learn how to modernize your operations cost-effectively.',
    author: 'Business Solutions Team',
    publishedAt: new Date('2024-02-10'),
    readTime: '11 min read',
    tags: ['Digital Transformation', 'Small Business', 'Automation', 'Process Optimization'],
    category: 'Business Strategy',
    featured: false,
    seoTitle: 'Digital Transformation for Small Business: Complete Guide | Shivkara Digitals',
    metaDescription: 'Step-by-step digital transformation guide for small businesses. Learn cost-effective strategies, implementation roadmap, and ROI optimization techniques.',
    slug: 'digital-transformation-small-business'
  }
];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(SUGGESTED_BLOG_POSTS);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(SUGGESTED_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Business Strategy', 'Technology', 'Development Strategy', 'Industry Analysis'];

  useEffect(() => {
    // Try to fetch from Firebase, fallback to suggested posts
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'blog-posts'), orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedAt: doc.data().publishedAt?.toDate() || new Date()
          })) as BlogPost[];
          
          setBlogPosts(posts);
          setFilteredPosts(posts);
        }
      } catch (error) {
        console.log('Using suggested blog posts');
        // Keep using suggested posts if Firebase fails
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm, blogPosts]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header currentPage="blog" />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Insights</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Expert insights on software development, digital transformation, and technology trends from Jodhpur's leading development company
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {post.featured && (
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 inline-block">
                        FEATURED
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <TagIcon className="w-4 h-4" />
                        <span className="text-blue-600 font-medium">{post.category}</span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug || post.id}`}
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                      >
                        Read Full Article →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {filteredPosts.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filter options.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
