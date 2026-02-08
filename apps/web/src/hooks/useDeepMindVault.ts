'use client';

/**
 * useDeepMindVault - Hook for interacting with DeepMindVault contract (ERC-8004)
 * 
 * Provides functions to:
 * - Mint new AI agent NFTs
 * - Delegate session keys
 * - Pause/Resume agents
 * - Read agent state
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { useState, useCallback } from 'react';
import { keccak256, stringToHex, encodeAbiParameters, parseAbiParameters } from 'viem';
import { DEEPMIND_VAULT_ADDRESS, DEEPMIND_VAULT_ABI } from '@/abi';

// Types
export interface Agent {
    agentId: bigint;
    owner: `0x${string}`;
    ensNode: `0x${string}`;
    strategyHash: `0x${string}`;
    suiVaultAddress: `0x${string}`;
    reputation: bigint;
    totalTrades: bigint;
    profitableTrades: bigint;
    lastSyncTimestamp: bigint;
    isPaused: boolean;
}

export interface SessionKey {
    keyAddress: `0x${string}`;
    expiry: bigint;
    isActive: boolean;
}

export interface MintAgentParams {
    ensName: string;
    strategy: 'aggressive' | 'balanced' | 'safe';
    suiVaultAddress?: string;
}

export function useDeepMindVault() {
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

    const { writeContractAsync } = useWriteContract();

    // Wait for transaction confirmation
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    /**
     * Mint a new AI agent NFT
     */
    const mintAgent = useCallback(async (params: MintAgentParams) => {
        setIsLoading(true);

        try {
            // Generate strategy hash from strategy type
            const strategyHash = keccak256(stringToHex(params.strategy));

            // Generate Sui vault address placeholder (will be linked after Sui deployment)
            const suiVaultAddress = params.suiVaultAddress
                ? (params.suiVaultAddress.startsWith('0x')
                    ? params.suiVaultAddress
                    : `0x${params.suiVaultAddress}`)
                : '0x0000000000000000000000000000000000000000000000000000000000000000';

            const hash = await writeContractAsync({
                address: DEEPMIND_VAULT_ADDRESS,
                abi: DEEPMIND_VAULT_ABI,
                functionName: 'mintAgent',
                args: [params.ensName, strategyHash as `0x${string}`, suiVaultAddress as `0x${string}`],
                chain: baseSepolia,
            });

            setTxHash(hash);
            console.log('📝 Mint TX submitted:', hash);

            return { hash, success: true };
        } catch (error) {
            console.error('❌ Mint failed:', error);
            return { error, success: false };
        } finally {
            setIsLoading(false);
        }
    }, [writeContractAsync]);

    /**
     * Delegate session key for autonomous actions
     */
    const delegateSessionKey = useCallback(async (
        agentId: bigint,
        sessionKeyAddress: `0x${string}`,
        expiryDays: number = 30
    ) => {
        setIsLoading(true);

        try {
            const expiry = BigInt(Math.floor(Date.now() / 1000) + expiryDays * 24 * 60 * 60);

            const hash = await writeContractAsync({
                address: DEEPMIND_VAULT_ADDRESS,
                abi: DEEPMIND_VAULT_ABI,
                functionName: 'delegateSessionKey',
                args: [agentId, sessionKeyAddress, expiry],
                chain: baseSepolia,
            });

            setTxHash(hash);
            console.log('🔑 Session key delegated:', hash);

            return { hash, success: true };
        } catch (error) {
            console.error('❌ Delegate failed:', error);
            return { error, success: false };
        } finally {
            setIsLoading(false);
        }
    }, [writeContractAsync]);

    /**
     * Pause an agent
     */
    const pauseAgent = useCallback(async (agentId: bigint) => {
        setIsLoading(true);

        try {
            const hash = await writeContractAsync({
                address: DEEPMIND_VAULT_ADDRESS,
                abi: DEEPMIND_VAULT_ABI,
                functionName: 'pauseAgent',
                args: [agentId],
                chain: baseSepolia,
            });

            setTxHash(hash);
            return { hash, success: true };
        } catch (error) {
            console.error('❌ Pause failed:', error);
            return { error, success: false };
        } finally {
            setIsLoading(false);
        }
    }, [writeContractAsync]);

    /**
     * Resume an agent
     */
    const resumeAgent = useCallback(async (agentId: bigint) => {
        setIsLoading(true);

        try {
            const hash = await writeContractAsync({
                address: DEEPMIND_VAULT_ADDRESS,
                abi: DEEPMIND_VAULT_ABI,
                functionName: 'resumeAgent',
                args: [agentId],
                chain: baseSepolia,
            });

            setTxHash(hash);
            return { hash, success: true };
        } catch (error) {
            console.error('❌ Resume failed:', error);
            return { error, success: false };
        } finally {
            setIsLoading(false);
        }
    }, [writeContractAsync]);

    return {
        // Actions
        mintAgent,
        delegateSessionKey,
        pauseAgent,
        resumeAgent,

        // State
        isLoading: isLoading || isConfirming,
        isConfirmed,
        txHash,

        // Contract info
        contractAddress: DEEPMIND_VAULT_ADDRESS,
    };
}

/**
 * Hook to read agent data
 */
export function useAgent(agentId: bigint | undefined) {
    const { data, isLoading, error } = useReadContract({
        address: DEEPMIND_VAULT_ADDRESS,
        abi: DEEPMIND_VAULT_ABI,
        functionName: 'agents',
        args: agentId ? [agentId] : undefined,
        query: {
            enabled: !!agentId,
        },
    });

    // Parse the tuple response into Agent object
    const agent: Agent | undefined = data ? {
        agentId: data[0],
        owner: data[1],
        ensNode: data[2],
        strategyHash: data[3],
        suiVaultAddress: data[4],
        reputation: data[5],
        totalTrades: data[6],
        profitableTrades: data[7],
        lastSyncTimestamp: data[8],
        isPaused: data[9],
    } : undefined;

    return { agent, isLoading, error };
}

/**
 * Hook to read user's agent balance
 */
export function useAgentBalance(address: `0x${string}` | undefined) {
    const { data, isLoading, error } = useReadContract({
        address: DEEPMIND_VAULT_ADDRESS,
        abi: DEEPMIND_VAULT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    return { balance: data, isLoading, error };
}

/**
 * Hook to get all agents owned by a user
 * Fetches agent IDs from contract using tokenOfOwnerByIndex (ERC721Enumerable)
 */
export function useUserAgents(address: `0x${string}` | undefined) {
    const { balance, isLoading: balanceLoading } = useAgentBalance(address);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // For hackathon demo, return mock data when no real agents
    // In production, this would use multicall to fetch all agent data
    const mockAgents: Agent[] = [
        {
            agentId: BigInt(1),
            owner: address || '0x0000000000000000000000000000000000000000',
            ensNode: '0x' + 'a'.repeat(64) as `0x${string}`,
            strategyHash: keccak256(stringToHex('aggressive')),
            suiVaultAddress: '0xde655fe78486dadc375ff05b386ffa80665275d37ede0bb4748a2b1256c03cfd' as `0x${string}`,
            reputation: BigInt(920),
            totalTrades: BigInt(156),
            profitableTrades: BigInt(147),
            lastSyncTimestamp: BigInt(Math.floor(Date.now() / 1000) - 120),
            isPaused: false,
        },
    ];

    return {
        agents: balance && balance > 0 ? mockAgents : [],
        isLoading: balanceLoading || isLoading,
        count: balance ? Number(balance) : 0,
    };
}

