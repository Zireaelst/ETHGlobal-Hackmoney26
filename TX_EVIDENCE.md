# DeepMind Vaults - Transaction Evidence

Generated: 2026-02-08

## 🔷 Base Sepolia (EVM) Transactions

### mintAgent - ERC-8004 Agent NFT Created
| Field | Value |
|-------|-------|
| **TX Hash** | `0x7a9f0ce8156f5e5ddf65c3c71d6554840fb88a2102777b6094806fbed79d042a` |
| **Contract** | DeepMindVault `0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c` |
| **Function** | `mintAgent(string,bytes32,bytes32)` |
| **Agent ID** | 1 |
| **Block** | 37387128 |
| **Explorer** | [View on Basescan](https://sepolia.basescan.org/tx/0x7a9f0ce8156f5e5ddf65c3c71d6554840fb88a2102777b6094806fbed79d042a) |

#### Events Emitted:
- `Transfer(from=0x0, to=0x6602130E..., tokenId=1)` - NFT minted
- `AgentMinted(agentId=1, owner=0x6602130E..., ensNode, suiVault)` - Agent created

---

## 🔵 Sui Testnet Transactions

### create_vault - Agent Vault Created
| Field | Value |
|-------|-------|
| **TX Digest** | `ApEH37gMmZ34WUpZT9Bq4d7NikMiVNAeSVCZsi88SoQk` |
| **Package** | `0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8` |
| **Module** | `agent_vault` |
| **Function** | `create_vault` |
| **Vault Object** | `0xde655fe78486dadc375ff05b386ffa80665275d37ede0bb4748a2b1256c03cfd` |
| **Explorer** | [View on SuiScan](https://suiscan.xyz/testnet/tx/ApEH37gMmZ34WUpZT9Bq4d7NikMiVNAeSVCZsi88SoQk) |

#### Events Emitted:
- `VaultCreatedEvent(nft_id=1, owner=0x917f2d93..., vault_id=0xde655fe7...)`

---

### execute_market_making - Market Making Decision with PTB 🎯
| Field | Value |
|-------|-------|
| **TX Digest** | `5v4MdPN4D4jAVQgNyvEsKDdvW37WonDPcPvXpmFUWfZr` |
| **Package** | `0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8` |
| **Module** | `agent_vault` |
| **Function** | `execute_market_making` |
| **Vault Object** | `0xde655fe78486dadc375ff05b386ffa80665275d37ede0bb4748a2b1256c03cfd` |
| **Explorer** | [View on SuiScan](https://suiscan.xyz/testnet/tx/5v4MdPN4D4jAVQgNyvEsKDdvW37WonDPcPvXpmFUWfZr) |

#### Events Emitted:
- `AgentDecisionEvent(nft_id=1, decision_type="market_making", bid_price=1000000, ask_price=1010000, quantity=500000)`

#### PTB Operations (5+ args):
1. vault object reference
2. bid_price: 1000000
3. ask_price: 1010000
4. quantity: 500000
5. clock object: 0x6

---

## Deployed Contracts

| Contract | Network | Address |
|----------|---------|---------|
| DeepMindVault | Base Sepolia | `0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c` |
| ENSTextRecordManager | Base Sepolia | `0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c` |
| agent_vault | Sui Testnet | `0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8` |

---

## Sponsor Track Evidence

### ✅ Sui Sponsor
- **Package deployed:** Yes
- **Vault created:** Yes (TX above)
- **Market making function:** Available in module
- **PTB operations:** 5+ arguments in transactions

### ⚠️ ENS Sponsor  
- **Contract deployed:** Yes
- **logDecisionToENS:** Available but requires agent registration
- **Text records:** Functional in contract

### ✅ Uniswap v4 Sponsor
- **Hook code:** `AgentRebalancerHook.sol` in repository
- **afterSwap logic:** Implemented with rebalancing
- **Note:** Hook deployment requires live Uniswap v4 PoolManager
