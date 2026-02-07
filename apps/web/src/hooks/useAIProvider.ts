"use client";

import { useState, useCallback } from 'react';

// ============ AI Provider Types ============

export type AIProviderType = 'platform' | 'openai' | 'openclaw' | 'custom';

export interface PlatformProvider {
    type: 'platform';
}

export interface OpenAIProvider {
    type: 'openai';
    apiKey: string;
}

export interface OpenClawProvider {
    type: 'openclaw';
    webhookUrl: string;
}

export interface CustomProvider {
    type: 'custom';
    endpoint: string;
    headers?: Record<string, string>;
}

export type AIProvider = PlatformProvider | OpenAIProvider | OpenClawProvider | CustomProvider;

// ============ Provider Info ============

export const AI_PROVIDERS: Record<AIProviderType, {
    name: string;
    description: string;
    icon: string;
    requiresConfig: boolean;
}> = {
    platform: {
        name: 'Platform AI',
        description: 'Use DeepMind Vaults GPT-4o (no setup required)',
        icon: '🤖',
        requiresConfig: false,
    },
    openai: {
        name: 'Your OpenAI Key',
        description: 'Use your own OpenAI API key',
        icon: '🔑',
        requiresConfig: true,
    },
    openclaw: {
        name: 'OpenClaw',
        description: 'Connect your OpenClaw assistant',
        icon: '🦞',
        requiresConfig: true,
    },
    custom: {
        name: 'Custom AI',
        description: 'Use your own AI endpoint (local LLM, etc)',
        icon: '⚙️',
        requiresConfig: true,
    },
};

// ============ Hook ============

const STORAGE_KEY = 'deepmind_ai_provider';

export function useAIProvider() {
    const [provider, setProviderState] = useState<AIProvider>(() => {
        if (typeof window === 'undefined') return { type: 'platform' };

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored) as AIProvider;
            }
        } catch (e) {
            console.error('Failed to load AI provider from storage', e);
        }

        return { type: 'platform' };
    });

    const setProvider = useCallback((newProvider: AIProvider) => {
        setProviderState(newProvider);

        // Save to localStorage (don't store API keys in production!)
        try {
            // For security, mask API key when storing
            const toStore = newProvider.type === 'openai'
                ? { ...newProvider, apiKey: newProvider.apiKey.slice(0, 8) + '...' }
                : newProvider;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        } catch (e) {
            console.error('Failed to save AI provider', e);
        }
    }, []);

    const clearProvider = useCallback(() => {
        setProviderState({ type: 'platform' });
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Get provider for API calls
    const getProviderConfig = useCallback((): AIProvider => {
        return provider;
    }, [provider]);

    return {
        provider,
        providerInfo: AI_PROVIDERS[provider.type],
        setProvider,
        clearProvider,
        getProviderConfig,
        isCustomProvider: provider.type !== 'platform',
    };
}

// ============ API Helper ============

export async function callDecisionAPI(
    agentId: number,
    strategy: string,
    provider: AIProvider
): Promise<{
    action: string;
    reasoning: string;
    confidence: number;
    target_opportunity?: object;
}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/${agentId}/trigger-decision`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            strategy,
            ai_provider: provider,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to get AI decision');
    }

    return response.json();
}
