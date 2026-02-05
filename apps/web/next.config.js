/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@mysten/dapp-kit', '@mysten/sui.js'],
    webpack: (config, { isServer }) => {
        // Fix for lru-cache parsing error with vanilla-extract
        config.resolve.alias = {
            ...config.resolve.alias,
            'lru-cache': require.resolve('lru-cache'),
        };

        // Handle optional peer dependencies that aren't installed
        config.resolve.fallback = {
            ...config.resolve.fallback,
            '@react-native-async-storage/async-storage': false,
            'pino-pretty': false,
        };

        // Ignore specific warnings from wallet connectors
        config.ignoreWarnings = [
            { module: /@metamask\/sdk/ },
            { module: /pino/ },
        ];

        return config;
    },
};

module.exports = nextConfig;
