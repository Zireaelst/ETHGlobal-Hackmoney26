"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, BarChart3, RefreshCw, Shield, Layers, Zap } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";

const features = [
    {
        title: "Cross-Chain Execution",
        description: "Seamless trading across Ethereum and Sui with unified liquidity management.",
        icon: ArrowLeftRight,
        className: "lg:col-span-2",
        gradient: "from-primary-500/10 via-secondary-500/5 to-transparent",
    },
    {
        title: "DeepBook Market Making",
        description: "Automated order book strategies on Sui's native CLOB for optimal spreads.",
        icon: BarChart3,
        className: "",
        gradient: "from-accent-500/10 to-transparent",
    },
    {
        title: "Uniswap v4 Hooks",
        description: "Custom hook integrations for auto-rebalancing and dynamic fee optimization.",
        icon: RefreshCw,
        className: "",
        gradient: "from-secondary-500/10 to-transparent",
    },
    {
        title: "On-Chain Reputation",
        description: "Transparent track record stored in ENS text records. Verify any agent's history.",
        icon: Shield,
        className: "lg:col-span-2",
        gradient: "from-primary-500/10 via-accent-500/5 to-transparent",
    },
];

export function FeaturesGrid() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Everything you need for autonomous DeFi portfolio management
                    </p>
                </motion.div>

                {/* Features Grid */}
                <BentoGrid className="max-w-6xl mx-auto lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={feature.className}
                        >
                            <BentoGridItem
                                className={`h-full bg-gradient-to-br ${feature.gradient}`}
                                header={
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <feature.icon className="w-6 h-6 text-primary-400" />
                                        </div>
                                    </div>
                                }
                                title={feature.title}
                                description={feature.description}
                            />
                        </motion.div>
                    ))}
                </BentoGrid>

                {/* Additional visual elements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-primary-400" />
                            <span className="text-sm text-zinc-400">Multi-Protocol</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent-400" />
                            <span className="text-sm text-zinc-400">Real-time Execution</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-secondary-400" />
                            <span className="text-sm text-zinc-400">Non-Custodial</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
