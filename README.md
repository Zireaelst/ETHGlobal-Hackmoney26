# MoltQore

**Autonomous DeFi Agents for Cross-Chain Yield Optimization**

MoltQore is an ERC-8004 compliant autonomous portfolio manager that executes DeFi strategies across Base and Sui without custody. Mint an AI agent NFT, set your risk strategy, and let it optimize yields—with every decision logged on-chain via ENS.

---

## The Problem

DeFi portfolio management requires constant attention:

- Users must monitor multiple protocols across chains manually
- Opportunities are missed during sleep, work, or periods of high activity
- Existing automated solutions require custody, introducing centralized risk
- Most strategies operate as "black boxes" with zero transparency

**Result:** Only sophisticated traders with 24/7 monitoring can effectively optimize yields.

---

## The Solution

MoltQore combines AI decision-making with multi-chain execution and radical transparency.

Each agent is an **ERC-8004 NFT** that can:
- Execute on Uniswap v4 (LP rebalancing via hooks)
- Execute on Sui DeepBook (market making via PTBs)
- Log every decision to ENS text records for full auditability

```
User → Mints Agent NFT → Agent Executes on Uniswap v4 / Sui DeepBook → Logs to ENS → User Verifies
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     IDENTITY LAYER (Base)                   │
│  ┌──────────────────┐         ┌──────────────────────────┐ │
│  │ DeepMindVault.sol│         │ ENSTextRecordManager.sol │ │
│  │  (ERC-8004 NFT)  │────────>│  (Transparency Layer)    │ │
│  └──────────────────┘         └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             │
                             v
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION LAYER (Multi-Chain)            │
│  ┌──────────────────┐         ┌──────────────────────────┐ │
│  │ AgentRebalancer  │         │   Sui Move Module        │ │
│  │   Hook (v4)      │         │  (DeepBook Market Making)│ │
│  └──────────────────┘         └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             │
                             v
┌─────────────────────────────────────────────────────────────┐
│                   AI DECISION ENGINE                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │ Opportunity│  │   GPT-4o   │  │   Transaction        │  │
│  │  Scanner   │─>│  Decision  │─>│   Executor           │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14, wagmi v2 | Web application |
| Identity | ERC-8004, ENS | Agent NFTs + decision logging |
| EVM Execution | Uniswap v4 Hooks | Autonomous LP management |
| Sui Execution | Move, DeepBook, PTBs | Market making |
| AI Engine | FastAPI, GPT-4o | Decision engine |

---

## Deployed Contracts

### Base Sepolia

| Contract | Address | Description |
|----------|---------|-------------|
| DeepMindVault | [`0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c`](https://sepolia.basescan.org/address/0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c) | ERC-8004 Agent NFT |
| ENSTextRecordManager | [`0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3`](https://sepolia.basescan.org/address/0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3) | On-chain decision logs |
| MockPublicResolver | [`0xD257737006c06C99709513A0491D585D5689316b`](https://sepolia.basescan.org/address/0xD257737006c06C99709513A0491D585D5689316b) | ENS text record storage |
| AgentRebalancerHook | [`0xdB045ac6bA8d7903fD3a566bFBf208955481dA49`](https://sepolia.basescan.org/address/0xdB045ac6bA8d7903fD3a566bFBf208955481dA49) | Uniswap v4 LP rebalancer |

### Sui Testnet

| Module | Package ID |
|--------|------------|
| agent_vault | [`0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8`](https://suiscan.xyz/testnet/object/0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8) |

---

## Uniswap v4 Integration

**AgentRebalancerHook** implements the `afterSwap` callback to autonomously rebalance concentrated liquidity positions.

**How it works:**
1. After each swap, the hook checks if rebalancing is needed
2. Triggers if current tick drifted >100 ticks from range center, or >1 hour since last rebalance
3. Calculates new optimal range based on agent strategy (Aggressive: ±5%, Balanced: ±10%, Safe: ±20%)
4. Updates position atomically

```solidity
function afterSwap(...) external override returns (bytes4, int128) {
    uint256 agentId = abi.decode(hookData, (uint256));
    
    if (_shouldRebalance(key, agentPositions[agentId][poolId])) {
        _executeRebalance(agentId, key, position);
    }
    
    return (BaseHook.afterSwap.selector, 0);
}
```

---

## Sui DeepBook Integration

**agent_vault.move** executes market making strategies via Programmable Transaction Blocks.

**Single PTB contains 7 operations:**
1. Verify session signature
2. Get vault state
3. Calculate bid/ask sizes based on strategy
4. Place bid order
5. Place ask order
6. Update performance metrics
7. Emit decision event

```move
public entry fun execute_market_making(
    vault: &mut AgentVault,
    pool: &mut Pool<SUI, USDC>,
    bid_price: u64,
    ask_price: u64,
    quantity: u64,
    ctx: &mut TxContext
) {
    clob::place_limit_order(pool, bid_price, quantity, SIDE_BID, ...);
    clob::place_limit_order(pool, ask_price, quantity, SIDE_ASK, ...);
    
    event::emit(AgentDecisionEvent { ... });
}
```

---

## ENS Transparency Layer

Every agent decision is logged to ENS text records, creating an immutable audit trail.

**Text records per agent:**
- `agent.last_decision` - Action taken
- `agent.last_reasoning` - AI reasoning
- `agent.last_pnl` - Profit/loss
- `agent.reputation` - Accumulated performance score

```solidity
function logDecisionToENS(
    uint256 agentId,
    string memory decision,
    string memory reasoning,
    int256 profitLoss
) external {
    bytes32 node = agentToENSNode[agentId];
    
    resolver.setText(node, "agent.last_decision", decision);
    resolver.setText(node, "agent.last_reasoning", reasoning);
    resolver.setText(node, "agent.last_pnl", formatPnL(profitLoss));
}
```

---

## User Flow

1. **Connect Wallet** - Base Sepolia + Sui Testnet
2. **Choose Strategy** - Safe (5-8% APY), Balanced (10-15%), or Aggressive (20-35%)
3. **Mint Agent NFT** - ERC-8004 token with session key delegation
4. **Fund Vault** - Deposit USDC
5. **Agent Operates** - Scans markets, makes decisions, executes trades, logs to ENS

User can pause, withdraw, or transfer the agent NFT at any time.

---

## Demo

Run the demo script to see all 6 real transactions:

```bash
./scripts/demo-flow.sh
```

**Transactions executed:**
- mintAgent (ERC-8004)
- registerAgentENS
- logDecisionToENS
- openPosition (Uniswap v4 Hook)
- create_vault (Sui)
- execute_market_making (Sui PTB)

All transactions are real and verifiable on blockchain explorers.

---

## Project Structure

```
moltqore/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # FastAPI backend (AI engine)
├── packages/
│   ├── contracts/        # Solidity (EVM)
│   └── sui-contracts/    # Move (Sui)
└── scripts/
    └── demo-flow.sh      # Demo script
```

---

## Links

- [Live App](https://moltqore.vercel.app)
- [Demo Video](https://youtube.com/...)
- [Setup Guide](./docs/SETUP.md)

---

## License

MIT License

---

Built for ETHGlobal HackMoney 2026