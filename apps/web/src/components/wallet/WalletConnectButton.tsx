"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, ChevronDown, LogOut, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletModal } from "./WalletModal";

export function WalletConnectButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const truncatedAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "";

    const handleCopy = async () => {
        if (address) {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    {/* Jazzicon-style placeholder */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
                    <span className="text-sm font-mono text-white">{truncatedAddress}</span>
                    <button
                        onClick={handleCopy}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Copy address"
                    >
                        {copied ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <button
                    onClick={() => disconnect()}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-400/30 transition-colors"
                    aria-label="Disconnect wallet"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <>
            <Button
                variant="secondary"
                onClick={() => setIsModalOpen(true)}
                className="gap-2"
            >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
            </Button>

            <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
