"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

export default function TextReveal({ children, className = "" }: { children: string, className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [displayText, setDisplayText] = useState(children);

    useEffect(() => {
        if (!isInView) return;

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                children
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return children[index];
                        }
                        if (letter === " " || letter === "\n") return letter; // Keep spaces/newlines
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= children.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3; // Slower reveal
        }, 30);

        return () => clearInterval(interval);
    }, [isInView, children]);

    return (
        <span ref={ref} className={className}>
            {displayText}
        </span>
    );
}
