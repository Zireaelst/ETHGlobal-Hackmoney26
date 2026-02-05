import { createConfig, http, type Config } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig: Config = createConfig({
    chains: [baseSepolia, base],
    connectors: [
        injected(),
        metaMask(),
        coinbaseWallet({ appName: 'DeepMind Vaults' }),
    ],
    transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
    },
});

// Contract addresses
export const CONTRACTS = {
    baseSepolia: {
        deepMindVault: '0x0000000000000000000000000000000000000000', // Deploy address
        ensManager: '0x0000000000000000000000000000000000000000',
        rebalancerHook: '0x0000000000000000000000000000000000000000',
    },
} as const;
