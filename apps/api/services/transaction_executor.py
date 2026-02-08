"""
AgentTransactionExecutor - Executes blockchain transactions for AI agent decisions
Handles both EVM (Base) and Sui chain interactions
"""
import os
import json
import asyncio
from typing import Dict, Optional, Tuple
from dataclasses import dataclass
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional for development

from web3 import Web3  # type: ignore
from web3.middleware import ExtraDataToPOAMiddleware  # type: ignore
from eth_account import Account  # type: ignore
from eth_account.signers.local import LocalAccount  # type: ignore


@dataclass
class TransactionResult:
    """Result of a transaction execution"""
    success: bool
    tx_hash: str
    chain: str
    gas_used: int
    error: Optional[str] = None


class AgentTransactionExecutor:
    """Executes blockchain transactions for AI agent decisions"""

    def __init__(self):
        # EVM Setup (Base Sepolia)
        self.base_rpc = os.getenv('BASE_SEPOLIA_RPC_URL', 'https://sepolia.base.org')
        self.w3 = Web3(Web3.HTTPProvider(self.base_rpc))
        self.w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        
        # Load session key
        private_key = os.getenv('SESSION_KEY_PRIVATE_KEY')
        if private_key:
            self.account: LocalAccount = Account.from_key(private_key)
        else:
            self.account = None
            
        # Contract addresses
        self.vault_address = os.getenv('DEEPMIND_VAULT_ADDRESS', '0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c')
        self.ens_manager_address = os.getenv('ENS_MANAGER_ADDRESS', '0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c')
        
        # Load ABIs
        self.vault_abi = self._load_abi('DeepMindVault')
        self.ens_abi = self._load_abi('ENSTextRecordManager')
        
        # Sui Setup
        self.sui_rpc = os.getenv('SUI_RPC_URL', 'https://fullnode.testnet.sui.io')
        self.sui_package_id = os.getenv('SUI_PACKAGE_ID')

    def _load_abi(self, contract_name: str) -> list:
        """Load contract ABI from file or return minimal ABI"""
        # Minimal ABIs for hackathon
        abis = {
            'DeepMindVault': [
                {
                    "name": "executeAction",
                    "type": "function",
                    "inputs": [
                        {"name": "agentId", "type": "uint256"},
                        {"name": "action", "type": "bytes"}
                    ],
                    "outputs": [{"name": "success", "type": "bool"}]
                },
                {
                    "name": "pauseAgent",
                    "type": "function",
                    "inputs": [{"name": "agentId", "type": "uint256"}],
                    "outputs": []
                },
                {
                    "name": "resumeAgent",
                    "type": "function",
                    "inputs": [{"name": "agentId", "type": "uint256"}],
                    "outputs": []
                }
            ],
            'ENSTextRecordManager': [
                {
                    "name": "logDecisionToENS",
                    "type": "function",
                    "inputs": [
                        {"name": "agentId", "type": "uint256"},
                        {"name": "decision", "type": "string"},
                        {"name": "reasoning", "type": "string"},
                        {"name": "profitLoss", "type": "int256"}
                    ],
                    "outputs": []
                },
                {
                    "name": "syncReputationToENS",
                    "type": "function",
                    "inputs": [
                        {"name": "agentId", "type": "uint256"},
                        {"name": "newReputation", "type": "uint256"},
                        {"name": "totalTrades", "type": "uint256"},
                        {"name": "profitableTrades", "type": "uint256"}
                    ],
                    "outputs": []
                }
            ]
        }
        return abis.get(contract_name, [])

    async def execute_decision(
        self,
        agent_id: int,
        decision: Dict
    ) -> TransactionResult:
        """
        Execute a decision made by the AI agent
        
        Args:
            agent_id: The agent NFT ID
            decision: Decision dict with action, reasoning, target_opportunity
            
        Returns:
            TransactionResult with success status and tx hash
        """
        action = decision.get('action', 'HOLD')
        
        try:
            if action == 'MOVE_TO_UNISWAP_V4':
                result = await self._move_to_uniswap(agent_id, decision)
            elif action == 'MOVE_TO_SUI_DEEPBOOK':
                result = await self._move_to_sui(agent_id, decision)
            elif action == 'REBALANCE_UNISWAP':
                result = await self._rebalance_uniswap(agent_id, decision)
            elif action == 'EXECUTE_ARBITRAGE':
                result = await self._execute_arbitrage(agent_id, decision)
            elif action == 'HOLD':
                # No transaction needed, just log
                result = TransactionResult(
                    success=True,
                    tx_hash='0x0',
                    chain='none',
                    gas_used=0
                )
            else:
                result = TransactionResult(
                    success=False,
                    tx_hash='',
                    chain='',
                    gas_used=0,
                    error=f"Unknown action: {action}"
                )
            
            # Log decision to ENS for transparency
            if result.success and action != 'HOLD':
                await self._log_to_ens(agent_id, decision)
            
            return result
            
        except Exception as e:
            return TransactionResult(
                success=False,
                tx_hash='',
                chain='',
                gas_used=0,
                error=str(e)
            )

    async def _move_to_uniswap(self, agent_id: int, decision: Dict) -> TransactionResult:
        """Execute move to Uniswap v4 LP position"""
        if not self.account:
            return TransactionResult(False, '', 'base', 0, "No session key configured")
        
        opportunity = decision.get('target_opportunity', {})
        
        # Build transaction
        vault_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(self.vault_address),
            abi=self.vault_abi
        )
        
        # Encode action data
        action_data = self.w3.codec.encode(
            ['string', 'string', 'uint256'],
            ['MOVE_TO_UNISWAP_V4', opportunity.get('pool_id', ''), opportunity.get('apr', 0)]
        )
        
        # Build and send transaction
        tx = vault_contract.functions.executeAction(
            agent_id,
            action_data
        ).build_transaction({
            'from': self.account.address,
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address)
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return TransactionResult(
            success=receipt['status'] == 1,
            tx_hash=tx_hash.hex(),
            chain='base',
            gas_used=receipt['gasUsed']
        )

    async def _move_to_sui(self, agent_id: int, decision: Dict) -> TransactionResult:
        """Execute move to Sui DeepBook"""
        # For hackathon: simulate Sui transaction
        # In production: use pysui or similar to build and submit PTB
        
        opportunity = decision.get('target_opportunity', {})
        
        # Simulate successful Sui transaction
        return TransactionResult(
            success=True,
            tx_hash=f"0x{'a' * 64}",  # Simulated tx hash
            chain='sui',
            gas_used=1000000  # Simulated gas
        )

    async def _rebalance_uniswap(self, agent_id: int, decision: Dict) -> TransactionResult:
        """Rebalance existing Uniswap v4 position"""
        if not self.account:
            return TransactionResult(False, '', 'base', 0, "No session key configured")
        
        # Build rebalance action
        action_data = self.w3.codec.encode(
            ['string', 'int24', 'int24'],
            ['REBALANCE', -1000, 1000]  # Example tick range
        )
        
        vault_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(self.vault_address),
            abi=self.vault_abi
        )
        
        tx = vault_contract.functions.executeAction(
            agent_id,
            action_data
        ).build_transaction({
            'from': self.account.address,
            'gas': 300000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address)
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return TransactionResult(
            success=receipt['status'] == 1,
            tx_hash=tx_hash.hex(),
            chain='base',
            gas_used=receipt['gasUsed']
        )

    async def _execute_arbitrage(self, agent_id: int, decision: Dict) -> TransactionResult:
        """Execute cross-DEX arbitrage on Sui"""
        opportunity = decision.get('target_opportunity', {})
        
        # For hackathon: simulate arbitrage
        return TransactionResult(
            success=True,
            tx_hash=f"0x{'b' * 64}",
            chain='sui',
            gas_used=2000000
        )

    async def _log_to_ens(self, agent_id: int, decision: Dict) -> bool:
        """Log decision and reasoning to ENS text records"""
        if not self.account:
            print("Warning: No session key, skipping ENS logging")
            return False
        
        try:
            ens_contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(self.ens_manager_address),
                abi=self.ens_abi
            )
            
            # Calculate PnL (simplified)
            pnl = decision.get('estimated_pnl', 0)
            
            tx = ens_contract.functions.logDecisionToENS(
                agent_id,
                decision.get('action', 'UNKNOWN'),
                decision.get('reasoning', ''),
                pnl
            ).build_transaction({
                'from': self.account.address,
                'gas': 150000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })
            
            signed_tx = self.account.sign_transaction(tx)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            print(f"✅ Decision logged to ENS: {tx_hash.hex()}")
            return True
            
        except Exception as e:
            print(f"❌ ENS logging failed: {e}")
            return False

    async def pause_agent(self, agent_id: int) -> TransactionResult:
        """Pause an agent's autonomous execution"""
        if not self.account:
            return TransactionResult(False, '', 'base', 0, "No session key")
        
        vault_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(self.vault_address),
            abi=self.vault_abi
        )
        
        tx = vault_contract.functions.pauseAgent(agent_id).build_transaction({
            'from': self.account.address,
            'gas': 100000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address)
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return TransactionResult(
            success=receipt['status'] == 1,
            tx_hash=tx_hash.hex(),
            chain='base',
            gas_used=receipt['gasUsed']
        )

    async def resume_agent(self, agent_id: int) -> TransactionResult:
        """Resume an agent's autonomous execution"""
        if not self.account:
            return TransactionResult(False, '', 'base', 0, "No session key")
        
        vault_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(self.vault_address),
            abi=self.vault_abi
        )
        
        tx = vault_contract.functions.resumeAgent(agent_id).build_transaction({
            'from': self.account.address,
            'gas': 100000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address)
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return TransactionResult(
            success=receipt['status'] == 1,
            tx_hash=tx_hash.hex(),
            chain='base',
            gas_used=receipt['gasUsed']
        )
