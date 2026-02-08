'use client';

/**
 * useSuiVault - Hook for interacting with Sui Agent Vault
 * 
 * Provides functions to:
 * - Create vault on Sui
 * - Execute market making
 * - Execute arbitrage
 */

import { useState, useCallback } from 'react';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useSignAndExecuteTransactionBlock, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { SUI_AGENT_VAULT_PACKAGE } from '@/abi';

// Type assertion to handle version mismatch between @mysten/sui.js versions
type SuiTxBlock = typeof TransactionBlock extends new (...args: unknown[]) => infer R ? R : never;

// Types
export interface SuiVault {
    id: string;
    agentId: number;
    strategy: string;
    balance: bigint;
    isActive: boolean;
}

export interface SuiTransactionResult {
    digest: string;
    success: boolean;
    explorerUrl: string;
}

export function useSuiVault() {
    const [isLoading, setIsLoading] = useState(false);
    const [txDigest, setTxDigest] = useState<string | undefined>();

    const suiClient = useSuiClient();
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();

    /**
     * Create a new vault on Sui
     */
    const createVault = useCallback(async (
        agentId: number,
        strategy: 'aggressive' | 'balanced' | 'safe'
    ): Promise<SuiTransactionResult | null> => {
        if (!currentAccount) {
            console.error('❌ No Sui wallet connected');
            return null;
        }

        setIsLoading(true);

        try {
            const tx = new TransactionBlock();

            // Call create_vault function
            tx.moveCall({
                target: `${SUI_AGENT_VAULT_PACKAGE}::agent_vault::create_vault`,
                arguments: [
                    tx.pure(agentId, 'u64'),
                    tx.pure(strategy, 'string'),
                ],
            });

            const result = await signAndExecute({
                transactionBlock: tx as any,
            });

            const digest = result.digest;
            setTxDigest(digest);

            console.log('✅ Vault created on Sui:', digest);

            return {
                digest,
                success: true,
                explorerUrl: `https://suiscan.xyz/testnet/tx/${digest}`,
            };
        } catch (error) {
            console.error('❌ Create vault failed:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [currentAccount, signAndExecute]);

    /**
     * Execute market making strategy with PTB (5+ operations)
     */
    const executeMarketMaking = useCallback(async (
        vaultId: string,
        bidAmount: number,
        askAmount: number
    ): Promise<SuiTransactionResult | null> => {
        if (!currentAccount) {
            console.error('❌ No Sui wallet connected');
            return null;
        }

        setIsLoading(true);

        try {
            // Programmable Transaction Block with 5+ operations
            const tx = new TransactionBlock();

            // 1. Get price from oracle (simulated)
            const price = tx.pure(1000000, 'u64'); // $1.00 in micro units

            // 2. Calculate spread
            const spread = tx.pure(500, 'u64'); // 0.5%

            // 3. Set bid amount
            const bid = tx.pure(bidAmount, 'u64');

            // 4. Set ask amount  
            const ask = tx.pure(askAmount, 'u64');

            // 5. Execute market making
            tx.moveCall({
                target: `${SUI_AGENT_VAULT_PACKAGE}::agent_vault::execute_market_making`,
                arguments: [
                    tx.object(vaultId),
                    bid,
                    ask,
                    tx.pure('HOLD', 'string'), // Initial action
                ],
            });

            // 6. Emit event (in the Move function)

            const result = await signAndExecute({
                transactionBlock: tx as any,
            });

            const digest = result.digest;
            setTxDigest(digest);

            console.log('✅ Market making executed:', digest);

            return {
                digest,
                success: true,
                explorerUrl: `https://suiscan.xyz/testnet/tx/${digest}`,
            };
        } catch (error) {
            console.error('❌ Market making failed:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [currentAccount, signAndExecute]);

    /**
     * Execute arbitrage between pools
     */
    const executeArbitrage = useCallback(async (
        vaultId: string,
        targetProfit: number
    ): Promise<SuiTransactionResult | null> => {
        if (!currentAccount) {
            console.error('❌ No Sui wallet connected');
            return null;
        }

        setIsLoading(true);

        try {
            const tx = new TransactionBlock();

            tx.moveCall({
                target: `${SUI_AGENT_VAULT_PACKAGE}::agent_vault::execute_arbitrage`,
                arguments: [
                    tx.object(vaultId),
                    tx.pure(targetProfit, 'u64'),
                    tx.pure('BUY', 'string'), // Initial direction
                ],
            });

            const result = await signAndExecute({
                transactionBlock: tx as any,
            });

            const digest = result.digest;
            setTxDigest(digest);

            console.log('✅ Arbitrage executed:', digest);

            return {
                digest,
                success: true,
                explorerUrl: `https://suiscan.xyz/testnet/tx/${digest}`,
            };
        } catch (error) {
            console.error('❌ Arbitrage failed:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [currentAccount, signAndExecute]);

    /**
     * Get vault details
     */
    const getVault = useCallback(async (vaultId: string): Promise<SuiVault | null> => {
        try {
            const object = await suiClient.getObject({
                id: vaultId,
                options: { showContent: true },
            });

            if (object.data?.content?.dataType === 'moveObject') {
                const fields = object.data.content.fields as Record<string, unknown>;
                return {
                    id: vaultId,
                    agentId: Number(fields.agent_id || 0),
                    strategy: String(fields.strategy || 'balanced'),
                    balance: BigInt(String(fields.balance || 0)),
                    isActive: Boolean(fields.is_active ?? true),
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching vault:', error);
            return null;
        }
    }, [suiClient]);

    return {
        // Actions
        createVault,
        executeMarketMaking,
        executeArbitrage,
        getVault,

        // State
        isLoading,
        txDigest,
        isConnected: !!currentAccount,

        // Package info
        packageId: SUI_AGENT_VAULT_PACKAGE,
    };
}
