"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function TechyHero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    size: number;
    opacity: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (typeof window !== 'undefined') {
        canvas.width = (typeof window !== 'undefined' ? window.innerWidth : 800);
        canvas.height = (typeof window !== 'undefined' ? window.innerHeight : 600);
      }
    };

    resizeCanvas();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas);
    }

    // Initialize particles
    const particleCount = 150;
    const newParticles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: `hsl(${220 + Math.random() * 40}, 70%, ${60 + Math.random() * 30}%)`
      });
    }

    setParticles(newParticles);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      newParticles.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        if (particle.z < 0 || particle.z > 1000) particle.vz *= -1;

        // 3D projection
        const scale = 300 / (300 + particle.z);
        const x2d = particle.x * scale + canvas.width / 2 * (1 - scale);
        const y2d = particle.y * scale + canvas.height / 2 * (1 - scale);

        // Draw particle with 3D effect
        ctx.beginPath();
        ctx.arc(x2d, y2d, particle.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity * scale;
        ctx.fill();

        // Draw connections between nearby particles
        newParticles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const dz = particle.z - otherParticle.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 120) {
            const otherScale = 300 / (300 + otherParticle.z);
            const otherX2d = otherParticle.x * otherScale + canvas.width / 2 * (1 - otherScale);
            const otherY2d = otherParticle.y * otherScale + canvas.height / 2 * (1 - otherScale);

            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(otherX2d, otherY2d);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * (1 - distance / 120) * scale * otherScale})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

export function FloatingCodeBlocks() {
  const codeSnippets = [
    "const app = () => {",
    "function deploy() {",
    "AI.optimize();",
    "export default",
    "async/await",
    "React.jsx",
    "API.connect()",
    "ML.predict()"
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {codeSnippets.map((code, index) => (
        <motion.div
          key={index}
          className="absolute bg-gray-900/80 backdrop-blur-sm text-green-400 px-3 py-1 rounded-md text-sm font-mono border border-green-500/30"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            opacity: 0,
            scale: 0.8
          }}
          animate={{ 
            x: [
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800)
            ],
            y: [
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600)
            ],
            opacity: [0, 0.7, 0],
            scale: [0.8, 1, 0.8],
            rotate: [0, 360, 720]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: index * 2
          }}
        >
          {code}
        </motion.div>
      ))}
    </div>
  );
}

export function HolographicGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export function FloatingTechIcons() {
  const techIcons = [
    { symbol: "⚛️", name: "React" },
    { symbol: "📱", name: "Mobile" },
    { symbol: "☁️", name: "Cloud" },
    { symbol: "🤖", name: "AI" },
    { symbol: "🔗", name: "Blockchain" },
    { symbol: "💾", name: "Database" },
    { symbol: "🔒", name: "Security" },
    { symbol: "⚡", name: "Performance" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {techIcons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            x: [
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            ],
            y: [
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            ],
            scale: [0, 1, 0.8, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 1.5
          }}
        >
          <div className="relative">
            <motion.div
              className="text-4xl filter drop-shadow-lg"
              whileHover={{ scale: 1.2 }}
              animate={{
                filter: [
                  "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                  "drop-shadow(0 0 16px rgba(79, 70, 229, 0.8))",
                  "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {icon.symbol}
            </motion.div>
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-blue-400 bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              {icon.name}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function QuantumOrb() {
  return (
    <motion.div
      className="absolute top-1/2 right-1/4 transform -translate-y-1/2 pointer-events-none"
      style={{ zIndex: 3 }}
      animate={{
        y: [-20, 20, -20],
        rotate: [0, 360],
      }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 8, repeat: Infinity, ease: "linear" }
      }}
    >
      <div className="relative w-40 h-40">
        {/* Outer rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: `rgba(59, 130, 246, ${0.3 - i * 0.1})`,
              transform: `scale(${1 + i * 0.3})`
            }}
            animate={{
              rotate: [0, 360],
              scale: [1 + i * 0.3, 1.2 + i * 0.3, 1 + i * 0.3]
            }}
            transition={{
              rotate: { duration: 8 + i * 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}
        
        {/* Core orb */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-radial from-blue-400/60 via-indigo-500/40 to-purple-600/20"
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.5)",
              "0 0 40px rgba(79, 70, 229, 0.8)",
              "0 0 20px rgba(59, 130, 246, 0.5)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Energy particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 0'
            }}
            animate={{
              rotate: [0, 360],
              x: [0, 60 * Math.cos(i * Math.PI / 4)],
              y: [0, 60 * Math.sin(i * Math.PI / 4)],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
