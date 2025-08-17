"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DataStreamVisualization() {
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 50 }, () => Math.random() * 100);
      setDataPoints(newData);
    };

    generateData();
    const interval = setInterval(generateData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-1/4 left-1/4 w-80 h-60 pointer-events-none" style={{ zIndex: 2 }}>
      <motion.div
        className="relative w-full h-full bg-gray-900/20 backdrop-blur-sm rounded-lg border border-blue-500/30 p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-xs text-blue-400 font-mono">Performance Analytics</div>
        </div>

        {/* Data visualization */}
        <div className="flex items-end justify-between h-32 space-x-1">
          {dataPoints.map((point, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
              style={{ width: '4px' }}
              initial={{ height: 0 }}
              animate={{ height: `${point}%` }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
            />
          ))}
        </div>

        {/* Streaming effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
          animate={{ x: [-100, 320] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Code overlay */}
        <div className="absolute bottom-2 left-4 text-xs font-mono text-green-400">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {">"} Processing real-time data...
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export function AIBrainVisualization() {
  const neurons = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 200,
    connections: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, () => Math.floor(Math.random() * 30))
  }));

  return (
    <div className="absolute bottom-1/4 right-1/4 w-80 h-60 pointer-events-none" style={{ zIndex: 2 }}>
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Neural connections */}
          {neurons.map((neuron) => 
            neuron.connections.map((targetId, index) => {
              const target = neurons[targetId];
              if (!target) return null;
              
              return (
                <motion.line
                  key={`${neuron.id}-${targetId}-${index}`}
                  x1={neuron.x}
                  y1={neuron.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 2, 
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              );
            })
          )}

          {/* Neurons */}
          {neurons.map((neuron) => (
            <motion.circle
              key={neuron.id}
              cx={neuron.x}
              cy={neuron.y}
              r="4"
              fill="rgba(79, 70, 229, 0.8)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                fill: [
                  "rgba(79, 70, 229, 0.8)",
                  "rgba(59, 130, 246, 1)",
                  "rgba(79, 70, 229, 0.8)"
                ]
              }}
              transition={{ 
                duration: 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </svg>

        {/* AI Label */}
        <motion.div
          className="absolute top-4 left-4 text-sm font-mono text-purple-400 bg-gray-900/60 backdrop-blur-sm px-3 py-1 rounded"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          AI Neural Network
        </motion.div>
      </motion.div>
    </div>
  );
}

export function CloudInfrastructure() {
  return (
    <div className="absolute top-1/3 right-1/3 w-60 h-40 pointer-events-none" style={{ zIndex: 2 }}>
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Cloud servers */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-12 bg-gradient-to-b from-gray-700 to-gray-800 rounded border border-blue-400/30"
            style={{
              left: `${(i % 3) * 80 + 20}px`,
              top: `${Math.floor(i / 3) * 60 + 20}px`
            }}
            animate={{
              boxShadow: [
                "0 0 5px rgba(59, 130, 246, 0.3)",
                "0 0 15px rgba(59, 130, 246, 0.6)",
                "0 0 5px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Server lights */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full"></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
          </motion.div>
        ))}

        {/* Connection lines */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {[...Array(6)].map((_, i) => {
            if (i >= 3) return null;
            return (
              <motion.line
                key={i}
                x1={i * 80 + 44}
                y1={32}
                x2={i * 80 + 44}
                y2={80}
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            );
          })}
        </svg>

        {/* Cloud label */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-mono text-cyan-400 bg-gray-900/60 backdrop-blur-sm px-2 py-1 rounded"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cloud Infrastructure
        </motion.div>
      </motion.div>
    </div>
  );
}

export function DigitalDNA() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-80 pointer-events-none" style={{ zIndex: 1 }}>
      <motion.div
        className="relative w-full h-full"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {/* DNA Double Helix */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const y = (i / 20) * 300 + 40;
            const offset = (i * 18) % 360;
            const x1 = 150 + Math.sin((offset * Math.PI) / 180) * 60;
            const x2 = 150 - Math.sin((offset * Math.PI) / 180) * 60;
            
            return (
              <g key={i}>
                {/* DNA strands */}
                <motion.circle
                  cx={x1}
                  cy={y}
                  r="3"
                  fill="rgba(59, 130, 246, 0.8)"
                  animate={{
                    fill: [
                      "rgba(59, 130, 246, 0.8)",
                      "rgba(147, 51, 234, 0.8)",
                      "rgba(59, 130, 246, 0.8)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.circle
                  cx={x2}
                  cy={y}
                  r="3"
                  fill="rgba(147, 51, 234, 0.8)"
                  animate={{
                    fill: [
                      "rgba(147, 51, 234, 0.8)",
                      "rgba(59, 130, 246, 0.8)",
                      "rgba(147, 51, 234, 0.8)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Connecting lines */}
                <motion.line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="1"
                  animate={{
                    stroke: [
                      "rgba(59, 130, 246, 0.3)",
                      "rgba(147, 51, 234, 0.5)",
                      "rgba(59, 130, 246, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.05,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </g>
            );
          })}
        </svg>
        
        {/* Digital particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100]
            }}
            transition={{
              duration: 4,
              delay: Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
