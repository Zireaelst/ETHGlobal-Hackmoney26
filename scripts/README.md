# DeepMind Vaults - Test & Verification

## Quick Start

```bash
# Run full verification
./scripts/verify-all.sh

# Collect transaction evidence
npx ts-node scripts/collect-evidence.ts > EVIDENCE.md

# Run with JSON output
npx ts-node scripts/collect-evidence.ts --json
```

## Scripts

### verify-all.sh
Comprehensive 8-category verification:
1. Environment Check - Tools, versions
2. Smart Contracts - Forge tests
3. Sui Contracts - Move build
4. Backend API - Endpoints, services
5. Frontend Build - Pages, components
6. Transaction Evidence - Deployed contracts
7. Sponsor Requirements - Sui/ENS/Uniswap
8. Documentation - README, NatSpec

### collect-evidence.ts
Collects transaction hashes for sponsor submission:
- Queries Base Sepolia for DeepMindVault events
- Queries Base Sepolia for ENS events
- Generates markdown report with explorer links

## Contract Addresses

| Contract | Network | Address |
|----------|---------|---------|
| DeepMindVault | Base Sepolia | `0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c` |
| ENSTextRecordManager | Base Sepolia | `0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c` |
| agent_vault | Sui Testnet | `0x6ce7728c4d4201c1ea33154063b1fa3e810dae604e88d5a3054c9e662cec7ef8` |
