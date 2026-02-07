"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import CountUp from "react-countup";
import { BackgroundRipple } from "@/components/aceternity/background-ripple";
import { TextGenerateEffect } from "@/components/aceternity/text-generate";
import { Button } from "@/components/ui/button";

const floatingStats = [
    { value: 24, suffix: "", label: "Agents Active", icon: Users },
    { value: 1.2, suffix: "M", label: "Total AUM", prefix: "$", icon: TrendingUp },
    { value: 68, suffix: "%", label: "Avg Win Rate", icon: Zap },
];

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <BackgroundRipple className="z-0" />

            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent z-[1]" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span className="text-sm text-zinc-400">AI-Powered DeFi Portfolio Management</span>
                </motion.div>

                {/* Main Headline */}
                <div className="mb-6">
                    <TextGenerateEffect
                        words="Your Portfolio, Managed by AI."
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight gradient-text-hero"
                        delay={200}
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="mt-2"
                    >
                        <span className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                            24/7. Transparently.
                        </span>
                    </motion.div>
                </div>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Autonomous DeFi agents execute across Ethereum and Sui.
                    <br className="hidden md:block" />
                    Every decision, every trade—on-chain and verifiable.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    <Link href="/agents">
                        <Button variant="primary" size="lg" className="group">
                            <Brain className="w-5 h-5" />
                            Create Your Agent
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Button variant="secondary" size="lg">
                        Watch Demo
                    </Button>
                </motion.div>

                {/* Floating Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1, duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-6"
                >
                    {floatingStats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2.3 + index * 0.1, duration: 0.4 }}
                            className="glass-card rounded-2xl px-6 py-4 min-w-[140px]"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <stat.icon className="w-4 h-4 text-primary-400" />
                            </div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {stat.prefix}
                                <CountUp
                                    end={stat.value}
                                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                                    duration={2}
                                    delay={2.5}
                                />
                                {stat.suffix}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    );
}
