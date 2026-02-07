# DeepMind Vaults

AI-powered autonomous DeFi agents with Uniswap v4 and Sui DeepBook integration.

## 🚀 Live Demo

**Frontend:** [http://localhost:3000](http://localhost:3000)

---

## 📜 Deployed Contracts

### Base Sepolia (Chain ID: 84532)

| Contract | Address | Explorer |
|----------|---------|----------|
| **DeepMindVault (ERC-8004)** | `0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c` | [View on BaseScan](https://sepolia.basescan.org/address/0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c) |
| **ENSTextRecordManager** | `0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c` | [View on BaseScan](https://sepolia.basescan.org/address/0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c) |

### Sui Testnet

| Package | Object ID | Explorer |
|---------|-----------|----------|
| **deepmind::agent_vault** | `0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8` | [View on SuiScan](https://suiscan.xyz/testnet/object/0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8) |

---

## Overview

DeepMind Vaults enables AI agents to autonomously manage liquidity positions across multiple chains:
- **ERC-8004 NFT Identity**: Each agent is represented as an NFT on Base with ENS integration
- **Uniswap v4 Hooks**: Automatic LP rebalancing based on agent strategies
- **Sui DeepBook**: Market making and arbitrage on Sui's CLOB
- **GPT-4o Decision Engine**: AI-powered portfolio decisions with on-chain transparency

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, Framer Motion |
| **EVM Contracts** | Solidity 0.8.24, Foundry, OpenZeppelin, Uniswap v4 |
| **Sui Contracts** | Move, DeepBook v3 |
| **Backend** | FastAPI, Python, OpenAI GPT-4o |
| **Wallets** | wagmi v2, @mysten/dapp-kit |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Foundry
- Sui CLI
- Python 3.11+

### Installation

```bash
# Install dependencies
pnpm install

# Start frontend
cd apps/web && pnpm dev

# Start backend API
cd apps/api && pip install -r requirements.txt && uvicorn main:app --reload
```

### Build & Test Contracts

```bash
# EVM contracts
cd packages/contracts
forge build
forge test -vv  # 19 tests passing ✅

# Sui contracts  
cd packages/sui-contracts/deepmind
sui move build
```

### Deploy Contracts

```bash
# Base Sepolia
cd packages/contracts
forge script script/Deploy.s.sol:Deploy --rpc-url https://sepolia.base.org --broadcast

# Sui Testnet
cd packages/sui-contracts/deepmind
sui client publish --gas-budget 100000000
```

## Project Structure

```
deepmind-vaults/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # FastAPI backend
├── packages/
│   ├── contracts/              # Foundry (Solidity)
│   │   ├── src/
│   │   │   ├── DeepMindVault.sol
│   │   │   ├── ENSTextRecordManager.sol
│   │   │   └── uniswap-v4/AgentRebalancerHook.sol
│   │   └── test/
│   └── sui-contracts/          # Sui Move
│       └── deepmind/
│           └── sources/agent_vault.move
└── README.md
```

## Features

- 🤖 **Autonomous AI Agents** - GPT-4o powered portfolio decisions
- 🔗 **Cross-Chain** - Base (EVM) + Sui integration  
- 📊 **On-Chain Transparency** - Decisions logged to ENS text records
- 🎨 **Premium UI** - Dark theme with glassmorphism and animations
- 🔐 **Session Keys** - Delegated autonomous execution

## License

MIT