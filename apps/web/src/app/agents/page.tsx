'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Settings, Pause, Play, TrendingUp, ExternalLink, Loader2, X, Wallet } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useDeepMindVault, useUserAgents, useAgentBalance, Agent } from '@/hooks/useDeepMindVault';
import { useAccount } from 'wagmi';

// Strategy configurations
const strategies = {
    aggressive: { label: 'Aggressive', color: 'bg-red-500', textColor: 'text-red-400', description: '80% capital allocation, maximum fee capture' },
    balanced: { label: 'Balanced', color: 'bg-accent-500', textColor: 'text-accent-400', description: '50% capital allocation, balanced risk/reward' },
    safe: { label: 'Safe', color: 'bg-primary-500', textColor: 'text-primary-400', description: '30% capital allocation, capital preservation' },
};

// Strategy hash to name mapping
const strategyFromHash = (hash: `0x${string}`) => {
    // In production, compare against known hashes
    const hashLower = hash.toLowerCase();
    if (hashLower.includes('agg')) return 'aggressive';
    if (hashLower.includes('bal')) return 'balanced';
    return 'safe';
};

// Format agent for display
const formatAgent = (agent: Agent, index: number) => ({
    id: Number(agent.agentId),
    name: `Agent-${agent.agentId}`,
    ensName: `agent-${agent.agentId}.moltqore.eth`,
    strategy: 'aggressive' as const, // Default, would parse from strategyHash
    status: agent.isPaused ? 'paused' : 'active',
    reputation: Number(agent.reputation),
    totalValue: `$${(Number(agent.profitableTrades) * 50).toLocaleString()}`,
    pnl: `+$${(Number(agent.profitableTrades) * 15).toLocaleString()}`,
    pnlPercent: `+${(Number(agent.profitableTrades) / Math.max(1, Number(agent.totalTrades)) * 100).toFixed(1)}%`,
    winRate: Number(agent.totalTrades) > 0
        ? Math.round(Number(agent.profitableTrades) / Number(agent.totalTrades) * 100)
        : 0,
    totalTrades: Number(agent.totalTrades),
    lastAction: formatTimeAgo(Number(agent.lastSyncTimestamp)),
    suiVault: agent.suiVaultAddress.slice(0, 8) + '...' + agent.suiVaultAddress.slice(-4),
});

// Format timestamp to "X ago" 
const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
};

// Fallback mock data for demo when wallet not connected
const fallbackAgents = [
    {
        id: 1,
        name: 'Alpha-42',
        ensName: 'alpha-42.moltqore.eth',
        strategy: 'aggressive' as const,
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
        ensName: 'beta-17.moltqore.eth',
        strategy: 'balanced' as const,
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
];

export default function AgentsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState<'aggressive' | 'balanced' | 'safe'>('balanced');
    const [agentName, setAgentName] = useState('');

    // Wallet & Contract hooks
    const { address, isConnected } = useAccount();
    const { mintAgent, isLoading: isMinting, isConfirmed, txHash } = useDeepMindVault();
    const { agents: contractAgents, isLoading: agentsLoading, count: agentCount } = useUserAgents(address);

    // Use contract agents if connected, otherwise show demo data
    const displayAgents = isConnected && contractAgents.length > 0
        ? contractAgents.map((agent, i) => formatAgent(agent, i))
        : fallbackAgents;

    // Handle mint
    const handleMint = async () => {
        if (!agentName.trim()) return;

        const result = await mintAgent({
            ensName: `${agentName.toLowerCase().replace(/\s+/g, '-')}.moltqore.eth`,
            strategy: selectedStrategy,
        });

        if (result.success) {
            setShowCreateModal(false);
            setAgentName('');
        }
    };

    // Close modal on successful mint
    useEffect(() => {
        if (isConfirmed && txHash) {
            setShowCreateModal(false);
        }
    }, [isConfirmed, txHash]);

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
                        <p className="text-white/60">
                            {isConnected
                                ? `Managing ${agentCount} agent${agentCount !== 1 ? 's' : ''} for ${address?.slice(0, 6)}...${address?.slice(-4)}`
                                : 'Connect wallet to manage your autonomous DeFi agents'
                            }
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2 w-fit"
                        disabled={!isConnected}
                    >
                        <Plus className="w-5 h-5" />
                        Create Agent
                    </button>
                </motion.div>

                {/* Connection Notice */}
                {!isConnected && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30 flex items-center gap-3"
                    >
                        <Wallet className="w-5 h-5 text-accent-400" />
                        <span className="text-white/80">
                            Connect your wallet to create and manage real AI agents. Showing demo data below.
                        </span>
                    </motion.div>
                )}

                {/* Loading State */}
                {agentsLoading && isConnected && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
                    </div>
                )}

                {/* Agents Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {displayAgents.map((agent, index) => (
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
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${strategies[agent.strategy].color} bg-opacity-20 ${strategies[agent.strategy].textColor}`}>
                                        {strategies[agent.strategy].label}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {agent.status}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div>
                                    <p className="text-white/50 text-xs mb-1">Total Value</p>
                                    <p className="text-white font-semibold">{agent.totalValue}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-xs mb-1">P&L</p>
                                    <p className="text-green-400 font-semibold">{agent.pnl}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-xs mb-1">Win Rate</p>
                                    <p className="text-white font-semibold">{agent.winRate}%</p>
                                </div>
                            </div>

                            {/* Reputation Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white/50">Reputation</span>
                                    <span className="text-accent-400">{agent.reputation}/1000</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                                        style={{ width: `${agent.reputation / 10}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="text-xs text-white/50">
                                    Last action: {agent.lastAction}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <Settings className="w-4 h-4 text-white/60" />
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        {agent.status === 'active' ? (
                                            <Pause className="w-4 h-4 text-white/60" />
                                        ) : (
                                            <Play className="w-4 h-4 text-white/60" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Create Agent Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowCreateModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-dark-800 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Create AI Agent</h2>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="p-2 rounded-lg hover:bg-white/10"
                                    >
                                        <X className="w-5 h-5 text-white/60" />
                                    </button>
                                </div>

                                {!isConnected ? (
                                    <div className="text-center py-8">
                                        <Wallet className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                                        <p className="text-white/60 mb-4">Connect your wallet to create an agent</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Agent Name */}
                                        <div className="mb-6">
                                            <label className="block text-sm text-white/60 mb-2">Agent Name</label>
                                            <input
                                                type="text"
                                                value={agentName}
                                                onChange={(e) => setAgentName(e.target.value)}
                                                placeholder="e.g. Alpha, Beta, Gamma"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500"
                                            />
                                            <p className="text-xs text-white/40 mt-1">
                                                ENS: {agentName ? `${agentName.toLowerCase().replace(/\s+/g, '-')}.moltqore.eth` : 'your-agent.moltqore.eth'}
                                            </p>
                                        </div>

                                        {/* Strategy Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm text-white/60 mb-2">Strategy</label>
                                            <div className="space-y-2">
                                                {(Object.keys(strategies) as Array<keyof typeof strategies>).map((key) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setSelectedStrategy(key)}
                                                        className={`w-full p-4 rounded-xl border transition-all ${selectedStrategy === key
                                                            ? 'border-accent-500 bg-accent-500/10'
                                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-3 h-3 rounded-full ${strategies[key].color}`} />
                                                                <span className="text-white font-medium">{strategies[key].label}</span>
                                                            </div>
                                                            {selectedStrategy === key && (
                                                                <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-white/50 mt-2 text-left">{strategies[key].description}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            onClick={handleMint}
                                            disabled={isMinting || !agentName.trim()}
                                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isMinting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Minting Agent NFT...
                                                </>
                                            ) : (
                                                <>
                                                    <Bot className="w-5 h-5" />
                                                    Mint Agent (ERC-8004)
                                                </>
                                            )}
                                        </button>

                                        {txHash && (
                                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                                <p className="text-green-400 text-sm">
                                                    ✓ Transaction submitted!{' '}
                                                    <a
                                                        href={`https://sepolia.basescan.org/tx/${txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline"
                                                    >
                                                        View on Basescan
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
