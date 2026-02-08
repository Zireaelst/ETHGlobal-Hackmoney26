"use client";

import Link from "next/link";
import { Brain, Github, Twitter, MessageCircle, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

const footerLinks = {
    product: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Agents", href: "/agents" },
        { label: "Pricing", href: "#" },
    ],
    resources: [
        { label: "Documentation", href: "#" },
        { label: "Blog", href: "#" },
        { label: "GitHub", href: "#" },
    ],
    legal: [
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Security", href: "#" },
    ],
};

const contracts = [
    { name: "DeepMindVault", address: "0x742a...3f9c" },
    { name: "AgentRegistry", address: "0x8b5f...2a1d" },
];

export function Footer() {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

    const handleCopy = async (address: string) => {
        await navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
    };

    return (
        <footer className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-lg text-white">MoltQore</span>
                        </Link>
                        <p className="text-sm text-zinc-500 mb-4">
                            AI-powered autonomous DeFi portfolio management.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Contract Addresses */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-xs text-zinc-600 mb-4">Contract Addresses</p>
                    <div className="flex flex-wrap gap-4">
                        {contracts.map((contract) => (
                            <div
                                key={contract.name}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                            >
                                <span className="text-xs text-zinc-500">{contract.name}:</span>
                                <code className="text-xs font-mono text-accent-400">{contract.address}</code>
                                <button
                                    onClick={() => handleCopy(contract.address)}
                                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                                    aria-label={`Copy ${contract.name} address`}
                                >
                                    {copiedAddress === contract.address ? (
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                    ) : (
                                        <Copy className="w-3 h-3" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-zinc-600">
                        © 2026 MoltQore. All rights reserved.
                    </p>
                    <p className="text-xs text-zinc-600">
                        Built with ❤️ for ETHGlobal HackMoney 2026
                    </p>
                </div>
            </div>
        </footer>
    );
}
