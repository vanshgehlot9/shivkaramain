import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Eye, TrendingUp, Clock, DollarSign, Users, Star, ChevronRight, Play, Code, Award } from 'lucide-react';

interface CaseStudyCardProps {
  project: any;
  index: number;
}

export function CaseStudyCard({ project, index }: CaseStudyCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (project.screenshots) {
      setCurrentImageIndex((prev) => 
        prev === project.screenshots.length ? 0 : prev + 1
      );
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      {/* Project Image with Overlay */}
      <div className="relative h-64 overflow-hidden group">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay with Quick Stats */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-2 gap-2 text-white text-sm">
              {project.results && (
                <>
                  <div className="bg-green-500/90 rounded-lg p-2 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-bold">{String(Object.values(project.results)[0])}</span>
                  </div>
                  <div className="bg-blue-500/90 rounded-lg p-2 text-center">
                    <DollarSign className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-bold">{project.budget}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Play Button for Case Study */}
        <button
          onClick={() => setShowDetails(true)}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Play className="w-8 h-8 text-blue-600 ml-1" />
        </button>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {project.type}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        {/* Client Info */}
        {project.client && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {project.client.company.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{project.client.company}</h4>
              <p className="text-sm text-gray-600">{project.client.location}</p>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

        {/* Key Results */}
        {project.results && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.entries(project.results).slice(0, 2).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{String(value)}</div>
                <div className="text-xs text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 3).map((tech: string) => (
            <span key={tech} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              +{project.tech.length - 3} more
            </span>
          )}
        </div>

        {/* Timeline and Budget */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{project.timeline || '8-12 weeks'}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{project.budget || 'Custom Quote'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => window.open(project.demoLink, '_blank')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink className="w-4 h-4" />
            View Live
          </motion.button>
          <motion.button
            onClick={() => setShowDetails(true)}
            className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-4 h-4" />
            Case Study
          </motion.button>
        </div>
      </div>

      {/* Detailed Case Study Modal */}
      <AnimatePresence>
        {showDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
                    <p className="text-gray-600">{project.client?.company} - {project.client?.location}</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Before/After Images */}
                  {project.beforeAfter && (
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="text-lg font-semibold mb-3 text-red-600">Before</h4>
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={project.beforeAfter.before}
                            alt="Before"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-3 text-green-600">After</h4>
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={project.beforeAfter.after}
                            alt="After"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Grid */}
                  {project.results && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        Project Results
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {Object.entries(project.results).map(([key, value]) => (
                          <div key={key} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{String(value)}</div>
                            <div className="text-sm text-green-800 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack */}
                  {project.techStack && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-600" />
                        Technology Stack
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {project.techStack.map((item: any, index: number) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-semibold text-blue-900 mb-2">{item.name}</h5>
                            <p className="text-blue-700 text-sm">{item.tech}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Client Testimonial */}
                  {project.testimonial && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-blue-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-lg italic text-gray-700 mb-4">
                        "{project.testimonial}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {project.client?.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{project.client?.name}</div>
                          <div className="text-gray-600">{project.client?.company}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Timeline & Budget */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 mb-2">Project Timeline</h5>
                      <p className="text-blue-700">{project.timeline}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-900 mb-2">Investment</h5>
                      <p className="text-green-700">{project.budget}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
