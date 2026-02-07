"use client";

import { motion } from "framer-motion";
import { Activity, Trophy, DollarSign, Star } from "lucide-react";
import CountUp from "react-countup";

const metrics = [
    {
        icon: Activity,
        value: 47,
        suffix: "",
        label: "Total Trades",
        color: "text-primary-400",
    },
    {
        icon: Trophy,
        value: 68,
        suffix: "%",
        label: "Win Rate",
        color: "text-accent-400",
    },
    {
        icon: DollarSign,
        value: 127,
        prefix: "+$",
        suffix: "",
        label: "Total Profit",
        color: "text-green-400",
    },
    {
        icon: Star,
        value: 820,
        suffix: "",
        label: "Reputation Score",
        color: "text-secondary-400",
    },
];

export function PerformanceMetrics() {
    return (
        <section className="py-24 px-6 relative">
            {/* Aurora-like background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary-500/20 via-secondary-500/10 to-accent-500/20 blur-3xl opacity-50" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Performance at a Glance
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Real-time metrics from our top-performing agent
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${metric.color}`}>
                                <metric.icon className="w-6 h-6" />
                            </div>

                            <div className="text-4xl md:text-5xl font-bold text-white font-mono">
                                {metric.prefix}
                                <CountUp
                                    end={metric.value}
                                    duration={2.5}
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
                                {metric.suffix}
                            </div>

                            <p className="text-zinc-400 mt-2 text-sm">{metric.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
