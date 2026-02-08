"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, toBytes } from 'viem';

// Contract addresses - update these after deployment
export const CONTRACTS = {
    DeepMindVault: (process.env.NEXT_PUBLIC_DEEPMIND_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    ENSManager: (process.env.NEXT_PUBLIC_ENS_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
} as const;

// Simplified ABI for DeepMindVault
export const DEEPMIND_VAULT_ABI = [
    {
        name: 'mintAgent',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'ensName', type: 'string' },
            { name: 'strategyHash', type: 'bytes32' },
            { name: 'suiVaultAddress', type: 'bytes32' },
        ],
        outputs: [{ name: 'agentId', type: 'uint256' }],
    },
    {
        name: 'delegateSessionKey',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'sessionKey', type: 'address' },
            { name: 'expiry', type: 'uint256' },
        ],
        outputs: [],
    },
    {
        name: 'updateStrategy',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'newStrategy', type: 'bytes32' },
        ],
        outputs: [],
    },
    {
        name: 'pauseAgent',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [],
    },
    {
        name: 'resumeAgent',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [],
    },
    {
        name: 'getAgent',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'agentId', type: 'uint256' },
                    { name: 'owner', type: 'address' },
                    { name: 'ensNode', type: 'bytes32' },
                    { name: 'strategyHash', type: 'bytes32' },
                    { name: 'suiVaultAddress', type: 'bytes32' },
                    { name: 'reputation', type: 'uint256' },
                    { name: 'totalTrades', type: 'uint256' },
                    { name: 'profitableTrades', type: 'uint256' },
                    { name: 'lastSyncTimestamp', type: 'uint256' },
                    { name: 'isPaused', type: 'bool' },
                ],
            },
        ],
    },
    {
        name: 'getAgentState',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'configHash', type: 'bytes32' },
                    { name: 'reputation', type: 'uint256' },
                    { name: 'lastActionTime', type: 'uint256' },
                    { name: 'isPaused', type: 'bool' },
                ],
            },
        ],
    },
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'ownerOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [{ name: '', type: 'address' }],
    },
    // Events
    {
        name: 'AgentMinted',
        type: 'event',
        inputs: [
            { name: 'agentId', type: 'uint256', indexed: true },
            { name: 'owner', type: 'address', indexed: true },
            { name: 'ensNode', type: 'bytes32', indexed: false },
            { name: 'suiVault', type: 'bytes32', indexed: false },
        ],
    },
] as const;

// Agent data type
export interface AgentData {
    agentId: bigint;
    owner: string;
    ensNode: string;
    strategyHash: string;
    suiVaultAddress: string;
    reputation: bigint;
    totalTrades: bigint;
    profitableTrades: bigint;
    lastSyncTimestamp: bigint;
    isPaused: boolean;
}

/**
 * Hook to mint a new agent NFT
 */
export function useMintAgent(): {
    mint: (ensName: string, strategy: string, suiVaultId?: string) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
} {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const mint = (ensName: string, strategy: string, suiVaultId?: string) => {
        const strategyHash = keccak256(toBytes(strategy));
        const suiVault = suiVaultId
            ? keccak256(toBytes(suiVaultId))
            : keccak256(toBytes(`sui-vault-${Date.now()}`));

        writeContract({
            address: CONTRACTS.DeepMindVault,
            abi: DEEPMIND_VAULT_ABI,
            functionName: 'mintAgent',
            args: [ensName, strategyHash, suiVault],
        });
    };

    return {
        mint,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error
    };
}

/**
 * Hook to delegate a session key for autonomous agent actions
 */
export function useDelegateSessionKey(): {
    delegate: (agentId: bigint, sessionKey: `0x${string}`, expiryDays?: number) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
} {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const delegate = (agentId: bigint, sessionKey: `0x${string}`, expiryDays: number = 60) => {
        const expiry = BigInt(Math.floor(Date.now() / 1000) + expiryDays * 24 * 60 * 60);

        writeContract({
            address: CONTRACTS.DeepMindVault,
            abi: DEEPMIND_VAULT_ABI,
            functionName: 'delegateSessionKey',
            args: [agentId, sessionKey, expiry],
        });
    };

    return { delegate, hash, isPending, isConfirming, isSuccess, error };
}

/**
 * Hook to update agent strategy
 */
export function useUpdateStrategy(): {
    updateStrategy: (agentId: bigint, newStrategy: string) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
} {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const updateStrategy = (agentId: bigint, newStrategy: string) => {
        const strategyHash = keccak256(toBytes(newStrategy));

        writeContract({
            address: CONTRACTS.DeepMindVault,
            abi: DEEPMIND_VAULT_ABI,
            functionName: 'updateStrategy',
            args: [agentId, strategyHash],
        });
    };

    return { updateStrategy, hash, isPending, isConfirming, isSuccess, error };
}

/**
 * Hook to pause an agent
 */
export function usePauseAgent(): {
    pause: (agentId: bigint) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
} {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const pause = (agentId: bigint) => {
        writeContract({
            address: CONTRACTS.DeepMindVault,
            abi: DEEPMIND_VAULT_ABI,
            functionName: 'pauseAgent',
            args: [agentId],
        });
    };

    return { pause, hash, isPending, isConfirming, isSuccess, error };
}

/**
 * Hook to resume a paused agent
 */
export function useResumeAgent(): {
    resume: (agentId: bigint) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
} {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const resume = (agentId: bigint) => {
        writeContract({
            address: CONTRACTS.DeepMindVault,
            abi: DEEPMIND_VAULT_ABI,
            functionName: 'resumeAgent',
            args: [agentId],
        });
    };

    return { resume, hash, isPending, isConfirming, isSuccess, error };
}

/**
 * Hook to read agent data
 */
export function useAgentData(agentId: bigint | undefined) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.DeepMindVault,
        abi: DEEPMIND_VAULT_ABI,
        functionName: 'getAgent',
        args: agentId ? [agentId] : undefined,
        query: {
            enabled: !!agentId,
        },
    });

    return {
        agent: data as AgentData | undefined,
        isLoading,
        error,
        refetch
    };
}

/**
 * Hook to get user's agent NFT balance
 */
export function useAgentBalance(address: `0x${string}` | undefined) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.DeepMindVault,
        abi: DEEPMIND_VAULT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    return {
        balance: data as bigint | undefined,
        isLoading,
        error,
        refetch
    };
}

/**
 * Hook to get agent ERC-8004 state
 */
export function useAgentState(agentId: bigint | undefined) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.DeepMindVault,
        abi: DEEPMIND_VAULT_ABI,
        functionName: 'getAgentState',
        args: agentId ? [agentId] : undefined,
        query: {
            enabled: !!agentId,
        },
    });

    return {
        state: data as {
            configHash: string;
            reputation: bigint;
            lastActionTime: bigint;
            isPaused: boolean;
        } | undefined,
        isLoading,
        error,
        refetch
    };
}
