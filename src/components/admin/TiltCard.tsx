"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    const rotateX = useMotionTemplate`${mouseY.get() * -20}deg`;
    const rotateY = useMotionTemplate`${mouseX.get() * 20}deg`;

    return (
        <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
            className={`relative transform transition-all duration-200 ease-out ${className}`}
        >
            {children}
        </motion.div>
    );
};
