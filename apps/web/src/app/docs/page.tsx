import type { Metadata } from 'next';
import Link from 'next/link';
import { Book, Code, Cpu, Shield, Zap, ExternalLink, ChevronRight, ArrowRightLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Documentation | MoltQore',
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
            { name: 'Uniswap v4 Hook', href: '#uniswap-hook' },
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

// Deployed contracts
const contracts = {
    baseSepolia: [
        {
            name: 'DeepMindVault.sol',
            address: '0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c',
            description: 'ERC-8004 compliant NFT contract for AI agents.',
            explorer: 'https://sepolia.basescan.org/address/0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c',
        },
        {
            name: 'ENSTextRecordManager.sol',
            address: '0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3',
            description: 'Logs agent decisions to ENS text records for transparency.',
            explorer: 'https://sepolia.basescan.org/address/0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3',
        },
        {
            name: 'MockPublicResolver.sol',
            address: '0xD257737006c06C99709513A0491D585D5689316b',
            description: 'ENS text record storage for demo environment.',
            explorer: 'https://sepolia.basescan.org/address/0xD257737006c06C99709513A0491D585D5689316b',
        },
        {
            name: 'AgentRebalancerHook.sol',
            address: '0xdB045ac6bA8d7903fD3a566bFBf208955481dA49',
            description: 'Uniswap v4 hook for autonomous LP rebalancing.',
            explorer: 'https://sepolia.basescan.org/address/0xdB045ac6bA8d7903fD3a566bFBf208955481dA49',
        },
    ],
    sui: {
        name: 'agent_vault.move',
        packageId: '0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8',
        description: 'Sui Move contract for market making and arbitrage on DeepBook.',
        explorer: 'https://suiscan.xyz/testnet/object/0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8',
    },
};

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f1a]">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden">
                            <img src="/moltqore-logo.png" alt="MoltQore" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-white">MoltQore</span>
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
                                MoltQore enables you to create autonomous AI agents that manage DeFi positions across multiple chains.
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
git clone https://github.com/moltqore/moltqore.git
cd moltqore

# Install dependencies
pnpm install

# Start frontend
cd apps/web && pnpm dev

# Run demo script (shows all 6 real transactions)
./scripts/demo-flow.sh`}
                            </pre>
                        </div>
                    </section>

                    {/* Create Agent */}
                    <section id="create-agent" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">Create Your First Agent</h2>
                        <div className="space-y-4">
                            {[
                                { step: 1, title: 'Connect Wallet', desc: 'Connect your MetaMask or WalletConnect wallet on Base Sepolia network.' },
                                { step: 2, title: 'Choose Strategy', desc: 'Select Safe (5-8% APR), Balanced (10-15%), or Aggressive (20-35%).' },
                                { step: 3, title: 'Select AI Provider', desc: 'Use Platform AI (default) or bring your own AI (OpenAI, OpenClaw, Custom).' },
                                { step: 4, title: 'Mint Agent NFT', desc: 'Your ERC-8004 agent NFT is minted on Base Sepolia.' },
                                { step: 5, title: 'Fund & Activate', desc: 'Deposit USDC and your agent starts executing autonomously.' },
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">{step}</div>
                                    <div>
                                        <h3 className="font-semibold text-white">{title}</h3>
                                        <p className="text-white/50 text-sm mt-1">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Smart Contracts */}
                    <section id="deepmind-vault" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Code className="w-6 h-6 text-violet-400" />
                            Smart Contracts
                        </h2>

                        <div className="space-y-6">
                            {/* Base Sepolia Contracts */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                                    Base Sepolia
                                </h3>
                                <div className="space-y-4">
                                    {contracts.baseSepolia.map((contract) => (
                                        <div key={contract.address} id={contract.name.includes('ENS') ? 'ens-records' : contract.name.includes('Hook') ? 'uniswap-hook' : undefined} className="bg-white/5 border border-white/10 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-semibold text-white">{contract.name}</h4>
                                                <a
                                                    href={contract.explorer}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                                                >
                                                    View on BaseScan <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                            <p className="text-white/60 text-sm mb-4">{contract.description}</p>
                                            <div className="bg-black/50 rounded-lg p-3">
                                                <code className="text-xs text-green-400">
                                                    {contract.address}
                                                </code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sui Testnet */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                                    Sui Testnet
                                </h3>
                                <div id="sui-vault" className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-white">{contracts.sui.name}</h4>
                                        <a
                                            href={contracts.sui.explorer}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                                        >
                                            View on SuiScan <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <p className="text-white/60 text-sm mb-4">{contracts.sui.description}</p>
                                    <div className="bg-black/50 rounded-lg p-3">
                                        <code className="text-xs text-green-400 break-all">
                                            {contracts.sui.packageId}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Uniswap v4 Integration */}
                    <section id="uniswap-v4" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <ArrowRightLeft className="w-6 h-6 text-violet-400" />
                            Uniswap v4 Integration
                        </h2>
                        <div className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 rounded-xl p-6">
                            <p className="text-white/70 mb-4">
                                MoltQore uses the official Uniswap v4 PoolManager on Base Sepolia for autonomous LP management.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded-lg p-4">
                                    <h4 className="font-semibold text-white mb-2">🎣 AgentRebalancerHook</h4>
                                    <p className="text-xs text-white/50 mb-2">Implements afterSwap() callback for automatic LP rebalancing based on price drift.</p>
                                    <code className="text-xs text-pink-400">0xdB045ac6bA8d7903fD...49</code>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <h4 className="font-semibold text-white mb-2">🏊 PoolManager</h4>
                                    <p className="text-xs text-white/50 mb-2">Official Uniswap v4 PoolManager (singleton).</p>
                                    <code className="text-xs text-pink-400">0x05E73354cFDd6745C3...08</code>
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
                                MoltQore supports "Bring Your Own AI" - you're not locked into any single AI provider.
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

                    {/* Transaction Evidence */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            ✅ Verified Transactions
                        </h2>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                            <p className="text-white/70 mb-4">
                                All demo transactions are <strong className="text-green-400">REAL</strong> and verifiable on blockchain explorers:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span className="text-white/70">mintAgent (ERC-8004)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span className="text-white/70">registerAgentENS</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span className="text-white/70">logDecisionToENS</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span className="text-white/70">openPosition (Uniswap v4 Hook)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                                    <span className="text-white/70">create_vault (Sui)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                                    <span className="text-white/70">execute_market_making (Sui PTB)</span>
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
