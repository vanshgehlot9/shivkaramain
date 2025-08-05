"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

const projects = [
  {
    name: "Jeerihaveli",
    type: "Hotel Website",
    description: "A modern, responsive website for Jeerihaveli hotel, showcasing rooms, amenities, and online booking.",
    features: [
      "Responsive design for all devices",
      "Online room booking integration",
      "Photo gallery and amenities showcase",
    ],
    image: "/project/jeerihaveli.png",
    screenshots: ["/project/jeerihaveli1.png", "/project/jeerihaveli2.png"],
    cta: "View Project",
    ctaLink: "#",
    label: "2024"
  },
  {
    name: "Tree Nuts",
    type: "E-commerce Store",
    description: "A full-featured e-commerce platform for Tree Nuts, including product catalog, cart, and checkout.",
    features: [
      "Product catalog & filtering",
      "Secure checkout & payments",
      "Order tracking dashboard",
    ],
    image: "/project/treenut.png",
    screenshots: ["/project/treenut1.png", "/project/treenut2.png"],
    cta: "View Project",
    ctaLink: "#",
    label: "2024"
  },
  {
    name: "Jodhpur Bombay Roadway",
    type: "Logistics Platform",
    description: "Comprehensive logistics management system with route optimization, real-time tracking, and fleet management.",
    features: [
      "Route optimization",
      "Real-time vehicle tracking",
      "Fleet management dashboard",
    ],
    image: "/project/jodhpur.png",
    screenshots: ["/project/jodhpur1.png", "/project/jodhpur2.png", "/project/jodhpur3.png"],
    cta: "View Project",
    ctaLink: "#",
    label: "2024"
  },
  {
    name: "Pigo Taxi Admin",
    type: "Admin APK",
    description: "Admin panel APK for Pigo Taxi, enabling management of drivers, rides, and analytics.",
    features: [
      "Driver & ride management",
      "Live analytics dashboard",
      "Push notifications",
    ],
    image: "/project/pigo.jpeg",
    screenshots: ["/project/pigo1.jpeg"],
    cta: "View Project",
    ctaLink: "#",
    label: "2023"
  },
  {
    name: "Vehicle on Rent",
    type: "Rental APK",
    description: "Mobile app for renting vehicles, with real-time availability and booking.",
    features: [
      "Vehicle availability calendar",
      "Instant booking system",
      "User reviews & ratings",
    ],
    image: "/project/vor.jpeg",
    screenshots: ["/project/vor1.jpeg", "/project/vor2.jpeg", "/project/vor3.jpeg", "/project/vor4.jpeg", "/project/vor5.jpeg"],
    cta: "View Project",
    ctaLink: "#",
    label: "2023"
  },
  {
    name: "NikkiFashion",
    type: "E-Commerce Platform",
    description: "Complete fashion e-commerce platform with advanced product catalog, size management, and payment processing.",
    features: [
      "Advanced product catalog",
      "Size management",
      "Payment processing",
      "Inventory tracking",
    ],
    image: "/project/nikkifashion.png",
    screenshots: ["/project/nikkifashion1.png"],
    cta: "View Project",
    ctaLink: "#",
    label: "2024"
  },
];

const fadeIn: Record<string, any> = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: { delay: custom, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const fadeInUp: Record<string, any> = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const zoomIn: Record<string, any> = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: custom, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const slideInLeft: Record<string, any> = {
  hidden: { opacity: 0, x: -48 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: custom, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const slideInRight: Record<string, any> = {
  hidden: { opacity: 0, x: 48 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: custom, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openProjectModal = (project: any) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      const allImages = [selectedProject.image, ...selectedProject.screenshots];
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      const allImages = [selectedProject.image, ...selectedProject.screenshots];
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <motion.section
      className="py-20 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeIn}
      custom={0}
    >
      <motion.p
        className="text-center text-sm font-semibold text-blue-600 tracking-widest mb-2"
        variants={fadeInUp}
        custom={0.2}
      >
        REAL-WORLD RESULTS
      </motion.p>
      <motion.h2
        className="text-4xl font-bold text-center mb-3"
        variants={zoomIn}
        custom={0.3}
      >
        Featured Projects
      </motion.h2>
      <motion.p
        className="text-center text-gray-500 max-w-xl mx-auto mb-12"
        variants={fadeIn}
        custom={0.35}
      >
        See how we transformed concepts into engaging digital experiences for our clients.
      </motion.p>
      <div className="space-y-16 max-w-4xl mx-auto">
        {projects.map((project, idx) => (
          <div
            key={project.name}
            className="flex flex-col md:flex-row items-center md:items-stretch bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Left Panel */}
            <motion.div
              className="flex-1 p-8 flex flex-col justify-center"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.45}
            >
              <span className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">{project.label}</span>
              <h3 className="text-2xl font-semibold mb-2">{project.name}</h3>
              <span className="text-blue-600 font-medium text-sm mb-2 block">{project.type}</span>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <ul className="mb-6 space-y-2">
                {project.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    className="flex items-start text-gray-700"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    custom={0.55 + i * 0.1}
                  >
                    <span className="mr-2 mt-1 text-blue-500">•</span> {feature}
                  </motion.li>
                ))}
              </ul>
              <motion.button
                onClick={() => openProjectModal(project)}
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
                variants={zoomIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={0.85}
                whileHover={{ scale: 1.08, boxShadow: "0 4px 24px rgba(37, 99, 235, 0.15)" }}
              >
                {project.cta} ↗
              </motion.button>
            </motion.div>
            {/* Right Panel */}
            <motion.div
              className="flex-1 min-h-[220px] relative"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.45}
            >
              <Image
                src={project.image}
                alt={project.name}
                width={400}
                height={300}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
                className="md:rounded-r-2xl md:rounded-bl-none rounded-b-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={idx === 0}
                onClick={() => openProjectModal(project)}
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h3>
                  <p className="text-gray-600">{selectedProject.type}</p>
                </div>
                <button
                  onClick={closeProjectModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image Gallery */}
              <div className="relative">
                <div className="relative h-96">
                  {(() => {
                    const allImages = [selectedProject.image, ...selectedProject.screenshots];
                    const currentImage = allImages[currentImageIndex];
                    return (
                      <Image
                        src={currentImage}
                        alt={`${selectedProject.name} - Image ${currentImageIndex + 1}`}
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-4"
                      />
                    );
                  })()}
                </div>

                {/* Navigation Arrows */}
                {(() => {
                  const allImages = [selectedProject.image, ...selectedProject.screenshots];
                  if (allImages.length > 1) {
                    return (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          →
                        </button>
                      </>
                    );
                  }
                  return null;
                })()}

                {/* Image Counter */}
                {(() => {
                  const allImages = [selectedProject.image, ...selectedProject.screenshots];
                  if (allImages.length > 1) {
                    return (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
} 