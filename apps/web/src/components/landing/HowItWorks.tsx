"use client";

import { motion } from "framer-motion";
import { Wallet, Brain, Zap } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";

const steps = [
    {
        number: "01",
        title: "Mint Your Agent",
        description: "Create your ERC-8004 NFT identity with a unique on-chain persona and ENS subdomain.",
        icon: Wallet,
        gradient: "from-primary-500/20 to-primary-500/5",
    },
    {
        number: "02",
        title: "AI Analyzes Markets",
        description: "DeepMind continuously monitors Uniswap v4 and Sui DeepBook for optimal opportunities.",
        icon: Brain,
        gradient: "from-secondary-500/20 to-secondary-500/5",
    },
    {
        number: "03",
        title: "Autonomous Execution",
        description: "Your agent executes trades 24/7 with full transparency—every decision logged on-chain.",
        icon: Zap,
        gradient: "from-accent-500/20 to-accent-500/5",
    },
];

export function HowItWorks() {
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
                        How It Works
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Three simple steps to autonomous portfolio management
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <BentoGrid className="max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <BentoGridItem
                                className={`bg-gradient-to-br ${step.gradient}`}
                                header={
                                    <div className="flex items-center justify-between">
                                        <span className="text-6xl font-mono font-bold text-white/10">
                                            {step.number}
                                        </span>
                                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/bento:border-primary-500/30 transition-colors">
                                            <step.icon className="w-7 h-7 text-primary-400" />
                                        </div>
                                    </div>
                                }
                                title={step.title}
                                description={step.description}
                            />
                        </motion.div>
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
