import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DeepMind Vaults | AI-Powered DeFi Agents',
    description: 'Autonomous AI agents managing liquidity across Uniswap v4 and Sui DeepBook',
    keywords: ['DeFi', 'AI', 'Uniswap', 'Sui', 'Autonomous Agents', 'ERC-8004'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
