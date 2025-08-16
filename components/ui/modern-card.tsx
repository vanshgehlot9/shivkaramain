import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  hoverEffect?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function ModernGlassCard({
  children,
  className = '',
  dark = false,
  hoverEffect = true,
  clickable = false,
  onClick
}: GlassCardProps) {
  const baseStyle = dark
    ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-800 text-white'
    : 'bg-white/80 backdrop-blur-xl border border-gray-100 text-gray-900';
  
  const hoverStyles = hoverEffect
    ? 'hover:shadow-xl hover:scale-[1.02] hover:border-indigo-200 transition-all duration-300'
    : '';
  
  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg ${baseStyle} ${hoverStyles} ${clickable ? 'cursor-pointer' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hoverEffect ? { y: -5 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function ModernGradientBorder({
  children,
  className = '',
  gradientFrom = 'from-blue-700',
  gradientTo = 'to-indigo-700',
  clickable = false,
  onClick
}: {
  children: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  clickable?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={`relative p-[1px] rounded-2xl overflow-hidden group ${clickable ? 'cursor-pointer' : ''} ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-75 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative bg-white dark:bg-gray-900 rounded-[calc(1rem-1px)] p-6 h-full">
        {children}
      </div>
    </div>
  );
}

export function ModernFeatureCard({
  icon,
  title,
  description,
  gradientFrom = 'from-blue-700',
  gradientTo = 'to-indigo-700',
  onClick
}: {
  icon: ReactNode;
  title: string;
  description: string;
  gradientFrom?: string;
  gradientTo?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden relative group"
      whileHover={{ y: -5 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
      
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white shadow-lg mb-5`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
