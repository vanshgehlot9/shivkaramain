import React from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Function to create a 3D cube geometry and materials
const createCubeGeometry = (size = 1) => {
  return new THREE.BoxGeometry(size, size, size);
};

// Function to create a material with color
const createCubeMaterial = (color = 0x3b82f6) => {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.3,
    roughness: 0.4,
  });
};

// 3D animated cube component that renders in the hero section
export function Hero3DCube({
  position = 'absolute top-40 right-20 z-10',
  size = '100px',
  colors = ['#3b82f6', '#6366f1', '#8b5cf6']
}) {
  return (
    <motion.div
      className={`${position} w-[${size}] h-[${size}] preserve-3d pointer-events-none`}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        rotateZ: [0, 360]
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }}
    >
      <div className="relative w-full h-full preserve-3d">
        {/* Front face */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-60" 
             style={{ transform: 'translateZ(50px)' }} />
        
        {/* Back face */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-60" 
             style={{ transform: 'rotateY(180deg) translateZ(50px)' }} />
        
        {/* Left face */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-60" 
             style={{ transform: 'rotateY(-90deg) translateZ(50px)' }} />
        
        {/* Right face */}
        <div className="absolute inset-0 bg-gradient-to-l from-indigo-600 to-blue-600 opacity-60" 
             style={{ transform: 'rotateY(90deg) translateZ(50px)' }} />
        
        {/* Top face */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-indigo-600 opacity-60" 
             style={{ transform: 'rotateX(90deg) translateZ(50px)' }} />
        
        {/* Bottom face */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-purple-600 opacity-60" 
             style={{ transform: 'rotateX(-90deg) translateZ(50px)' }} />
      </div>
    </motion.div>
  );
}

// 3D floating sphere component
export function Hero3DSphere({
  position = 'absolute bottom-40 left-20 z-10',
  size = '80px',
  color = '#3b82f6',
  opacity = 0.6
}) {
  return (
    <motion.div
      className={`${position} w-[${size}] h-[${size}] rounded-full pointer-events-none`}
      animate={{
        y: [0, -15, 0],
        x: [0, 10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity
      }}
    >
      <div className="relative w-full h-full">
        {/* Sphere with gradient */}
        <div className={`absolute inset-0 rounded-full bg-gradient-radial from-${color}-300/40 to-${color}-700/70 opacity-${opacity * 100}`} />
        
        {/* Highlight */}
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 rounded-full bg-white opacity-30" />
        
        {/* Shadow effect */}
        <motion.div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/20 rounded-full blur-md"
          animate={{
            width: ['70%', '85%', '70%'],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
        
        {/* Orbit ring */}
        <motion.div
          className="absolute inset-[-10px] rounded-full border border-blue-400/20"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity
          }}
        />
      </div>
    </motion.div>
  );
}

// 3D floating pyramid
export function Hero3DPyramid({
  position = 'absolute top-1/3 left-1/4 z-10',
  size = '60px',
  colors = ['#3b82f6', '#4f46e5', '#6366f1']
}) {
  return (
    <motion.div
      className={`${position} w-[${size}] h-[${size}] preserve-3d pointer-events-none`}
      animate={{
        rotateX: [15, 25, 15],
        rotateY: [0, 360, 0],
        rotateZ: [5, -5, 5]
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }}
    >
      <div className="relative w-full h-full preserve-3d">
        {/* Base of pyramid */}
        <div
          className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-br from-blue-700 to-indigo-700 opacity-60"
          style={{ transform: 'rotateX(90deg) translateZ(-30px) translateY(-30px)' }}
        />
        
        {/* Side 1 */}
        <div
          className="absolute bottom-0 left-0 w-full h-full origin-bottom"
          style={{
            transform: 'rotateX(30deg)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            background: `linear-gradient(to top, ${colors[0]}, ${colors[1]})`,
            opacity: 0.7
          }}
        />
        
        {/* Side 2 */}
        <div
          className="absolute bottom-0 left-0 w-full h-full origin-bottom"
          style={{
            transform: 'rotateX(30deg) rotateY(90deg) translateX(30px)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            background: `linear-gradient(to top, ${colors[1]}, ${colors[2]})`,
            opacity: 0.7
          }}
        />
        
        {/* Side 3 */}
        <div
          className="absolute bottom-0 left-0 w-full h-full origin-bottom"
          style={{
            transform: 'rotateX(30deg) rotateY(180deg)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            background: `linear-gradient(to top, ${colors[2]}, ${colors[0]})`,
            opacity: 0.7
          }}
        />
        
        {/* Side 4 */}
        <div
          className="absolute bottom-0 left-0 w-full h-full origin-bottom"
          style={{
            transform: 'rotateX(30deg) rotateY(270deg) translateX(-30px)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            background: `linear-gradient(to top, ${colors[0]}, ${colors[2]})`,
            opacity: 0.7
          }}
        />
      </div>
    </motion.div>
  );
}

// Export all 3D hero elements
export { createCubeGeometry, createCubeMaterial };
