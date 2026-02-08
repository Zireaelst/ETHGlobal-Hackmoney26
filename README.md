# 🧠 MoltQore

> AI agents autonomously manage DeFi portfolios across Ethereum & Sui with full on-chain transparency via ENS.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://ethglobal.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Sui](https://img.shields.io/badge/Sui-Testnet-4CA2FF)](https://suiscan.xyz)
[![Base](https://img.shields.io/badge/Base-Sepolia-0052FF)](https://sepolia.basescan.org)

---

## 🎯 What is MoltQore?

MoltQore is the **first ERC-8004 compliant autonomous portfolio manager** that executes DeFi strategies 24/7 across multiple chains without custody. 

Users mint an AI agent as an NFT, select a risk strategy (aggressive/balanced/safe), and let the agent optimize their capital across **Uniswap v4** and **Sui DeepBook**.

### The Core Innovation: Radical Transparency

Every AI decision, reasoning, and trade result is logged on-chain via **ENS text records**. Anyone can verify why the agent moved $5,000 to DeepBook or rebalanced a Uniswap LP position—**no black boxes**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Autonomous AI Agents** | GPT-4o powered portfolio decisions running 24/7 |
| 🔗 **Cross-Chain Execution** | Seamless coordination between Base (EVM) and Sui |
| 📊 **On-Chain Transparency** | Every decision logged to ENS text records |
| 🎨 **NFT Identity (ERC-8004)** | Agents are tradeable, stakeable NFTs with reputation |
| 🔐 **Session Keys** | Non-custodial security with delegated execution |
| ⚡ **Uniswap v4 Hooks** | Automated LP rebalancing on price movements |
| 📈 **DeepBook Market Making** | Sub-500ms order execution on Sui CLOB |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          MoltQore                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   Frontend  │◄──►│  AI Backend │◄──►│  Contracts  │             │
│  │   Next.js   │    │  FastAPI    │    │  Solidity   │             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│         │                  │                  │                     │
│         ▼                  ▼                  ▼                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   wagmi     │    │   GPT-4o    │    │ DeepMindVault│            │
│  │ dapp-kit    │    │  Decision   │    │ ENSManager   │            │
│  └─────────────┘    │   Engine    │    │ Uniswap Hook │            │
│                     └─────────────┘    └─────────────┘             │
│                                               │                     │
│                     ┌─────────────────────────┼─────────────────┐  │
│                     │         Sui Testnet     │                  │  │
│                     │    ┌─────────────┐      │                  │  │
│                     │    │ agent_vault │◄─────┘                  │  │
│                     │    │  DeepBook   │                         │  │
│                     │    └─────────────┘                         │  │
│                     └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📜 Deployed Contracts

### Base Sepolia (Chain ID: 84532)

| Contract | Address | Description |
|----------|---------|-------------|
| **DeepMindVault** | [`0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c`](https://sepolia.basescan.org/address/0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c) | ERC-8004 Agent NFT |
| **ENSTextRecordManager** | [`0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3`](https://sepolia.basescan.org/address/0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3) | On-chain decision logs |
| **MockPublicResolver** | [`0xD257737006c06C99709513A0491D585D5689316b`](https://sepolia.basescan.org/address/0xD257737006c06C99709513A0491D585D5689316b) | ENS text record storage |

### Sui Testnet

| Package | Object ID |
|---------|-----------|
| **deepmind::agent_vault** | [`0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8`](https://suiscan.xyz/testnet/object/0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8) |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, Framer Motion, Aceternity UI |
| **Wallets** | wagmi v2 (EVM), @mysten/dapp-kit (Sui) |
| **EVM Contracts** | Solidity 0.8.24, Foundry, OpenZeppelin, Uniswap v4-core |
| **Sui Contracts** | Move, DeepBook v3, Programmable Transaction Blocks |
| **AI Backend** | Python FastAPI, OpenAI GPT-4o, web3.py |
| **Identity** | ENS text records, ERC-8004 standard |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Foundry (`forge`, `cast`, `anvil`)
- Sui CLI
- Python 3.11+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/moltqore
cd moltqore

# Install all dependencies
pnpm install

# Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp packages/contracts/.env.example packages/contracts/.env
```

### Run the Stack

```bash
# Terminal 1: Frontend
cd apps/web && pnpm dev

# Terminal 2: Backend API
cd apps/api && pip install -r requirements.txt && uvicorn main:app --reload

# Terminal 3: Local testing
cd packages/contracts && forge test -vv
```

### Demo Flow

Run the complete demo to see all transactions:

```bash
./scripts/demo-flow.sh
```

### Verify Installation

```bash
./scripts/verify-system.sh
```

---

## 📁 Project Structure

```
moltqore/
├── apps/
│   ├── web/                           # Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── abi/                   # Contract ABIs
│   │   │   ├── components/            # React components
│   │   │   ├── hooks/                 # wagmi + Sui hooks
│   │   │   └── app/                   # App router pages
│   │   └── tailwind.config.ts
│   └── api/                           # FastAPI backend
│       ├── main.py                    # API endpoints
│       └── services/                  # AI decision engine
├── packages/
│   ├── contracts/                     # Foundry (Solidity)
│   │   ├── src/
│   │   │   ├── DeepMindVault.sol      # ERC-8004 NFT
│   │   │   ├── ENSTextRecordManager.sol
│   │   │   └── uniswap-v4/
│   │   │       ├── AgentRebalancerHook.sol
│   │   │       └── AgentLiquidityManager.sol
│   │   └── test/
│   └── sui-contracts/                 # Sui Move
│       └── deepmind/
│           └── sources/
│               └── agent_vault.move   # DeepBook integration
├── scripts/
│   ├── demo-flow.sh                   # Complete demo flow
│   ├── verify-system.sh               # System verification
│   └── collect-evidence.ts            # TX evidence collector
├── TX_EVIDENCE.md                     # Transaction evidence
└── README.md
```

---

## 🎮 How It Works

### 1. Mint Your Agent

```solidity
// User mints an ERC-8004 agent NFT
function mintAgent(
    string ensName,      // "agent-42.moltqore.eth"
    bytes32 strategyHash, // keccak256("aggressive")
    bytes32 suiVaultAddress
) returns (uint256 agentId)
```

### 2. AI Analyzes Opportunities

```python
# GPT-4o decision engine (simplified)
decision = gpt4o.analyze({
    "uniswap_pools": get_pool_metrics(),
    "deepbook_spreads": get_sui_spreads(),
    "agent_strategy": "aggressive",
    "current_positions": positions
})
# Returns: MOVE_TO_SUI | REBALANCE_UNISWAP | HOLD
```

### 3. Execute via Session Keys

```typescript
// Non-custodial execution
const { delegateSessionKey } = useDeepMindVault();
await delegateSessionKey(agentId, sessionKeyAddress, 60); // 60 days
```

### 4. Trade on Sui DeepBook

```move
// Sui PTB with 5+ operations
public entry fun execute_market_making(
    vault: &mut AgentVault,
    bid_price: u64,
    ask_price: u64,
    quantity: u64,
    clock: &Clock,
    ctx: &mut TxContext
)
```

### 5. Log to ENS

```solidity
// Every decision logged on-chain
function logDecisionToENS(
    uint256 agentId,
    string action,      // "MOVE_TO_SUI"
    string reasoning,   // "Better spread on DeepBook (0.5% vs 0.3%)"
    int256 profitLoss   // +$150
)
```

---

## 🏆 Sponsor Integrations

### Sui ($10K Track)
- ✅ Deployed `agent_vault` package on Testnet
- ✅ DeepBook V3 CLOB integration
- ✅ 7-operation PTBs for market making
- ✅ Cross-chain sync with Ethereum

### ENS ($5K Track)
- ✅ Text records for AI decision logging
- ✅ Agent subdomains (agent-42.moltqore.eth)
- ✅ On-chain audit trail
- ✅ wagmi hooks for ENS reads

### Uniswap v4 ($10K Track)
- ✅ Custom `AgentRebalancerHook.sol`
- ✅ `afterSwap()` auto-rebalancing
- ✅ Strategy-based tick ranges
- ✅ AgentLiquidityManager integration

---

## 📊 Transaction Evidence

| Chain | Action | TX Hash |
|-------|--------|---------|
| **Base Sepolia** | mintAgent | [`0x7a9f0ce8...`](https://sepolia.basescan.org/tx/0x7a9f0ce8156f5e5ddf65c3c71d6554840fb88a2102777b6094806fbed79d042a) |
| **Sui Testnet** | create_vault | [`ApEH37gM...`](https://suiscan.xyz/testnet/tx/ApEH37gMmZ34WUpZT9Bq4d7NikMiVNAeSVCZsi88SoQk) |
| **Sui Testnet** | execute_market_making | [`5v4MdPN4...`](https://suiscan.xyz/testnet/tx/5v4MdPN4D4jAVQgNyvEsKDdvW37WonDPcPvXpmFUWfZr) |

See [`TX_EVIDENCE.md`](./TX_EVIDENCE.md) for complete transaction evidence.

---

## 🛠️ Development

### Build Contracts

```bash
# EVM
cd packages/contracts
forge build
forge test -vv  # 19 tests ✅

# Sui
cd packages/sui-contracts/deepmind
sui move build
sui move test
```

### Deploy Contracts

```bash
# Base Sepolia
source packages/contracts/.env
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Sui Testnet
cd packages/sui-contracts/deepmind
sui client publish --gas-budget 100000000
```

---

## 🔮 Future Roadmap

- [ ] Mainnet deployment (Base + Sui)
- [ ] Wormhole cross-chain messaging
- [ ] Agent marketplace on OpenSea
- [ ] Multi-agent strategies
- [ ] Real-time dashboard with WebSocket

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [ETHGlobal HackMoney 2026](https://ethglobal.com)
- [Uniswap Foundation](https://uniswap.org)
- [Sui Foundation](https://sui.io)
- [ENS Labs](https://ens.domains)
- [OpenAI](https://openai.com) - GPT-4o

---

<p align="center">
  Built with ❤️ at ETHGlobal HackMoney 2026
</p>