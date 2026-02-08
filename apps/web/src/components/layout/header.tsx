'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/agents', label: 'Agents' },
    { href: '/docs', label: 'Docs' },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className={`transition-all duration-300 ${scrolled
                ? 'bg-background/80 backdrop-blur-xl border-b border-white/10'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white hidden sm:block">
                            MoltQore
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-zinc-400 hover:text-white transition-colors relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block">
                            <WalletConnectButton />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-zinc-400 hover:text-white transition-colors py-2 text-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10">
                                <WalletConnectButton />
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
