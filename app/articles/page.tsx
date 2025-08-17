"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import { X, Clock, User, Tag, Calendar, Search, Filter } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActionButton from "../../components/FloatingActionButton";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  content?: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const fetchArticles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const articlesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      
      setArticles(articlesData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(articlesData.map(article => article.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  };

  const openArticleModal = (article: Article) => {
    setSelectedArticle(article);
    document.body.style.overflow = 'hidden';
  };

  const closeArticleModal = () => {
    setSelectedArticle(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-very-light-pink via-white to-very-light-pink pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lavender"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header currentPage="articles" />
      <div className="min-h-screen bg-gradient-to-br from-very-light-pink via-white to-very-light-pink pt-32">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent mb-4">
              All Articles
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover insights, tutorials, and industry knowledge from our expert team
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lavender focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lavender focus:border-transparent transition-all duration-300 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => openArticleModal(article)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.jpg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-sm text-gray-800 font-medium px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {article.date}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-lavender transition-colors duration-300">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{article.author}</span>
                      </div>
                      
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {article.tags.slice(0, 2).join(', ')}
                            {article.tags.length > 2 && '...'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer currentPage="articles" />
      <FloatingActionButton />

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeArticleModal}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeArticleModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Article Image */}
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <Image
                  src={selectedArticle.image || "/placeholder.jpg"}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm text-sm text-gray-800 font-medium px-3 py-1 rounded-full">
                    {selectedArticle.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedArticle.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {selectedArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {selectedArticle.author}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {selectedArticle.title}
                </h1>

                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {selectedArticle.excerpt}
                  </p>
                  
                  {/* You can add full article content here */}
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {selectedArticle.content ? (
                      <div className="whitespace-pre-wrap">
                        {selectedArticle.content}
                      </div>
                    ) : (
                      <>
                        <p>
                          This is where the full article content would be displayed. 
                          You can expand the article data structure to include a 'content' field 
                          with the full article text, images, and formatting.
                        </p>
                        <p>
                          For now, this shows the excerpt and basic article information. 
                          To add full content, modify the add-article form to include a rich text editor 
                          or markdown field for the complete article content.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
