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
  itemsPerView: defaultItemsPerView = 6
}: TechSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(defaultItemsPerView);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 640) {
        setItemsPerView(2);
      } else if (width < 768) {
        setItemsPerView(3);
      } else if (width < 1024) {
        setItemsPerView(4);
      } else {
        setItemsPerView(defaultItemsPerView);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultItemsPerView]);

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
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Main Slider */}
      <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
        {/* Technology Grid */}
        <div className="p-4 sm:p-6 md:p-8">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
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
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 text-center group-hover:scale-105">
                  <motion.div 
                    className="text-gray-600 group-hover:text-lavender transition-colors mb-2 sm:mb-3 flex justify-center"
                    style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                      transition: { duration: 0.6, type: "spring" }
                    }}
                    animate={{
                      y: [0, -5, 0],
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.15
                    }}
                  >
                    {tech.icon}
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{tech.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{tech.category}</p>
                </div>
                
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-lavender/20 to-pink/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                  initial={{ scale: 0.8, rotate: -5 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: 0,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-lavender transition-all z-10 border border-gray-200/50"
          whileHover={{ 
            scale: 1.1, 
            x: -2,
            backgroundColor: "rgba(255, 255, 255, 0.95)"
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-lavender transition-all z-10 border border-gray-200/50"
          whileHover={{ 
            scale: 1.1, 
            x: 2,
            backgroundColor: "rgba(255, 255, 255, 0.95)"
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 sm:mt-6 space-x-2 sm:space-x-3">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-300 relative ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-lavender to-pink scale-110' 
                : 'bg-gray-300/50 hover:bg-gray-400/70'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender to-pink opacity-50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 sm:mt-6 w-full bg-gray-200/50 rounded-full h-1.5 sm:h-2 overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-lavender via-pink to-lavender bg-[length:200%] rounded-full"
          initial={{ width: "0%", backgroundPosition: "0% 50%" }}
          animate={{ 
            width: `${((currentIndex + 1) / totalSlides) * 100}%`,
            backgroundPosition: ["0% 50%", "100% 50%"]
          }}
          transition={{ 
            width: { duration: 0.5, ease: "easeInOut" },
            backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 font-medium">
        <motion.span 
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lavender"
        >
          {currentIndex + 1}
        </motion.span>
        <span className="mx-2 opacity-50">/</span>
        <span>{totalSlides}</span>
      </div>
    </div>
  );
}

 