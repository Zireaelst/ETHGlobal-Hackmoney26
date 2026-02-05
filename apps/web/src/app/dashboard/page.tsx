'use client';

import { motion } from 'framer-motion';
import {
    Bot,
    TrendingUp,
    TrendingDown,
    Activity,
    DollarSign,
    Zap,
    PieChart,
    ArrowUpRight
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

// Mock data for charts
const performanceData = [
    { date: 'Jan', value: 10000, pnl: 0 },
    { date: 'Feb', value: 10500, pnl: 500 },
    { date: 'Mar', value: 11200, pnl: 1200 },
    { date: 'Apr', value: 10800, pnl: 800 },
    { date: 'May', value: 12400, pnl: 2400 },
    { date: 'Jun', value: 13100, pnl: 3100 },
];

const activeAgents = [
    { id: 1, name: 'Alpha-42', strategy: 'Aggressive', pnl: '+$2,450', winRate: '94%', status: 'active' },
    { id: 2, name: 'Beta-17', strategy: 'Balanced', pnl: '+$1,120', winRate: '87%', status: 'active' },
    { id: 3, name: 'Gamma-8', strategy: 'Conservative', pnl: '+$340', winRate: '91%', status: 'paused' },
];

const recentTrades = [
    { id: 1, agent: 'Alpha-42', action: 'REBALANCE', pair: 'ETH/USDC', amount: '$5,000', pnl: '+$42', time: '2m ago' },
    { id: 2, agent: 'Beta-17', action: 'ARB', pair: 'SUI/USDC', amount: '$3,200', pnl: '+$28', time: '5m ago' },
    { id: 3, agent: 'Alpha-42', action: 'MM', pair: 'ETH/USDC', amount: '$2,100', pnl: '+$15', time: '8m ago' },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen pb-20">
            <Header />

            <main className="pt-24 px-4 max-w-7xl mx-auto">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-white/60">Overview of your AI agent portfolio</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <StatCard
                        title="Total Value Locked"
                        value="$24,650"
                        change="+12.4%"
                        isPositive={true}
                        icon={DollarSign}
                    />
                    <StatCard
                        title="Active Agents"
                        value="3"
                        change="+1 this week"
                        isPositive={true}
                        icon={Bot}
                    />
                    <StatCard
                        title="Total P&L"
                        value="+$3,910"
                        change="+8.2%"
                        isPositive={true}
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Win Rate"
                        value="91.2%"
                        change="+2.1%"
                        isPositive={true}
                        icon={Activity}
                    />
                </motion.div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 card"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Portfolio Performance</h2>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm text-white/60 hover:text-white">1W</button>
                                <button className="px-3 py-1 text-sm bg-white/10 rounded-lg text-white">1M</button>
                                <button className="px-3 py-1 text-sm text-white/60 hover:text-white">3M</button>
                                <button className="px-3 py-1 text-sm text-white/60 hover:text-white">1Y</button>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#d946ef"
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Agent Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card"
                    >
                        <h2 className="text-xl font-semibold text-white mb-6">Strategy Distribution</h2>
                        <div className="space-y-4">
                            <StrategyBar label="Aggressive" percentage={45} color="bg-red-500" />
                            <StrategyBar label="Balanced" percentage={35} color="bg-accent-500" />
                            <StrategyBar label="Conservative" percentage={20} color="bg-primary-500" />
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Total Allocation</span>
                                <span className="text-white font-semibold">$24,650</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tables Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Agents */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Active Agents</h2>
                            <a href="/agents" className="text-accent-400 hover:text-accent-300 text-sm flex items-center gap-1">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="space-y-4">
                            {activeAgents.map((agent) => (
                                <div key={agent.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{agent.name}</div>
                                            <div className="text-white/50 text-sm">{agent.strategy}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-green-400 font-medium">{agent.pnl}</div>
                                        <div className="text-white/50 text-sm">{agent.winRate} win</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Trades */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Recent Trades</h2>
                            <button className="text-accent-400 hover:text-accent-300 text-sm flex items-center gap-1">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recentTrades.map((trade) => (
                                <div key={trade.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${trade.action === 'REBALANCE' ? 'bg-blue-500/20 text-blue-400' :
                                                trade.action === 'ARB' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-medium">
                                                {trade.action} · {trade.pair}
                                            </div>
                                            <div className="text-white/50 text-xs">{trade.agent} · {trade.time}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white text-sm">{trade.amount}</div>
                                        <div className="text-green-400 text-xs">{trade.pnl}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

// Components
function StatCard({ title, value, change, isPositive, icon: Icon }: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ElementType;
}) {
    return (
        <div className="card">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent-400" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change}
                </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-white/50 text-sm">{title}</div>
        </div>
    );
}

function StrategyBar({ label, percentage, color }: {
    label: string;
    percentage: number;
    color: string;
}) {
    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/80">{label}</span>
                <span className="text-white/50">{percentage}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
