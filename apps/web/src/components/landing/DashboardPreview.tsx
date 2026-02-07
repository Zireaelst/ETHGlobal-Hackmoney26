"use client";

import { motion } from "framer-motion";

export function DashboardPreview() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
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
                        Your Command Center
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Monitor your agents, track performance, and manage your portfolio in real-time
                    </p>
                </motion.div>

                {/* Browser Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="relative max-w-5xl mx-auto"
                >
                    {/* Glow behind */}
                    <div className="absolute -inset-8 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-primary-600/20 blur-3xl opacity-60" />

                    {/* Browser Chrome */}
                    <div className="relative bg-zinc-900/90 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Title Bar */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 border-b border-white/10">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-4 py-1 rounded-md bg-zinc-700/50 text-xs text-zinc-400">
                                    deepmindvaults.xyz/dashboard
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="relative p-6 bg-background">
                            {/* Dashboard Grid */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {/* Stat Cards */}
                                {[
                                    { label: "Total Value", value: "$24,847.32", change: "+12.4%" },
                                    { label: "Active Agents", value: "3", change: "" },
                                    { label: "24h P&L", value: "+$127.40", change: "+2.1%" },
                                    { label: "Win Rate", value: "68.2%", change: "+5.3%" },
                                ].map((stat, i) => (
                                    <div key={i} className="glass-card rounded-xl p-4">
                                        <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                                        <p className="text-xl font-bold text-white font-mono">{stat.value}</p>
                                        {stat.change && (
                                            <p className="text-xs text-green-400 mt-1">{stat.change}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Chart Area */}
                            <div className="glass-card rounded-xl p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-white">Portfolio Performance</h3>
                                    <div className="flex gap-2">
                                        {["1D", "1W", "1M", "ALL"].map((period) => (
                                            <button
                                                key={period}
                                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${period === "1W"
                                                        ? "bg-primary-500/20 text-primary-400"
                                                        : "text-zinc-500 hover:text-white"
                                                    }`}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fake Chart */}
                                <div className="h-40 flex items-end gap-1">
                                    {[40, 55, 45, 65, 50, 70, 60, 80, 75, 85, 78, 90, 85, 95, 88].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-gradient-to-t from-primary-500/50 to-primary-500/20 rounded-t-sm"
                                            style={{ height: `${height}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Agent List */}
                            <div className="glass-card rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-3">Active Agents</h3>
                                <div className="space-y-2">
                                    {[
                                        { name: "Agent #42", status: "Trading", pnl: "+$89.20" },
                                        { name: "Agent #17", status: "Analyzing", pnl: "+$24.60" },
                                        { name: "Agent #8", status: "Idle", pnl: "+$13.60" },
                                    ].map((agent, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                                    <span className="text-xs font-mono text-primary-400">#{i + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white">{agent.name}</p>
                                                    <p className="text-xs text-zinc-500">{agent.status}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-mono text-green-400">{agent.pnl}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Demo Overlay */}
                            <div className="absolute inset-0 bg-background/20 flex items-center justify-center pointer-events-none">
                                <span className="text-6xl font-bold text-white/5 select-none">DEMO</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
