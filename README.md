# DeepMind Vaults

AI-powered autonomous DeFi agents with Uniswap v4 and Sui DeepBook integration.

## Overview

DeepMind Vaults enables AI agents to autonomously manage liquidity positions across multiple chains:
- **ERC-8004 NFT Identity**: Each agent is represented as an NFT on Base with ENS integration
- **Uniswap v4 Hooks**: Automatic LP rebalancing based on agent strategies
- **Sui DeepBook**: Market making and arbitrage on Sui's CLOB

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **EVM Contracts**: Solidity 0.8.24, Foundry, Uniswap v4
- **Sui Contracts**: Move, DeepBook v3
- **Infrastructure**: PostgreSQL, Redis

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Foundry
- Sui CLI

### Installation

```bash
# Install dependencies
pnpm install

# Start local services
docker-compose up -d

# Run frontend dev server
pnpm dev
```

### Build Contracts

```bash
# EVM contracts
cd packages/contracts
forge build

# Sui contracts  
cd packages/sui-contracts/deepmind
sui move build
```

## Project Structure

```
deepmind-vaults/
├── apps/
│   └── web/                 # Next.js frontend
├── packages/
│   ├── contracts/           # Foundry (Solidity)
│   └── sui-contracts/       # Sui Move
├── docker-compose.yml
└── package.json
```

## License

MIT