"use client";

import { useConnect } from "wagmi";
import { useConnectWallet } from "@mysten/dapp-kit";
import { Wallet, Globe } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { connectors, connect } = useConnect();
    const { mutate: connectSui } = useConnectWallet();

    const handleEVMConnect = (connector: (typeof connectors)[0]) => {
        connect({ connector });
        onClose();
    };

    const handleSuiConnect = () => {
        // Sui wallet connection
        // This will trigger the Sui wallet modal from dapp-kit
        try {
            connectSui({} as any);
            onClose();
        } catch (error) {
            console.error("Sui connection error:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect Wallet</DialogTitle>
                    <DialogDescription>
                        Choose your preferred network to connect
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* EVM Wallet */}
                    <Card
                        className="cursor-pointer hover:border-primary-500/50 transition-colors group"
                        onClick={() => {
                            const injected = connectors.find((c) => c.id === "injected");
                            if (injected) handleEVMConnect(injected);
                        }}
                    >
                        <CardContent className="p-6 text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 border border-primary-500/20 flex items-center justify-center group-hover:border-primary-500/40 transition-colors">
                                <Wallet className="w-7 h-7 text-primary-400" />
                            </div>
                            <h4 className="font-semibold text-white mb-1">EVM</h4>
                            <p className="text-xs text-zinc-500">
                                Ethereum, Base, Arbitrum
                            </p>
                        </CardContent>
                    </Card>

                    {/* Sui Wallet */}
                    <Card
                        className="cursor-pointer hover:border-secondary-500/50 transition-colors group"
                        onClick={handleSuiConnect}
                    >
                        <CardContent className="p-6 text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-secondary-500/20 to-secondary-500/5 border border-secondary-500/20 flex items-center justify-center group-hover:border-secondary-500/40 transition-colors">
                                <Globe className="w-7 h-7 text-secondary-400" />
                            </div>
                            <h4 className="font-semibold text-white mb-1">Sui</h4>
                            <p className="text-xs text-zinc-500">
                                Sui Network
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Available WalletConnect */}
                {connectors.filter((c) => c.id !== "injected").length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs text-zinc-500 mb-3">Other wallets</p>
                        <div className="space-y-2">
                            {connectors
                                .filter((c) => c.id !== "injected")
                                .map((connector) => (
                                    <button
                                        key={connector.uid}
                                        onClick={() => handleEVMConnect(connector)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                            <Wallet className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <span className="text-sm text-white">{connector.name}</span>
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
