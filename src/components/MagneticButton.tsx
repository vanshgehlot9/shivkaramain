"use client";

import { motion } from "framer-motion";
import { useRef, useState, ReactNode, MouseEvent } from "react";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function MagneticButton({ children, className = "", onClick }: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();

        // Calculate distance from center
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Apply magnetic strength (0.3 = moved 30% towards mouse)
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
