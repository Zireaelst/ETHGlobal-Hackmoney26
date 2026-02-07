"use client";

import { Hexagon, Layers, Link2, Globe } from "lucide-react";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";

const trustItems = [
    {
        name: "ERC-8004",
        logo: <Hexagon className="w-6 h-6" />,
    },
    {
        name: "Sui Network",
        logo: <Globe className="w-6 h-6" />,
    },
    {
        name: "Uniswap v4",
        logo: <Layers className="w-6 h-6" />,
    },
    {
        name: "ENS",
        logo: <Link2 className="w-6 h-6" />,
    },
    {
        name: "DeepBook",
        logo: <Layers className="w-6 h-6" />,
    },
];

export function TrustIndicators() {
    return (
        <section className="py-12 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-sm text-zinc-500 mb-8">
                    Built on Industry Standards
                </p>

                <InfiniteMovingCards
                    items={trustItems}
                    direction="left"
                    speed="slow"
                    pauseOnHover={true}
                />
            </div>
        </section>
    );
}
