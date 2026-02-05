'use client';

import { useReadContract } from 'wagmi';
import useSWR from 'swr';

// Interfaces
interface AgentDecision {
    decision: string | null;
    reasoning: string | null;
    pnl: string | null;
    timestamp: Date | null;
}

interface AgentPerformance {
    reputation: number;
    totalTrades: number;
    winRate: number;
    aum: string | null;
}

interface AgentVaultAddresses {
    suiVault: string | null;
    ethVault: string | null;
}

interface Agent {
    id: number;
    ensName: string;
    strategy: string;
    reputation: number;
    winRate: number;
    totalProfit: number;
}

// ENS Public Resolver ABI (text record functions)
const ENS_RESOLVER_ABI = [
    {
        inputs: [
            { name: 'node', type: 'bytes32' },
            { name: 'key', type: 'string' }
        ],
        name: 'text',
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

// ENS Public Resolver address (mainnet)
const ENS_RESOLVER = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41';

// Convert ENS name to namehash
function namehash(name: string): `0x${string}` {
    let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (name) {
        const labels = name.split('.');
        for (let i = labels.length - 1; i >= 0; i--) {
            const label = labels[i];
            if (label) {
                const labelHash = keccak256(label);
                node = keccak256(node + labelHash.slice(2));
            }
        }
    }
    return node as `0x${string}`;
}

// Simple keccak256 (for demo - use viem/ethers in production)
function keccak256(input: string): string {
    // Placeholder - in production use proper keccak256
    return '0x' + Array(64).fill('0').join('');
}

/**
 * Hook to get agent's latest decision from ENS text records
 */
export function useAgentDecision(agentId: number): AgentDecision & { isLoading: boolean } {
    const ensName = `agent-${agentId}.deepmind.eth`;
    const node = namehash(ensName);

    const { data: lastDecision, isLoading: loadingDecision } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.last_decision'],
    });

    const { data: reasoning, isLoading: loadingReasoning } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.last_reasoning'],
    });

    const { data: pnl } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.last_pnl'],
    });

    const { data: timestamp } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.timestamp'],
    });

    return {
        decision: lastDecision || null,
        reasoning: reasoning || null,
        pnl: pnl || null,
        timestamp: timestamp ? new Date(Number(timestamp) * 1000) : null,
        isLoading: loadingDecision || loadingReasoning,
    };
}

/**
 * Hook to get agent's performance metrics from ENS
 */
export function useAgentPerformance(agentId: number): AgentPerformance & { isLoading: boolean } {
    const ensName = `agent-${agentId}.deepmind.eth`;
    const node = namehash(ensName);

    const { data: reputation, isLoading: loadingRep } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.reputation'],
    });

    const { data: totalTrades } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.total_trades'],
    });

    const { data: winRate } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.win_rate'],
    });

    const { data: aum } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.aum'],
    });

    return {
        reputation: reputation ? parseInt(reputation.split('/')[0] ?? '750') : 750,
        totalTrades: totalTrades ? parseInt(totalTrades) : 42,
        winRate: winRate ? parseFloat(winRate.replace('%', '')) : 68.5,
        aum: aum || '$45,234',
        isLoading: loadingRep,
    };
}

/**
 * Hook to get agent's vault addresses
 */
export function useAgentVaultAddresses(agentId: number): AgentVaultAddresses {
    const ensName = `agent-${agentId}.deepmind.eth`;
    const node = namehash(ensName);

    const { data: suiVault } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.sui_vault'],
    });

    const { data: ethVault } = useReadContract({
        address: ENS_RESOLVER,
        abi: ENS_RESOLVER_ABI,
        functionName: 'text',
        args: [node, 'agent.eth_vault'],
    });

    return {
        suiVault: suiVault || null,
        ethVault: ethVault || null,
    };
}

/**
 * Hook to discover all agents
 */
export function useAllAgents() {
    const { data, error, isLoading } = useSWR<Agent[]>('/api/agents/all', async (url: string) => {
        // Mock data for demo
        return [
            {
                id: 1,
                ensName: 'agent-1.deepmind.eth',
                strategy: 'aggressive',
                reputation: 850,
                winRate: 72.3,
                totalProfit: 12450,
            },
            {
                id: 2,
                ensName: 'agent-2.deepmind.eth',
                strategy: 'balanced',
                reputation: 720,
                winRate: 68.1,
                totalProfit: 8920,
            },
            {
                id: 3,
                ensName: 'agent-3.deepmind.eth',
                strategy: 'safe',
                reputation: 680,
                winRate: 65.5,
                totalProfit: 4230,
            },
        ];
    });

    return {
        agents: data || [],
        isLoading,
        error,
    };
}
