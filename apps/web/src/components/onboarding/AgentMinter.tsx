'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Zap, Loader2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

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

// DeepMindVault ABI (minimal)
const DEEPMIND_VAULT_ABI = [
    {
        inputs: [
            { name: 'ensName', type: 'string' },
            { name: 'strategyHash', type: 'bytes32' },
            { name: 'suiVault', type: 'bytes32' }
        ],
        name: 'mintAgent',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const;

export function AgentMinter() {
    const [step, setStep] = useState(1);
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy>('balanced');
    const [ensName, setEnsName] = useState('');
    const [fundingAmount, setFundingAmount] = useState('1000');

    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Generate random ENS name
    const generateENSName = () => {
        const randomId = Math.floor(Math.random() * 10000);
        setEnsName(`agent-${randomId}.deepmind.eth`);
    };

    // Mint agent NFT
    const handleMint = async () => {
        if (!ensName) {
            generateENSName();
            return;
        }

        // Convert strategy to bytes32
        const strategyHash = `0x${Buffer.from(selectedStrategy.padEnd(32, '\0')).toString('hex')}` as `0x${string}`;
        const suiVaultId = `0x${Buffer.from(`sui-vault-${Date.now()}`.padEnd(32, '\0')).toString('hex')}` as `0x${string}`;

        writeContract({
            address: (process.env.NEXT_PUBLIC_DEEPMIND_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
            abi: DEEPMIND_VAULT_ABI,
            functionName: 'mintAgent',
            args: [ensName, strategyHash, suiVaultId],
        });
    };

    const progressPercent = (step / 4) * 100;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm text-white/60">
                    <span>Step {step} of 4</span>
                    <span>{progressPercent}% Complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                    />
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
                                                ? 'border-accent-500 bg-accent-500/10'
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
                                className="btn-primary flex items-center gap-2"
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
                        <div className="card">
                            <h2 className="text-2xl font-bold text-white mb-2">Configure Your Agent</h2>
                            <p className="text-white/60 mb-6">Set up your agent's identity and preferences</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        ENS Name
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            value={ensName}
                                            onChange={(e) => setEnsName(e.target.value)}
                                            placeholder="agent-42.deepmind.eth"
                                            className="flex-1 px-4 py-3 bg-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                        />
                                        <button
                                            onClick={generateENSName}
                                            className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                    <p className="text-xs text-white/40 mt-1">
                                        This will be your agent's on-chain identity
                                    </p>
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl">
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
                                className="btn-primary flex items-center gap-2"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Mint NFT */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="card">
                            <h2 className="text-2xl font-bold text-white mb-2">Mint Your Agent NFT</h2>
                            <p className="text-white/60 mb-6">Create your ERC-8004 autonomous agent</p>

                            {!isSuccess ? (
                                <div className="space-y-4">
                                    <div className="bg-primary-500/10 border border-primary-500/30 p-4 rounded-xl">
                                        <p className="text-sm text-white/80">
                                            You're about to create <strong className="text-accent-400">{ensName || 'your agent'}</strong> with
                                            a <span className={strategies[selectedStrategy].color}>{selectedStrategy}</span> strategy.
                                            This will mint an NFT that represents your AI agent.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleMint}
                                        disabled={isPending || isConfirming || !isConnected}
                                        className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {(isPending || isConfirming) ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {isPending ? 'Confirm in wallet...' : 'Minting...'}
                                            </span>
                                        ) : !isConnected ? (
                                            'Connect Wallet First'
                                        ) : (
                                            'Mint Agent NFT'
                                        )}
                                    </button>

                                    {hash && (
                                        <p className="text-xs text-white/50 text-center">
                                            Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                                        </p>
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
                                        Your agent NFT has been minted successfully
                                    </p>
                                    <button
                                        onClick={() => setStep(4)}
                                        className="btn-primary"
                                    >
                                        Fund Your Vault
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isSuccess && (
                            <div className="flex justify-start mt-8">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 4: Fund Vault */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="card">
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
                                        className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                    />
                                    <p className="text-xs text-white/40 mt-1">Minimum: 100 USDC</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left">
                                        <div className="text-2xl mb-2">💳</div>
                                        <div className="font-semibold text-white mb-1">Credit Card</div>
                                        <div className="text-xs text-white/50">Via Circle Gateway</div>
                                    </button>

                                    <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left">
                                        <div className="text-2xl mb-2">🔗</div>
                                        <div className="font-semibold text-white mb-1">Crypto</div>
                                        <div className="text-xs text-white/50">From any chain</div>
                                    </button>
                                </div>

                                <button className="w-full btn-primary py-4 text-lg">
                                    Deposit & Start Agent
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
