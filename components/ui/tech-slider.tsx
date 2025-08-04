"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TechItem {
  name: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

interface TechSliderProps {
  technologies: TechItem[];
  itemsPerView?: number;
}

export function TechSlider({ 
  technologies, 
  itemsPerView = 6
}: TechSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = Math.ceil(technologies.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTechnologies = technologies.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Slider */}
      <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50">


        {/* Technology Grid */}
        <div className="p-8">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {currentTechnologies.map((tech, index) => (
              <motion.div
                key={`${currentIndex}-${tech.name}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="group relative"
              >
                <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group-hover:scale-105">
                  <motion.div 
                    className="text-gray-600 group-hover:text-lavender transition-colors mb-3 flex justify-center"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    {tech.icon}
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{tech.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{tech.category}</p>
                </div>
                
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-lavender/10 to-pink/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-lavender transition-colors z-10"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-lavender transition-colors z-10"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-lavender to-pink scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-lavender to-pink rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4 text-sm text-gray-600">
        <span className="font-medium">{currentIndex + 1}</span>
        <span className="mx-2">/</span>
        <span>{totalSlides}</span>
      </div>
    </div>
  );
}

 