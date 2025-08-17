"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CyberpunkGlitch() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-10 right-10 w-64 h-32 pointer-events-none" style={{ zIndex: 3 }}>
      <motion.div
        className={`relative w-full h-full border border-cyan-400 bg-gray-900/40 backdrop-blur-sm ${
          glitchActive ? 'animate-pulse' : ''
        }`}
        style={{
          filter: glitchActive ? 'hue-rotate(180deg) saturate(2)' : 'none',
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between p-2 border-b border-cyan-400/30">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs text-cyan-400 font-mono">SYSTEM TERMINAL</div>
        </div>

        {/* Terminal content */}
        <div className="p-2 font-mono text-xs">
          <motion.div
            className="text-green-400"
            animate={{
              opacity: glitchActive ? [1, 0, 1, 0, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
          >
            $ initializing neural networks...
          </motion.div>
          <motion.div
            className="text-blue-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ overflow: "hidden", whiteSpace: "nowrap" }}
          >
            $ loading AI modules... [████████████] 100%
          </motion.div>
          <motion.div
            className="text-cyan-400 flex items-center"
            animate={{
              opacity: [0, 1, 0, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            $ STATUS: ONLINE{" "}
            <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </motion.div>
        </div>

        {/* Glitch overlay */}
        {glitchActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20"
            animate={{
              x: [-10, 10, -5, 5, 0],
              skewX: [0, 2, -2, 1, 0],
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function HackerMatrix() {
  const [matrixChars, setMatrixChars] = useState<string[][]>([]);
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    const columns = 20;
    const rows = 15;
    
    const generateMatrix = () => {
      const matrix = Array(rows).fill(null).map(() =>
        Array(columns).fill(null).map(() =>
          chars[Math.floor(Math.random() * chars.length)]
        )
      );
      setMatrixChars(matrix);
    };

    generateMatrix();
    const interval = setInterval(generateMatrix, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-10 left-10 w-80 h-60 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <motion.div
        className="relative w-full h-full bg-black/60 backdrop-blur-sm border border-green-400/30 rounded"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 p-2 font-mono text-xs leading-tight">
          {matrixChars.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((char, colIndex) => (
                <motion.span
                  key={`${rowIndex}-${colIndex}`}
                  className="text-green-400"
                  animate={{
                    opacity: [0, 1, 0.3],
                    color: [
                      "rgba(34, 197, 94, 0.8)",
                      "rgba(34, 197, 94, 1)",
                      "rgba(34, 197, 94, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    delay: (rowIndex + colIndex) * 0.05,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ width: "1ch" }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
          animate={{ y: [0, 240, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
}

export function QuantumField() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Quantum particles */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              ['rgba(59, 130, 246, 0.6)', 'rgba(147, 51, 234, 0.6)', 'rgba(16, 185, 129, 0.6)'][
                Math.floor(Math.random() * 3)
              ]
            }, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Energy waves */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-blue-400/20 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            width: [0, 800],
            height: [0, 800],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 8,
            delay: i * 1.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function TechnoGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-30" style={{ zIndex: 0 }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="techno-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
              animate={{
                stroke: [
                  "rgba(59, 130, 246, 0.3)",
                  "rgba(147, 51, 234, 0.5)",
                  "rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#techno-grid)" />
      </svg>

      {/* Grid intersection highlights */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          style={{
            left: `${(i % 4) * 25 + 10}%`,
            top: `${Math.floor(i / 4) * 25 + 10}%`,
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.6)",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function DigitalRain() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40" style={{ zIndex: 1 }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"
          style={{
            left: `${(i * 5) % 100}%`,
            height: "200px",
          }}
          animate={{
            y: [-200, window.innerHeight + 200],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
