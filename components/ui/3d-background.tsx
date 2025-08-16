import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface ThreeDBackgroundProps {
  className?: string;
  intensity?: number;
  density?: number;
  speed?: number;
  color1?: string;
  color2?: string;
}

export function ThreeDBackground({
  className = '',
  intensity = 0.5,
  density = 15,
  speed = 0.05,
  color1 = '#3b82f6', // Blue
  color2 = '#4f46e5', // Indigo
}: ThreeDBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = density * 1500;
    
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    const color1RGB = new THREE.Color(color1);
    const color2RGB = new THREE.Color(color2);
    
    for (let i = 0; i < particlesCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 50; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
      
      // Color gradient
      const mixFactor = Math.random();
      const color = new THREE.Color().lerpColors(color1RGB, color2RGB, mixFactor);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    pointsRef.current = particles;
    
    // Light to enhance 3D effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation
    const animate = () => {
      if (!pointsRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // Rotate particles
      pointsRef.current.rotation.x += speed * 0.1;
      pointsRef.current.rotation.y += speed * 0.15;
      
      // Render
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Mouse effect
      const mouseX = 0.0005;
      const mouseY = 0.0005;
      pointsRef.current.rotation.x += mouseY * intensity;
      pointsRef.current.rotation.y += mouseX * intensity;
      
      frameId.current = requestAnimationFrame(animate);
    };

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    // Mouse move handler for interactive effect
    const handleMouseMove = (event: MouseEvent) => {
      if (!pointsRef.current) return;
      
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      pointsRef.current.rotation.x += mouseY * 0.001 * intensity;
      pointsRef.current.rotation.y += mouseX * 0.001 * intensity;
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose resources
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose();
        (pointsRef.current.material as THREE.Material).dispose();
      }
    };
  }, [intensity, density, speed, color1, color2]);

  return (
    <motion.div 
      ref={containerRef} 
      className={`absolute inset-0 z-0 ${className}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        pointerEvents: 'none',
        width: '100%',
        height: '100vh'
      }}
    />
  );
}

// Component for 3D animated globe
export function ThreeDGlobe({
  className = '',
  size = '500px',
  position = 'bottom-0 right-0',
  color1 = '#3b82f6', // Blue
  color2 = '#4f46e5', // Indigo
  opacity = 0.3,
}: {
  className?: string;
  size?: string;
  position?: string;
  color1?: string;
  color2?: string;
  opacity?: number;
}) {
  return (
    <motion.div 
      className={`absolute ${position} z-[-1] ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: opacity, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.2 }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-30 blur-3xl" />
        <motion.div 
          className="absolute inset-5 rounded-full bg-gradient-radial from-indigo-200/20 via-blue-500/20 to-transparent"
          animate={{ 
            boxShadow: [
              '0 0 20px 10px rgba(59, 130, 246, 0.3)',
              '0 0 30px 15px rgba(79, 70, 229, 0.3)',
              '0 0 20px 10px rgba(59, 130, 246, 0.3)'
            ]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Grid lines */}
        <div className="absolute inset-0 rounded-full border-[0.5px] border-blue-300/20 animate-spin-slow" style={{ animationDuration: '100s' }} />
        <div className="absolute inset-0 rounded-full border-[0.5px] border-indigo-300/20 animate-spin-slow" style={{ animationDuration: '80s', transform: 'rotate(60deg)' }} />
        <div className="absolute inset-0 rounded-full border-[0.5px] border-blue-300/20 animate-spin-slow" style={{ animationDuration: '120s', transform: 'rotate(120deg)' }} />
        
        {/* Surface detail */}
        <motion.div 
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear", 
            repeatType: "reverse" 
          }}
        >
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-noise" />
        </motion.div>
        
        {/* Highlight */}
        <motion.div 
          className="absolute top-5 left-10 w-20 h-20 bg-white rounded-full blur-xl opacity-20"
          animate={{
            x: [0, 10, 0],
            y: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}

// 3D Floating Tech Cube
export function FloatingTechCube({
  className = '',
  position = 'top-40 left-20',
  size = '100px',
  colors = ['#3b82f6', '#6366f1', '#8b5cf6'],
}: {
  className?: string;
  position?: string;
  size?: string;
  colors?: string[];
}) {
  return (
    <motion.div
      className={`absolute ${position} z-[-1] perspective ${className}`}
      style={{ width: size, height: size }}
      animate={{ 
        rotateX: [0, 360],
        rotateY: [0, 360],
        rotateZ: [0, 360]
      }}
      transition={{ 
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="relative w-full h-full preserve-3d">
        {/* Front face */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br"
          style={{ 
            backgroundImage: `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`,
            opacity: 0.2,
            transform: 'translateZ(50px)'
          }}
          whileHover={{ opacity: 0.3 }}
        />
        
        {/* Back face */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr"
          style={{ 
            backgroundImage: `linear-gradient(to top right, ${colors[1]}, ${colors[2]})`,
            opacity: 0.15,
            transform: 'rotateY(180deg) translateZ(50px)'
          }}
        />
        
        {/* Left face */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r"
          style={{ 
            backgroundImage: `linear-gradient(to right, ${colors[0]}, ${colors[2]})`,
            opacity: 0.15,
            transform: 'rotateY(-90deg) translateZ(50px)'
          }}
        />
        
        {/* Right face */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-l"
          style={{ 
            backgroundImage: `linear-gradient(to left, ${colors[2]}, ${colors[0]})`,
            opacity: 0.15,
            transform: 'rotateY(90deg) translateZ(50px)'
          }}
        />
        
        {/* Top face */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`,
            opacity: 0.15,
            transform: 'rotateX(90deg) translateZ(50px)'
          }}
        />
        
        {/* Bottom face */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t"
          style={{ 
            backgroundImage: `linear-gradient(to top, ${colors[1]}, ${colors[2]})`,
            opacity: 0.15,
            transform: 'rotateX(-90deg) translateZ(50px)'
          }}
        />
      </div>
    </motion.div>
  );
}

// Add global styles to app/globals.css for the 3D effects
// 
// .perspective {
//   perspective: 1000px;
// }
// 
// .preserve-3d {
//   transform-style: preserve-3d;
// }
//
// @keyframes spin-slow {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }
//
// .animate-spin-slow {
//   animation: spin-slow 20s linear infinite;
// }
//
// .bg-noise {
//   background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
// }
