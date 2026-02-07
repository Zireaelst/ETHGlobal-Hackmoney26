"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundRippleProps {
    className?: string;
    gridSize?: number;
}

export function BackgroundRipple({
    className,
    gridSize = 60
}: BackgroundRippleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const cols = Math.ceil(dimensions.width / gridSize);
    const rows = Math.ceil(dimensions.height / gridSize);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={cn(
                "absolute inset-0 overflow-hidden",
                className
            )}
        >
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />

            {/* Dot pattern */}
            <div className="absolute inset-0 bg-dot-pattern opacity-30" />

            {/* Interactive grid */}
            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient id="rippleGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                    </radialGradient>
                </defs>

                {Array.from({ length: rows }).map((_, row) =>
                    Array.from({ length: cols }).map((_, col) => {
                        const x = col * gridSize + gridSize / 2;
                        const y = row * gridSize + gridSize / 2;
                        const distance = Math.sqrt(
                            Math.pow(mousePosition.x - x, 2) + Math.pow(mousePosition.y - y, 2)
                        );
                        const maxDistance = 200;
                        const opacity = Math.max(0, 1 - distance / maxDistance) * 0.4;

                        return (
                            <motion.circle
                                key={`${row}-${col}`}
                                cx={x}
                                cy={y}
                                r={2}
                                fill={`rgba(139, 92, 246, ${opacity})`}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: opacity > 0.1 ? 1.5 : 1,
                                    opacity: 0.3 + opacity,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        );
                    })
                )}
            </svg>

            {/* Mouse glow */}
            <motion.div
                className="pointer-events-none absolute w-96 h-96 rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                    x: mousePosition.x - 192,
                    y: mousePosition.y - 192,
                }}
            />
        </div>
    );
}
