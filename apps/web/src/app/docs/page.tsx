import type { Metadata } from 'next';
import Link from 'next/link';
import { Book, Code, Cpu, Shield, Zap, ExternalLink, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Documentation | DeepMind Vaults',
    description: 'Learn how to create and manage AI-powered autonomous DeFi agents',
};

const sections = [
    {
        title: 'Getting Started',
        icon: Book,
        items: [
            { name: 'Introduction', href: '#introduction' },
            { name: 'Quick Start', href: '#quick-start' },
            { name: 'Create Your First Agent', href: '#create-agent' },
        ],
    },
    {
        title: 'Smart Contracts',
        icon: Code,
        items: [
            { name: 'DeepMindVault (ERC-8004)', href: '#deepmind-vault' },
            { name: 'ENS Text Records', href: '#ens-records' },
            { name: 'Sui Agent Vault', href: '#sui-vault' },
        ],
    },
    {
        title: 'AI Providers',
        icon: Cpu,
        items: [
            { name: 'Platform AI (GPT-4o)', href: '#platform-ai' },
            { name: 'Bring Your Own AI', href: '#byoa' },
            { name: 'OpenClaw Integration', href: '#openclaw' },
        ],
    },
];

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f1a]">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg" />
                        <span className="font-bold text-white">DeepMind Vaults</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-white/60 hover:text-white text-sm">Dashboard</Link>
                        <Link href="/agents" className="text-white/60 hover:text-white text-sm">Agents</Link>
                        <Link href="/docs" className="text-violet-400 text-sm font-medium">Docs</Link>
                    </nav>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 hidden lg:block">
                    <nav className="sticky top-24 space-y-6">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <div key={section.title}>
                                    <div className="flex items-center gap-2 text-white font-medium mb-3">
                                        <Icon className="w-4 h-4 text-violet-400" />
                                        {section.title}
                                    </div>
                                    <ul className="space-y-1 ml-6 border-l border-white/10">
                                        {section.items.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className="block pl-4 py-1.5 text-sm text-white/50 hover:text-white border-l-2 border-transparent hover:border-violet-400 transition-colors"
                                                >
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Hero */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
                        <p className="text-xl text-white/60">
                            Everything you need to know about creating and managing AI-powered autonomous DeFi agents.
                        </p>
                    </div>

                    {/* Introduction */}
                    <section id="introduction" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Book className="w-6 h-6 text-violet-400" />
                            Introduction
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-white/70 leading-relaxed">
                                DeepMind Vaults enables you to create autonomous AI agents that manage DeFi positions across multiple chains.
                                Each agent is represented as an <strong className="text-white">ERC-8004 NFT</strong> on Base and can execute strategies on both
                                Uniswap v4 (EVM) and Sui DeepBook (Move).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <Shield className="w-8 h-8 text-green-400 mb-3" />
                                    <h3 className="font-semibold text-white mb-1">On-Chain Identity</h3>
                                    <p className="text-sm text-white/50">Each agent is an NFT with ENS integration for transparent decision logging.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <Cpu className="w-8 h-8 text-blue-400 mb-3" />
                                    <h3 className="font-semibold text-white mb-1">Hybrid AI</h3>
                                    <p className="text-sm text-white/50">Use platform AI, your own OpenAI key, OpenClaw, or custom endpoints.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                                    <h3 className="font-semibold text-white mb-1">Cross-Chain</h3>
                                    <p className="text-sm text-white/50">Execute on Base (Uniswap v4) and Sui (DeepBook) for optimal yields.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
                        <div className="bg-black/50 border border-white/10 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-white/40 text-sm ml-2">Terminal</span>
                            </div>
                            <pre className="p-4 text-sm text-green-400 overflow-x-auto">
                                {`# Clone the repository
git clone https://github.com/deepmind-vaults/deepmind-vaults.git
cd deepmind-vaults

# Install dependencies
pnpm install

# Start frontend
cd apps/web && pnpm dev

# Start backend (optional - for AI features)
cd apps/api && source venv/bin/activate && uvicorn main:app --reload`}
                            </pre>
                        </div>
                    </section>

                    {/* Create Agent */}
                    <section id="create-agent" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">Create Your First Agent</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                                <div>
                                    <h3 className="font-semibold text-white">Connect Wallet</h3>
                                    <p className="text-white/50 text-sm mt-1">Connect your MetaMask or WalletConnect wallet on Base Sepolia network.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">2</div>
                                <div>
                                    <h3 className="font-semibold text-white">Choose Strategy</h3>
                                    <p className="text-white/50 text-sm mt-1">Select Safe (5-8% APR), Balanced (10-15%), or Aggressive (20-35%).</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                                <div>
                                    <h3 className="font-semibold text-white">Select AI Provider</h3>
                                    <p className="text-white/50 text-sm mt-1">Use Platform AI (default) or bring your own AI (OpenAI, OpenClaw, Custom).</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">4</div>
                                <div>
                                    <h3 className="font-semibold text-white">Mint Agent NFT</h3>
                                    <p className="text-white/50 text-sm mt-1">Your ERC-8004 agent NFT is minted on Base Sepolia.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">5</div>
                                <div>
                                    <h3 className="font-semibold text-white">Fund & Activate</h3>
                                    <p className="text-white/50 text-sm mt-1">Deposit USDC and your agent starts executing autonomously.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Smart Contracts */}
                    <section id="deepmind-vault" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Code className="w-6 h-6 text-violet-400" />
                            Smart Contracts
                        </h2>

                        <div className="space-y-6">
                            {/* DeepMindVault */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">DeepMindVault.sol</h3>
                                    <a
                                        href="https://sepolia.basescan.org/address/0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                                    >
                                        View on BaseScan <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <p className="text-white/60 text-sm mb-4">ERC-8004 compliant NFT contract for AI agents.</p>
                                <div className="bg-black/50 rounded-lg p-3">
                                    <code className="text-xs text-green-400">
                                        0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c
                                    </code>
                                </div>
                            </div>

                            {/* ENS Manager */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">ENSTextRecordManager.sol</h3>
                                    <a
                                        href="https://sepolia.basescan.org/address/0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                                    >
                                        View on BaseScan <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <p className="text-white/60 text-sm mb-4">Logs agent decisions to ENS text records for transparency.</p>
                                <div className="bg-black/50 rounded-lg p-3">
                                    <code className="text-xs text-green-400">
                                        0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c
                                    </code>
                                </div>
                            </div>

                            {/* Sui Vault */}
                            <div id="sui-vault" className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">agent_vault.move</h3>
                                    <a
                                        href="https://suiscan.xyz/testnet/object/0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                                    >
                                        View on SuiScan <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <p className="text-white/60 text-sm mb-4">Sui Move contract for market making and arbitrage on DeepBook.</p>
                                <div className="bg-black/50 rounded-lg p-3">
                                    <code className="text-xs text-green-400 break-all">
                                        0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8
                                    </code>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Providers */}
                    <section id="platform-ai" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-violet-400" />
                            AI Providers
                        </h2>

                        <div id="byoa" className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-white mb-3">🤖 Hybrid AI Architecture</h3>
                            <p className="text-white/70 text-sm mb-4">
                                DeepMind Vaults supports "Bring Your Own AI" - you're not locked into any single AI provider.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="text-2xl mb-2">🤖</div>
                                    <h4 className="font-semibold text-white mb-1">Platform AI</h4>
                                    <p className="text-xs text-white/50">GPT-4o powered decisions (default)</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="text-2xl mb-2">🔑</div>
                                    <h4 className="font-semibold text-white mb-1">Your OpenAI Key</h4>
                                    <p className="text-xs text-white/50">Use your own API key</p>
                                </div>
                                <div id="openclaw" className="bg-black/30 rounded-lg p-4">
                                    <div className="text-2xl mb-2">🦞</div>
                                    <h4 className="font-semibold text-white mb-1">OpenClaw</h4>
                                    <p className="text-xs text-white/50">Connect your OpenClaw assistant</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="text-2xl mb-2">⚙️</div>
                                    <h4 className="font-semibold text-white mb-1">Custom Endpoint</h4>
                                    <p className="text-xs text-white/50">Local LLM or any API</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">Ready to Create Your Agent?</h2>
                        <p className="text-white/60 mb-6">Launch your autonomous AI-powered DeFi agent in minutes.</p>
                        <Link
                            href="/agents"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-white font-medium transition-all"
                        >
                            Create Agent <ChevronRight className="w-4 h-4" />
                        </Link>
                    </section>
                </main>
            </div>
        </div>
    );
}
