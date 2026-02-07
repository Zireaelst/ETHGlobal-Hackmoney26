"use client";

import { useState } from 'react';
import {
    useAIProvider,
    AIProviderType,
    AI_PROVIDERS,
    AIProvider
} from '@/hooks/useAIProvider';

export function AIProviderSelector() {
    const { provider, setProvider, providerInfo } = useAIProvider();
    const [isOpen, setIsOpen] = useState(false);
    const [openaiKey, setOpenaiKey] = useState('');
    const [openClawUrl, setOpenClawUrl] = useState('');
    const [customEndpoint, setCustomEndpoint] = useState('');

    const handleSelectProvider = (type: AIProviderType) => {
        if (type === 'platform') {
            setProvider({ type: 'platform' });
            setIsOpen(false);
        } else if (type === 'openai') {
            if (openaiKey) {
                setProvider({ type: 'openai', apiKey: openaiKey });
                setIsOpen(false);
            }
        } else if (type === 'openclaw') {
            if (openClawUrl) {
                setProvider({ type: 'openclaw', webhookUrl: openClawUrl });
                setIsOpen(false);
            }
        } else if (type === 'custom') {
            if (customEndpoint) {
                setProvider({ type: 'custom', endpoint: customEndpoint });
                setIsOpen(false);
            }
        }
    };

    return (
        <div className="relative">
            {/* Current Provider Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 
                   border border-white/10 rounded-lg transition-colors"
            >
                <span className="text-lg">{providerInfo.icon}</span>
                <span className="text-sm text-white/80">{providerInfo.name}</span>
                <svg
                    className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-[#0a0a0a] border border-white/10 
                        rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                        <h3 className="text-sm font-medium text-white">Select AI Provider</h3>
                        <p className="text-xs text-white/50 mt-1">
                            Choose how your agent makes decisions
                        </p>
                    </div>

                    <div className="p-2 space-y-1">
                        {(Object.entries(AI_PROVIDERS) as [AIProviderType, typeof AI_PROVIDERS[AIProviderType]][]).map(([type, info]) => (
                            <div key={type} className="group">
                                <button
                                    onClick={() => !info.requiresConfig && handleSelectProvider(type)}
                                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors
                              ${provider.type === type ? 'bg-violet-500/20' : 'hover:bg-white/5'}`}
                                >
                                    <span className="text-xl">{info.icon}</span>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium text-white">{info.name}</div>
                                        <div className="text-xs text-white/50">{info.description}</div>

                                        {/* Config Input for providers that need it */}
                                        {info.requiresConfig && provider.type !== type && (
                                            <div className="mt-2" onClick={e => e.stopPropagation()}>
                                                {type === 'openai' && (
                                                    <input
                                                        type="password"
                                                        placeholder="sk-..."
                                                        value={openaiKey}
                                                        onChange={(e) => setOpenaiKey(e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-black/50 border border-white/20 
                                     rounded text-xs text-white placeholder-white/30"
                                                    />
                                                )}
                                                {type === 'openclaw' && (
                                                    <input
                                                        type="url"
                                                        placeholder="https://your-webhook.openclaw.ai/..."
                                                        value={openClawUrl}
                                                        onChange={(e) => setOpenClawUrl(e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-black/50 border border-white/20 
                                     rounded text-xs text-white placeholder-white/30"
                                                    />
                                                )}
                                                {type === 'custom' && (
                                                    <input
                                                        type="url"
                                                        placeholder="http://localhost:8080/ai"
                                                        value={customEndpoint}
                                                        onChange={(e) => setCustomEndpoint(e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-black/50 border border-white/20 
                                     rounded text-xs text-white placeholder-white/30"
                                                    />
                                                )}
                                                <button
                                                    onClick={() => handleSelectProvider(type)}
                                                    className="mt-2 w-full px-3 py-1 bg-violet-600 hover:bg-violet-500 
                                   rounded text-xs text-white font-medium transition-colors"
                                                >
                                                    Connect
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {provider.type === type && (
                                        <span className="text-violet-400">✓</span>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-white/10 bg-white/5">
                        <p className="text-xs text-white/40 text-center">
                            Your AI makes portfolio decisions autonomously
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
