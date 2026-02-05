'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus, Settings, Pause, Play, TrendingUp, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/header';

const mockAgents = [
    {
        id: 1,
        name: 'Alpha-42',
        ensName: 'alpha-42.deepmind.eth',
        strategy: 'aggressive',
        status: 'active',
        reputation: 920,
        totalValue: '$12,400',
        pnl: '+$2,450',
        pnlPercent: '+24.6%',
        winRate: 94,
        totalTrades: 156,
        lastAction: '2 min ago',
        suiVault: '0x7f8b...3c4e',
    },
    {
        id: 2,
        name: 'Beta-17',
        ensName: 'beta-17.deepmind.eth',
        strategy: 'balanced',
        status: 'active',
        reputation: 780,
        totalValue: '$8,200',
        pnl: '+$1,120',
        pnlPercent: '+15.8%',
        winRate: 87,
        totalTrades: 89,
        lastAction: '5 min ago',
        suiVault: '0x3a2c...9f1b',
    },
    {
        id: 3,
        name: 'Gamma-8',
        ensName: 'gamma-8.deepmind.eth',
        strategy: 'conservative',
        status: 'paused',
        reputation: 650,
        totalValue: '$4,050',
        pnl: '+$340',
        pnlPercent: '+9.2%',
        winRate: 91,
        totalTrades: 42,
        lastAction: '1 hour ago',
        suiVault: '0x9e4d...2a7c',
    },
];

const strategies = {
    aggressive: { label: 'Aggressive', color: 'bg-red-500', textColor: 'text-red-400' },
    balanced: { label: 'Balanced', color: 'bg-accent-500', textColor: 'text-accent-400' },
    conservative: { label: 'Conservative', color: 'bg-primary-500', textColor: 'text-primary-400' },
};

export default function AgentsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="min-h-screen pb-20">
            <Header />

            <main className="pt-24 px-4 max-w-7xl mx-auto">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">AI Agents</h1>
                        <p className="text-white/60">Manage your autonomous DeFi agents</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2 w-fit"
                    >
                        <Plus className="w-5 h-5" />
                        Create Agent
                    </button>
                </motion.div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockAgents.map((agent, index) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card hover:border-accent-500/50"
                        >
                            {/* Agent Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                        <Bot className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                                        <a
                                            href={`https://app.ens.domains/${agent.ensName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent-400 text-sm flex items-center gap-1 hover:text-accent-300"
                                        >
                                            {agent.ensName}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${strategies[agent.strategy as keyof typeof strategies].color
                                        } bg-opacity-20 ${strategies[agent.strategy as keyof typeof strategies].textColor}`}>
                                        {strategies[agent.strategy as keyof typeof strategies].label}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${agent.status === 'active'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {agent.status === 'active' ? '● Active' : '◉ Paused'}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white/5 rounded-xl p-3">
                                    <div className="text-white/50 text-xs mb-1">Total Value</div>
                                    <div className="text-white font-semibold">{agent.totalValue}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                    <div className="text-white/50 text-xs mb-1">P&L</div>
                                    <div className="text-green-400 font-semibold">{agent.pnl}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                    <div className="text-white/50 text-xs mb-1">Win Rate</div>
                                    <div className="text-white font-semibold">{agent.winRate}%</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                    <div className="text-white/50 text-xs mb-1">Reputation</div>
                                    <div className="text-accent-400 font-semibold">{agent.reputation}/1000</div>
                                </div>
                            </div>

                            {/* Reputation Bar */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-white/60">Reputation Score</span>
                                    <span className="text-white/80">{agent.reputation}/1000</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(agent.reputation / 1000) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="text-white/50 text-sm">
                                    {agent.totalTrades} trades · Last active {agent.lastAction}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                        <Settings className="w-5 h-5 text-white/60" />
                                    </button>
                                    <button className={`p-2 rounded-lg transition-colors ${agent.status === 'active'
                                            ? 'hover:bg-yellow-500/20 text-yellow-400'
                                            : 'hover:bg-green-500/20 text-green-400'
                                        }`}>
                                        {agent.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    </button>
                                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Create Agent CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <div
                        onClick={() => setShowCreateModal(true)}
                        className="card border-dashed border-2 border-white/20 hover:border-accent-500/50 cursor-pointer flex items-center justify-center py-12 transition-colors"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-white/60" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Create New Agent</h3>
                            <p className="text-white/50 max-w-sm">
                                Deploy a new ERC-8004 agent NFT with custom strategy and Sui vault
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Create Modal Placeholder */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-strong rounded-2xl p-6 max-w-lg w-full"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Agent</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-white/70 text-sm mb-2 block">Agent Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Delta-99"
                                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                            <div>
                                <label className="text-white/70 text-sm mb-2 block">Strategy</label>
                                <select className="w-full px-4 py-3 bg-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                                    <option value="aggressive">Aggressive (±5% range)</option>
                                    <option value="balanced" selected>Balanced (±10% range)</option>
                                    <option value="conservative">Conservative (±20% range)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-white/70 text-sm mb-2 block">Initial Deposit (USDC)</label>
                                <input
                                    type="number"
                                    placeholder="1000"
                                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 btn-primary">
                                Create Agent
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
