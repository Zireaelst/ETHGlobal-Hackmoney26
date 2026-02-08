# Setup Guide

## Prerequisites

- Node.js 20+
- Python 3.11+
- Foundry
- Sui CLI
- pnpm

## Installation

```bash
# Clone repository
git clone https://github.com/moltqore/moltqore.git
cd moltqore

# Install dependencies
pnpm install
```

## Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
OPENAI_API_KEY=your_openai_key
```

## Deploy Smart Contracts

### Base Sepolia

```bash
cd packages/contracts

forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

### Sui Testnet

```bash
cd packages/sui-contracts

sui move build
sui client publish --gas-budget 100000000
```

## Run Backend

```bash
cd apps/api

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

uvicorn main:app --reload
```

## Run Frontend

```bash
cd apps/web
pnpm dev
```

Visit `http://localhost:3000`

## Run Demo

```bash
./scripts/demo-flow.sh
```

This executes 6 real transactions across Base Sepolia and Sui Testnet.

## Testing

### Smart Contracts

```bash
cd packages/contracts
forge test -vv
```

### Sui Contracts

```bash
cd packages/sui-contracts
sui move test
```
