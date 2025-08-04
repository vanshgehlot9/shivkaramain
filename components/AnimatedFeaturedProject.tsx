"use client";
import React, { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    label: "2024",
    name: "Jeerihaveli",
    type: "Hotel Website",
    description: "A modern, responsive website for Jeerihaveli hotel, showcasing rooms, amenities, and online booking.",
    features: [
      "Responsive design for all devices",
      "Online room booking integration",
      "Photo gallery and amenities showcase",
    ],
    cta: "View Project",
    ctaLink: "#",
  },
  {
    label: "2024",
    name: "Tree Nuts",
    type: "E-commerce Store",
    description: "A full-featured e-commerce platform for Tree Nuts, including product catalog, cart, and checkout.",
    features: [
      "Product catalog & filtering",
      "Secure checkout & payments",
      "Order tracking dashboard",
    ],
    cta: "View Project",
    ctaLink: "#",
  },
  {
    label: "2024",
    name: "Balaji Solar Logistic",
    type: "Logistics UI",
    description: "A logistics management dashboard for Balaji Solar, streamlining operations and tracking.",
    features: [
      "Real-time shipment tracking",
      "Analytics & reporting",
      "User role management",
    ],
    cta: "View Project",
    ctaLink: "#",
  },
  {
    label: "2023",
    name: "Pigo Taxi Admin",
    type: "Admin APK",
    description: "Admin panel APK for Pigo Taxi, enabling management of drivers, rides, and analytics.",
    features: [
      "Driver & ride management",
      "Live analytics dashboard",
      "Push notifications",
    ],
    cta: "View Project",
    ctaLink: "#",
  },
  {
    label: "2023",
    name: "Vehicle on Rent",
    type: "Rental APK",
    description: "Mobile app for renting vehicles, with real-time availability and booking.",
    features: [
      "Vehicle availability calendar",
      "Instant booking system",
      "User reviews & ratings",
    ],
    cta: "View Project",
    ctaLink: "#",
  },
  {
    label: "2023",
    name: "3D Models for Handicraft",
    type: "3D Modeling",
    description: "High-quality 3D models created for handicraft products, enhancing online presentation.",
    features: [
      "Photorealistic 3D renders",
      "Optimized for web & AR",
      "Custom model requests",
    ],
    cta: "View Project",
    ctaLink: "#",
  },
];

export default function AnimatedFeaturedProject() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    sectionRefs.current.forEach((section, idx) => {
      if (!section) return;
      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          section.classList.add("animate-fade-in-up");
        }
      };
      const observer = new window.IntersectionObserver(handleIntersection, {
        threshold: 0.3,
      });
      observer.observe(section);
      return () => observer.disconnect();
    });
  }, []);

  if (!projects.length) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl text-red-500">
        No projects found. Please add your projects.
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-background-subtle">
      {projects.map((project, idx) => (
        <section
          key={project.name}
          ref={el => (sectionRefs.current[idx] = el)}
          className="relative z-10 px-4 py-24 min-h-screen flex items-center justify-center snap-start opacity-0 transition-opacity duration-700"
        >
          <div className="max-w-4xl w-full mx-auto bg-background-card bg-gradient-glass border border-border rounded-3xl overflow-hidden shadow-glass p-10 md:p-16 backdrop-blur-xl">
            <div className="mb-6 text-accent-teal text-sm font-semibold uppercase tracking-wider">
              {project.label} • {project.type}
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text leading-tight drop-shadow-lg">
              {project.name}
            </h2>
            <p className="text-lg text-text-subtle mb-8 font-body">
              {project.description}
            </p>
            <ul className="space-y-3 mb-8">
              {project.features.map((feature, i) => (
                <li key={feature} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-accent-emerald rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-text font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href={project.ctaLink}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent-blue to-accent-emerald hover:from-accent-purple hover:to-accent-teal text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-accent shadow-accent group w-fit text-lg"
            >
              <span>{project.cta}</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      ))}
      <style jsx global>{`
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) scale(1);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        section[style*="opacity: 0"] {
          transform: translateY(40px) scale(0.98);
        }
        body {
          background: #f8fafc;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
} 