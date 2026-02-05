'use client';

import { motion } from 'framer-motion';
import { Bot, Wallet, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';

const features = [
    {
        icon: Bot,
        title: 'AI-Powered Agents',
        description: 'Autonomous agents that analyze markets and execute optimal strategies 24/7',
    },
    {
        icon: Shield,
        title: 'ERC-8004 Identity',
        description: 'Each agent is an NFT with on-chain reputation and ENS integration',
    },
    {
        icon: Zap,
        title: 'Multi-Chain Execution',
        description: 'Seamless liquidity management across Uniswap v4 and Sui DeepBook',
    },
];

const stats = [
    { value: '$12.4M', label: 'Total Value Locked' },
    { value: '847', label: 'Active Agents' },
    { value: '94.2%', label: 'Avg Win Rate' },
    { value: '2.1M', label: 'Transactions' },
];

export default function Home() {
    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-accent-400" />
                            <span className="text-sm text-white/80">Built for ETHGlobal HackMoney 2026</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="gradient-text">DeepMind</span>
                            <br />
                            <span className="text-white">Vaults</span>
                        </h1>

                        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
                            Autonomous AI agents that manage your DeFi positions across chains.
                            Powered by Uniswap v4 Hooks and Sui DeepBook.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                                Launch App <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="btn-secondary inline-flex items-center gap-2">
                                <Wallet className="w-5 h-5" /> Connect Wallet
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="card text-center">
                                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Why DeepMind Vaults?
                        </h2>
                        <p className="text-white/60 max-w-xl mx-auto">
                            The first AI agent platform with true on-chain identity and cross-chain execution
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-accent-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/60">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Deploy Your Agent?
                            </h2>
                            <p className="text-white/70 mb-8">
                                Mint your ERC-8004 agent NFT and start earning yield automatically
                            </p>
                            <Link href="/agents" className="btn-primary inline-flex items-center gap-2">
                                Create Agent <Bot className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-accent-400" />
                        <span className="font-semibold text-white">DeepMind Vaults</span>
                    </div>
                    <p className="text-white/40 text-sm">
                        Built with ❤️ for ETHGlobal HackMoney 2026
                    </p>
                </div>
            </footer>
        </div>
    );
}
