'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Zap, Loader2, CheckCircle, ArrowRight, ArrowLeft, Bot, Cpu } from 'lucide-react';
import { useMintAgent, useDelegateSessionKey } from '@/hooks/useAgentContract';
import { useAIProvider, AI_PROVIDERS, AIProviderType } from '@/hooks/useAIProvider';

type Strategy = 'aggressive' | 'balanced' | 'safe';

const strategies: Record<Strategy, {
    name: string;
    description: string;
    apr: string;
    risk: string;
    icon: typeof Shield;
    color: string;
    bgColor: string;
}> = {
    safe: {
        name: 'Safe',
        description: 'Low risk, stable returns. Focus on stablecoins and established protocols.',
        apr: '5-8%',
        risk: 'Low',
        icon: Shield,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
    },
    balanced: {
        name: 'Balanced',
        description: 'Medium risk, balanced approach. Mix of LPs, lending, and market making.',
        apr: '10-15%',
        risk: 'Medium',
        icon: TrendingUp,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
    },
    aggressive: {
        name: 'Aggressive',
        description: 'High risk, maximum returns. Arbitrage, leverage, and active trading.',
        apr: '20-35%',
        risk: 'High',
        icon: Zap,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
    },
};

export function AgentMinter() {
    const [step, setStep] = useState(1);
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy>('balanced');
    const [ensName, setEnsName] = useState('');
    const [fundingAmount, setFundingAmount] = useState('1000');
    const [selectedAIProvider, setSelectedAIProvider] = useState<AIProviderType>('platform');
    const [openaiKey, setOpenaiKey] = useState('');
    const [customEndpoint, setCustomEndpoint] = useState('');
    const [mintedAgentId, setMintedAgentId] = useState<bigint | null>(null);

    const { address, isConnected } = useAccount();
    const { provider, setProvider } = useAIProvider();

    // Use the contract hooks
    const {
        mint,
        isPending: isMinting,
        isConfirming,
        isSuccess: isMinted,
        hash,
        error: mintError
    } = useMintAgent();

    const {
        delegate,
        isPending: isDelegating,
        isSuccess: isDelegated,
    } = useDelegateSessionKey();

    // Generate random ENS name
    const generateENSName = () => {
        const prefixes = ['alpha', 'beta', 'gamma', 'delta', 'omega', 'sigma', 'theta'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomId = Math.floor(Math.random() * 1000);
        setEnsName(`${prefix}-${randomId}.moltqore.eth`);
    };

    // Auto-generate ENS name on mount
    useEffect(() => {
        if (!ensName) {
            generateENSName();
        }
    }, []);

    // Convert strategy to bytes32
    const strategyToBytes32 = (strategy: string): `0x${string}` => {
        const hex = Buffer.from(strategy.padEnd(32, '\0')).toString('hex');
        return `0x${hex}` as `0x${string}`;
    };

    // Mint agent NFT
    const handleMint = async () => {
        if (!ensName) {
            generateENSName();
            return;
        }

        const strategyHash = strategyToBytes32(selectedStrategy);
        const suiVaultId = strategyToBytes32(`sui-vault-${Date.now()}`);

        try {
            mint(ensName, selectedStrategy, suiVaultId as `0x${string}`);
        } catch (err) {
            console.error('Mint error:', err);
        }
    };

    // Handle AI provider selection and save
    const handleAIProviderChange = (type: AIProviderType) => {
        setSelectedAIProvider(type);

        if (type === 'platform') {
            setProvider({ type: 'platform' });
        }
    };

    const saveAIProvider = () => {
        if (selectedAIProvider === 'openai' && openaiKey) {
            setProvider({ type: 'openai', apiKey: openaiKey });
        } else if (selectedAIProvider === 'custom' && customEndpoint) {
            setProvider({ type: 'custom', endpoint: customEndpoint });
        } else if (selectedAIProvider === 'openclaw') {
            setProvider({ type: 'openclaw', webhookUrl: '' });
        }
    };

    const progressPercent = (step / 5) * 100;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm text-white/60">
                    <span>Step {step} of 5</span>
                    <span>{Math.round(progressPercent)}% Complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    {['Strategy', 'Configure', 'AI Provider', 'Mint', 'Fund'].map((label, i) => (
                        <span
                            key={label}
                            className={`text-xs ${step > i ? 'text-violet-400' : 'text-white/30'}`}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Choose Strategy */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Strategy</h2>
                            <p className="text-white/60">Select the risk profile that matches your goals</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(Object.entries(strategies) as [Strategy, typeof strategies[Strategy]][]).map(([key, strategy]) => {
                                const Icon = strategy.icon;
                                const isSelected = selectedStrategy === key;

                                return (
                                    <motion.div
                                        key={key}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedStrategy(key)}
                                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${isSelected
                                            ? 'border-violet-500 bg-violet-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-xl ${strategy.bgColor} flex items-center justify-center mb-4`}>
                                            <Icon className={`w-7 h-7 ${strategy.color}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{strategy.name}</h3>
                                        <p className="text-white/50 text-sm mb-4 h-16">{strategy.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/40">Target APR</span>
                                                <span className="text-white font-semibold">{strategy.apr}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/40">Risk Level</span>
                                                <span className={strategy.color}>{strategy.risk}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-white font-medium transition-all flex items-center gap-2"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Configure Agent */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Configure Your Agent</h2>
                            <p className="text-white/60 mb-6">Set up your agent's identity</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        ENS Name
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            value={ensName}
                                            onChange={(e) => setEnsName(e.target.value)}
                                            placeholder="agent-42.moltqore.eth"
                                            className="flex-1 px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                        <button
                                            onClick={generateENSName}
                                            className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                                        >
                                            🎲 Random
                                        </button>
                                    </div>
                                    <p className="text-xs text-white/40 mt-1">
                                        This will be your agent's on-chain identity
                                    </p>
                                </div>

                                <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                                    <h4 className="font-medium text-white mb-3">Strategy Summary</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-white/50">Type</span>
                                            <span className="text-white font-medium capitalize">{selectedStrategy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/50">Target APR</span>
                                            <span className="text-white font-medium">{strategies[selectedStrategy].apr}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/50">Risk</span>
                                            <span className={strategies[selectedStrategy].color}>
                                                {strategies[selectedStrategy].risk}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-white font-medium transition-all flex items-center gap-2"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Choose AI Provider */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Choose AI Provider</h2>
                                    <p className="text-white/60">Select how your agent makes decisions</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(Object.entries(AI_PROVIDERS) as [AIProviderType, typeof AI_PROVIDERS[AIProviderType]][]).map(([type, info]) => (
                                    <motion.div
                                        key={type}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => handleAIProviderChange(type)}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedAIProvider === type
                                            ? 'border-violet-500 bg-violet-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{info.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-semibold text-white">{info.name}</div>
                                                <div className="text-sm text-white/50 mt-1">{info.description}</div>

                                                {/* Config inputs */}
                                                {selectedAIProvider === type && info.requiresConfig && (
                                                    <div className="mt-3" onClick={e => e.stopPropagation()}>
                                                        {type === 'openai' && (
                                                            <input
                                                                type="password"
                                                                placeholder="sk-..."
                                                                value={openaiKey}
                                                                onChange={(e) => setOpenaiKey(e.target.value)}
                                                                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-sm text-white placeholder-white/30"
                                                            />
                                                        )}
                                                        {type === 'custom' && (
                                                            <input
                                                                type="url"
                                                                placeholder="http://localhost:8080/ai"
                                                                value={customEndpoint}
                                                                onChange={(e) => setCustomEndpoint(e.target.value)}
                                                                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-sm text-white placeholder-white/30"
                                                            />
                                                        )}
                                                        {type === 'openclaw' && (
                                                            <p className="text-xs text-violet-300">OpenClaw will connect automatically</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {selectedAIProvider === type && (
                                                <span className="text-violet-400 text-lg">✓</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/10">
                                <div className="flex items-start gap-3">
                                    <Cpu className="w-5 h-5 text-fuchsia-400 mt-0.5" />
                                    <div className="text-sm text-white/70">
                                        <strong className="text-white">Hybrid AI:</strong> Your agent can use any AI to make decisions.
                                        Platform AI is default, but you can bring your own OpenAI key, use OpenClaw,
                                        or connect a custom local LLM.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={() => {
                                    saveAIProvider();
                                    setStep(4);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-white font-medium transition-all flex items-center gap-2"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Mint NFT */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Mint Your Agent NFT</h2>
                            <p className="text-white/60 mb-6">Create your ERC-8004 autonomous agent on Base</p>

                            {!isMinted ? (
                                <div className="space-y-4">
                                    {/* Summary */}
                                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 p-4 rounded-xl">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-white/50">Agent Name</span>
                                                <div className="text-white font-medium mt-1">{ensName}</div>
                                            </div>
                                            <div>
                                                <span className="text-white/50">Strategy</span>
                                                <div className={`font-medium mt-1 ${strategies[selectedStrategy].color}`}>
                                                    {strategies[selectedStrategy].name}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-white/50">AI Provider</span>
                                                <div className="text-white font-medium mt-1">
                                                    {AI_PROVIDERS[selectedAIProvider].icon} {AI_PROVIDERS[selectedAIProvider].name}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-white/50">Network</span>
                                                <div className="text-white font-medium mt-1">Base Sepolia</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Display */}
                                    {mintError && (
                                        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-sm">
                                            Error: {mintError.message}
                                        </div>
                                    )}

                                    {/* Mint Button */}
                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting || isConfirming || !isConnected}
                                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-white font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {(isMinting || isConfirming) ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {isMinting ? 'Confirm in wallet...' : 'Minting on-chain...'}
                                            </span>
                                        ) : !isConnected ? (
                                            'Connect Wallet First'
                                        ) : (
                                            '🚀 Mint Agent NFT'
                                        )}
                                    </button>

                                    {hash && (
                                        <a
                                            href={`https://sepolia.basescan.org/tx/${hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-xs text-violet-400 hover:text-violet-300 text-center"
                                        >
                                            View transaction: {hash.slice(0, 10)}...{hash.slice(-8)} ↗
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
                                    </motion.div>
                                    <h3 className="text-2xl font-semibold text-white mb-2">Agent Created! 🎉</h3>
                                    <p className="text-white/60 mb-6">
                                        Your ERC-8004 agent NFT has been minted on Base Sepolia
                                    </p>
                                    <button
                                        onClick={() => setStep(5)}
                                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium"
                                    >
                                        Fund Your Vault →
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isMinted && (
                            <div className="flex justify-start mt-8">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 5: Fund Vault */}
                {step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Fund Your Vault</h2>
                            <p className="text-white/60 mb-6">Deposit USDC to start autonomous trading</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Amount (USDC)
                                    </label>
                                    <input
                                        type="number"
                                        value={fundingAmount}
                                        onChange={(e) => setFundingAmount(e.target.value)}
                                        placeholder="1000"
                                        min="100"
                                        step="100"
                                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                    <p className="text-xs text-white/40 mt-1">Minimum: 100 USDC</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left group">
                                        <div className="text-2xl mb-2">💳</div>
                                        <div className="font-semibold text-white mb-1 group-hover:text-violet-300">Credit Card</div>
                                        <div className="text-xs text-white/50">Via Circle Gateway</div>
                                    </button>

                                    <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left group">
                                        <div className="text-2xl mb-2">🔗</div>
                                        <div className="font-semibold text-white mb-1 group-hover:text-violet-300">Crypto</div>
                                        <div className="text-xs text-white/50">From any chain</div>
                                    </button>
                                </div>

                                <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-white font-medium text-lg transition-all">
                                    🚀 Deposit & Start Agent
                                </button>

                                <p className="text-center text-sm text-white/40">
                                    Or{' '}
                                    <a href="/dashboard" className="text-violet-400 hover:text-violet-300">
                                        skip to dashboard →
                                    </a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
