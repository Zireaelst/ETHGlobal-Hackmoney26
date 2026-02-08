"use client";

import { motion } from "framer-motion";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TransparencyShowcase() {
    return (
        <section className="py-24 px-6 relative">
            {/* Grid background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Full Transparency. Zero Black Boxes.
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Every AI decision is recorded on-chain and verifiable through ENS text records
                    </p>
                </motion.div>

                {/* Split Layout */}
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left: Decision Feed */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3"
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Latest AI Decision</CardTitle>
                                    <Badge variant="success" className="gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified on ENS
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Action taken */}
                                <div className="border-l-4 border-primary-500 pl-4 py-2">
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                        Action Taken
                                    </p>
                                    <p className="text-lg font-semibold text-white">
                                        Moved 5,000 USDC to Sui DeepBook
                                    </p>
                                    <p className="text-sm text-zinc-400 mt-1">
                                        Agent #42 • 2 minutes ago
                                    </p>
                                </div>

                                {/* AI Reasoning */}
                                <div className="bg-gradient-to-br from-primary-500/10 to-secondary-500/5 rounded-xl p-5 border border-primary-500/20">
                                    <p className="text-xs text-primary-400 uppercase tracking-wider mb-3">
                                        AI Reasoning
                                    </p>
                                    <p className="text-sm text-zinc-300 italic leading-relaxed font-mono">
                                        "DeepBook spread widened to 0.8% (vs 0.3% average). High volatility
                                        combined with low liquidity presents a market making opportunity.
                                        Risk-adjusted expected return: +2.3% over 24h window. Confidence: 87%."
                                    </p>
                                </div>

                                {/* Transaction Link */}
                                <a
                                    href="#"
                                    className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                                >
                                    View on Explorer
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right: ENS Terminal */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <div className="terminal h-full">
                            <div className="flex items-center gap-2 pb-4 border-b border-accent-500/20 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-xs text-zinc-500">ens-resolver</span>
                            </div>

                            <div className="space-y-3">
                                <div className="text-accent-400">
                                    <span className="text-accent-600">$</span> ens resolve agent-42.moltqore.eth
                                </div>

                                <div className="text-green-400 space-y-1">
                                    <div>
                                        <span className="text-zinc-500">agent.last_decision:</span>{" "}
                                        <span className="text-white">"Moved to DeepBook"</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">agent.reputation:</span>{" "}
                                        <span className="text-white">"750/1000"</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">agent.win_rate:</span>{" "}
                                        <span className="text-white">"68.2%"</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">agent.total_trades:</span>{" "}
                                        <span className="text-white">"47"</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">agent.pnl_usd:</span>{" "}
                                        <span className="text-green-400">"+$127.40"</span>
                                    </div>
                                </div>

                                <div className="text-accent-400 pt-2">
                                    <span className="text-accent-600">$</span>{" "}
                                    <span className="terminal-cursor" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
