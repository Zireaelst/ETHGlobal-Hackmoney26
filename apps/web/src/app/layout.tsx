import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
    title: 'DeepMind Vaults | AI-Powered DeFi Portfolio Manager',
    description: 'Autonomous AI agents managing your DeFi portfolio across Uniswap v4 and Sui DeepBook. 24/7 trading with full on-chain transparency.',
    keywords: ['DeFi', 'AI', 'Uniswap', 'Sui', 'Autonomous Agents', 'ERC-8004', 'Portfolio Manager', 'Crypto'],
    openGraph: {
        title: 'DeepMind Vaults | AI-Powered DeFi Portfolio Manager',
        description: 'Autonomous AI agents managing your DeFi portfolio across Uniswap v4 and Sui DeepBook.',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DeepMind Vaults',
        description: 'AI-Powered DeFi Portfolio Manager',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
            <body className={`${inter.className} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
