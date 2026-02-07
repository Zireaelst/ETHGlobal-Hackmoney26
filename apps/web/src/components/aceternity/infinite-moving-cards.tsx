"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface InfiniteMovingCardsProps {
    items: {
        name: string;
        logo?: React.ReactNode;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}

export function InfiniteMovingCards({
    items,
    direction = "left",
    speed = "normal",
    pauseOnHover = true,
    className,
}: InfiniteMovingCardsProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
        addAnimation();
    }, []);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            setStart(true);
        }
    }

    const getSpeed = () => {
        switch (speed) {
            case "fast":
                return "20s";
            case "normal":
                return "40s";
            case "slow":
                return "60s";
            default:
                return "40s";
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
                style={{
                    "--animation-duration": getSpeed(),
                    "--animation-direction": direction === "left" ? "forwards" : "reverse",
                } as React.CSSProperties}
            >
                {items.map((item, idx) => (
                    <li
                        key={`${item.name}-${idx}`}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                        {item.logo && (
                            <div className="w-8 h-8 flex items-center justify-center opacity-60">
                                {item.logo}
                            </div>
                        )}
                        <span className="text-sm font-medium text-white/70">
                            {item.name}
                        </span>
                    </li>
                ))}
            </ul>

            <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 1rem));
          }
        }
        .animate-scroll {
          animation: scroll var(--animation-duration) linear infinite;
          animation-direction: var(--animation-direction);
        }
      `}</style>
        </div>
    );
}
