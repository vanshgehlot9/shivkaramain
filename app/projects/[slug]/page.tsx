"use client";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { projects } from "../../../lib/projects";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Play, Calendar, Clock, Users, Code, CheckCircle, Award, Star } from "lucide-react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const project = useMemo(() => projects.find(p => p.slug === slug), [slug]);
  const [current, setCurrent] = useState(0);

  if (!project) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-very-light-pink via-white to-light-pink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <motion.h1 
            className="text-3xl font-bold mb-4 text-gray-900"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Project Not Found
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The project you're looking for doesn't exist.
          </motion.p>
          <motion.button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-lavender to-pink text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go back home</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const screenshots = project.screenshots || [];
  const goNext = () => setCurrent((c) => (c + 1) % screenshots.length);
  const goPrev = () => setCurrent((c) => (c - 1 + screenshots.length) % screenshots.length);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-very-light-pink via-white to-light-pink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-700 hover:text-lavender transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Projects</span>
            </motion.button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Shivkara Digitals</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Project Header */}
          <div className="bg-gradient-to-r from-lavender/10 to-pink/10 p-8 border-b border-gray-100">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-lavender to-pink rounded-xl flex items-center justify-center text-white">
                  <Code className="w-6 h-6" />
                </div>
                <span className="text-lavender font-semibold">{project.type}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                {project.name}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Project Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-lavender to-pink rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{project.features?.length || 0}</div>
                  <div className="text-sm text-gray-600">Features</div>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-lavender to-pink rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <Code className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{project.tech.length}</div>
                  <div className="text-sm text-gray-600">Technologies</div>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-lavender to-pink rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">5.0</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-lavender to-pink rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Success</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="p-8">
            {/* Screenshots Carousel */}
            <motion.div 
              className="mb-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Project Screenshots</h2>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-lavender/20 h-80 flex items-center justify-center bg-gradient-to-br from-lavender/5 to-pink/5">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full flex items-center justify-center absolute top-0 left-0"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-lavender to-pink rounded-2xl flex items-center justify-center text-white text-2xl">
                        🚀
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Carousel Controls */}
                {screenshots.length > 1 && (
                  <>
                    <motion.button 
                      onClick={goPrev} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-lavender text-lavender hover:text-white rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      &#8592;
                    </motion.button>
                    <motion.button 
                      onClick={goNext} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-lavender text-lavender hover:text-white rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      &#8594;
                    </motion.button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {screenshots.map((_, idx) => (
                        <motion.button
                          key={idx}
                          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                            idx === current ? 'bg-lavender border-lavender scale-125' : 'bg-white border-gray-300 hover:border-lavender'
                          }`}
                          onClick={() => setCurrent(idx)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Tech Stack */}
              <motion.div 
                className="space-y-6"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center space-x-2">
                    <Code className="w-6 h-6 text-lavender" />
                    <span>Technology Stack</span>
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((tech) => (
                      <motion.span 
                        key={tech} 
                        className="px-4 py-2 bg-gradient-to-r from-lavender/10 to-pink/10 text-gray-700 text-sm rounded-full border border-lavender/20 hover:border-lavender/40 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-lavender" />
                    <span>Key Features</span>
                  </h2>
                  <ul className="space-y-3">
                    {project.features?.map((feature, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start space-x-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-lavender rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Challenges & Solutions */}
              <motion.div 
                className="space-y-6"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {project.challenges && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center space-x-2">
                      <Award className="w-6 h-6 text-lavender" />
                      <span>Challenges & Solutions</span>
                    </h2>
                    <ul className="space-y-3">
                      {project.challenges.map((challenge, idx) => (
                        <motion.li 
                          key={idx} 
                          className="flex items-start space-x-3"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-pink rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{challenge}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Project Links */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center space-x-2">
                    <ExternalLink className="w-6 h-6 text-lavender" />
                    <span>Project Links</span>
                  </h2>
                  <div className="space-y-3">
                    {project.demoLink && project.demoLink !== "#" && (
                      <motion.a 
                        href={project.demoLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-lavender/10 to-pink/10 rounded-xl hover:from-lavender/20 hover:to-pink/20 transition-all duration-300 border border-lavender/20"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play className="w-5 h-5 text-lavender" />
                        <span className="font-medium text-gray-700">Live Demo</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </motion.a>
                    )}
                    {project.repoLink && project.repoLink !== "#" && (
                      <motion.a 
                        href={project.repoLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-lavender/10 to-pink/10 rounded-xl hover:from-lavender/20 hover:to-pink/20 transition-all duration-300 border border-lavender/20"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="w-5 h-5 text-lavender" />
                        <span className="text-gray-700">Source Code</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-gray-200"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-lavender to-pink text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Projects</span>
              </motion.button>
              
              <motion.button
                onClick={() => router.push('/#contact')}
                className="bg-white border-2 border-lavender text-lavender px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Similar Project</span>
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 