'use client';

import { useAgentDecision, useAgentPerformance } from '@/hooks/useAgentENS';
import { ExternalLink, TrendingUp, TrendingDown, Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    agentId: number;
}

export function AgentDecisionFeed({ agentId }: Props) {
    const { decision, reasoning, pnl, timestamp, isLoading: loadingDecision } = useAgentDecision(agentId);
    const { reputation, winRate, isLoading: loadingPerformance } = useAgentPerformance(agentId);

    const isProfitable = pnl?.startsWith('+');
    const isLoading = loadingDecision || loadingPerformance;

    // Mock data for demo
    const displayDecision = decision || 'Moved 5,000 USDC to Sui DeepBook market making';
    const displayReasoning = reasoning ||
        'DeepBook spread widened to 0.8% (vs 0.3% average) due to volatility spike. ' +
        'Low liquidity = high market making profit potential. Sui network stable (99.9% uptime). ' +
        'This opportunity fits the balanced risk profile with estimated 24% APR.';
    const displayPnl = pnl || '+$127.50';
    const displayTimestamp = timestamp || new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Latest AI Decision</h2>
                        <p className="text-white/50 text-sm">agent-{agentId}.deepmind.eth</p>
                    </div>
                </div>

                {/* P&L Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isProfitable
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                    {isProfitable ? (
                        <TrendingUp className="w-5 h-5" />
                    ) : (
                        <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="font-bold text-lg">{displayPnl}</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Decision */}
                    <div className="mb-6">
                        <p className="text-white/50 text-sm mb-2">Action Taken</p>
                        <p className="text-xl font-semibold text-white">{displayDecision}</p>
                    </div>

                    {/* AI Reasoning - THE WOW FACTOR */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">AI</span>
                            </div>
                            <p className="text-sm font-medium text-white/70">Transparent Reasoning</p>
                        </div>

                        <div className="relative bg-gradient-to-br from-primary-500/10 to-accent-500/10 p-6 rounded-xl border border-white/10">
                            {/* Quote decoration */}
                            <div className="absolute top-3 left-3 text-5xl text-primary-500/30 font-serif leading-none">
                                "
                            </div>

                            <p className="text-sm italic text-white/80 pl-6 relative z-10 leading-relaxed">
                                {displayReasoning}
                            </p>

                            <div className="absolute bottom-3 right-3 text-5xl text-accent-500/30 font-serif leading-none rotate-180">
                                "
                            </div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1">Reputation</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                                        style={{ width: `${(reputation / 1000) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-white">{reputation}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1">Win Rate</p>
                            <p className="text-lg font-semibold text-green-400">{winRate.toFixed(1)}%</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1">Last Update</p>
                            <p className="text-sm font-semibold text-white">
                                {displayTimestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    {/* View on ENS */}
                    <a
                        href={`https://app.ens.domains/agent-${agentId}.deepmind.eth`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-accent-400 hover:text-accent-300 font-medium py-3 border-t border-white/10"
                    >
                        View full profile on ENS
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </>
            )}
        </motion.div>
    );
}
