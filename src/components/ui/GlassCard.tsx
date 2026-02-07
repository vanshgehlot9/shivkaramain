import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard = ({ 
  children, 
  className = "", 
  hoverEffect = true 
}: GlassCardProps) => (
  <div className={`relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl ${hoverEffect ? 'group hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500' : ''} ${className}`}>
      {/* Gloss Gradient - Industrial Steel */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30" />

      {/* Hover Glow - Shivkara Orange */}
      {hoverEffect && (
          <div className="absolute -inset-px bg-gradient-to-r from-transparent via-shivkara-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: '1.5s' }} />
      )}

      {children}
  </div>
);
