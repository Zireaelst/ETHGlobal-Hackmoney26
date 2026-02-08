"""
AutonomousAgentLoop - Continuous execution loop for AI agents
Scans opportunities, makes decisions, and executes transactions
"""
import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except ImportError:
    pass  # dotenv is optional

# Use try/except for imports to handle IDE resolution
try:
    from services.opportunity_scanner import OpportunityScanner, Opportunity  # type: ignore
    from services.decision_engine import AgentDecisionEngine  # type: ignore
    from services.transaction_executor import AgentTransactionExecutor, TransactionResult  # type: ignore
except ImportError:
    # Fallback for when running from different directory
    from opportunity_scanner import OpportunityScanner, Opportunity  # type: ignore
    from decision_engine import AgentDecisionEngine  # type: ignore
    from transaction_executor import AgentTransactionExecutor, TransactionResult  # type: ignore


@dataclass
class AgentConfig:
    """Configuration for an autonomous agent"""
    agent_id: int
    strategy: str  # "aggressive", "balanced", "safe"
    is_active: bool
    last_action_time: Optional[datetime]
    min_action_interval: timedelta  # Rate limiting


class AutonomousAgentLoop:
    """
    Main autonomous agent execution loop.
    
    Continuously:
    1. Scans for DeFi opportunities across chains
    2. Uses AI to decide optimal actions
    3. Executes transactions on-chain
    4. Logs decisions to ENS for transparency
    """

    def __init__(self):
        # Initialize services
        self.scanner = OpportunityScanner(
            uniswap_subgraph_url=os.getenv(
                'UNISWAP_SUBGRAPH_URL',
                'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
            ),
            sui_rpc_url=os.getenv('SUI_RPC_URL', 'https://fullnode.testnet.sui.io')
        )
        
        self.decision_engine = AgentDecisionEngine()
        self.executor = AgentTransactionExecutor()
        
        # Agent registry
        self.agents: Dict[int, AgentConfig] = {}
        
        # Rate limiting: minimum 1 hour between actions per agent
        self.default_interval = timedelta(hours=1)
        
        # Loop control
        self._running = False
        self._task: Optional[asyncio.Task] = None
        
        # Metrics
        self.total_decisions = 0
        self.successful_actions = 0
        self.failed_actions = 0

    def register_agent(
        self,
        agent_id: int,
        strategy: str,
        min_interval_hours: int = 1
    ) -> None:
        """Register an agent for autonomous execution"""
        self.agents[agent_id] = AgentConfig(
            agent_id=agent_id,
            strategy=strategy,
            is_active=True,
            last_action_time=None,
            min_action_interval=timedelta(hours=min_interval_hours)
        )
        print(f"✅ Agent {agent_id} registered with {strategy} strategy")

    def pause_agent(self, agent_id: int) -> bool:
        """Pause an agent's autonomous execution"""
        if agent_id in self.agents:
            self.agents[agent_id].is_active = False
            print(f"⏸️  Agent {agent_id} paused")
            return True
        return False

    def resume_agent(self, agent_id: int) -> bool:
        """Resume an agent's autonomous execution"""
        if agent_id in self.agents:
            self.agents[agent_id].is_active = True
            print(f"▶️  Agent {agent_id} resumed")
            return True
        return False

    async def run(self, scan_interval: int = 60) -> None:
        """
        Main execution loop
        
        Args:
            scan_interval: Seconds between opportunity scans
        """
        self._running = True
        print("🚀 Starting Autonomous Agent Loop...")
        print(f"   Registered agents: {list(self.agents.keys())}")
        print(f"   Scan interval: {scan_interval}s")
        print()
        
        while self._running:
            try:
                await self._loop_iteration()
            except Exception as e:
                print(f"❌ Loop error: {e}")
            
            await asyncio.sleep(scan_interval)

    async def _loop_iteration(self) -> None:
        """Single iteration of the agent loop"""
        # Get active agents that are ready for action
        ready_agents = self._get_ready_agents()
        
        if not ready_agents:
            return
        
        # Scan opportunities once for all agents
        print(f"🔍 Scanning opportunities for {len(ready_agents)} agent(s)...")
        opportunities = await self.scanner.scan_all_opportunities()
        
        if not opportunities:
            print("   No opportunities found")
            return
        
        print(f"   Found {len(opportunities)} opportunities")
        
        # Process each ready agent
        for agent_config in ready_agents:
            await self.process_agent(agent_config, opportunities)

    def _get_ready_agents(self) -> List[AgentConfig]:
        """Get agents that are active and past their rate limit"""
        now = datetime.now()
        ready = []
        
        for agent in self.agents.values():
            if not agent.is_active:
                continue
            
            # Check rate limiting
            if agent.last_action_time is not None:
                time_since_last = now - agent.last_action_time
                if time_since_last < agent.min_action_interval:
                    continue
            
            ready.append(agent)
        
        return ready

    async def process_agent(
        self,
        agent_config: AgentConfig,
        opportunities: List[Opportunity]
    ) -> Optional[TransactionResult]:
        """
        Process a single agent:
        1. Get current positions (mocked for now)
        2. Ask AI for decision
        3. Execute if action needed
        4. Update last action time
        """
        agent_id = agent_config.agent_id
        print(f"\n🤖 Processing Agent {agent_id} ({agent_config.strategy} strategy)")
        
        # Get current positions (would query blockchain in production)
        current_positions = await self._get_agent_positions(agent_id)
        
        # Make AI decision
        decision = await self.decision_engine.make_decision(
            agent_id=agent_id,
            agent_strategy=agent_config.strategy,
            current_positions=current_positions,
            opportunities=[
                {
                    "strategy_type": opp.strategy_type,
                    "chain": opp.chain,
                    "apr": opp.apr,
                    "risk_level": opp.risk_level,
                    "details": opp.details
                }
                for opp in opportunities[:10]  # Limit to top 10
            ],
            market_context=await self._get_market_context()
        )
        
        self.total_decisions += 1
        
        action = decision.get('action', 'HOLD')
        reasoning = decision.get('reasoning', 'No reasoning provided')
        confidence = decision.get('confidence', 0)
        
        print(f"   Decision: {action}")
        print(f"   Confidence: {confidence:.1%}")
        print(f"   Reasoning: {reasoning[:100]}...")
        
        # Execute if not HOLD
        if action != 'HOLD':
            print(f"   Executing action...")
            result = await self.executor.execute_decision(agent_id, decision)
            
            if result.success:
                self.successful_actions += 1
                print(f"   ✅ Success! TX: {result.tx_hash[:20]}... on {result.chain}")
            else:
                self.failed_actions += 1
                print(f"   ❌ Failed: {result.error}")
            
            # Update last action time
            agent_config.last_action_time = datetime.now()
            
            return result
        else:
            print(f"   ⏸️  Holding position")
            return None

    async def _get_agent_positions(self, agent_id: int) -> List[Dict]:
        """Get agent's current positions (mocked for demo)"""
        # In production: query blockchain for actual positions
        return [
            {
                "chain": "base",
                "protocol": "uniswap-v4",
                "position_type": "lp",
                "amount_usd": 5000,
                "apr": 12.5,
                "tick_range": [-1000, 1000]
            }
        ]

    async def _get_market_context(self) -> Dict:
        """Get current market context"""
        # In production: query RPC for gas prices, etc.
        return {
            "eth_gas_price": 20,  # gwei
            "sui_load": "Normal",
            "volatility": "Medium",
            "timestamp": datetime.now().isoformat()
        }

    def stop(self) -> None:
        """Stop the agent loop gracefully"""
        print("\n👋 Stopping Autonomous Agent Loop...")
        self._running = False

    def get_stats(self) -> Dict:
        """Get loop statistics"""
        return {
            "total_decisions": self.total_decisions,
            "successful_actions": self.successful_actions,
            "failed_actions": self.failed_actions,
            "success_rate": (
                self.successful_actions / max(1, self.successful_actions + self.failed_actions)
            ),
            "registered_agents": len(self.agents),
            "active_agents": sum(1 for a in self.agents.values() if a.is_active)
        }


# Standalone runner for testing
async def main():
    """Run the agent loop standalone"""
    loop = AutonomousAgentLoop()
    
    # Register test agents
    loop.register_agent(1, "balanced")
    loop.register_agent(2, "aggressive")
    loop.register_agent(3, "safe")
    
    try:
        await loop.run(scan_interval=60)
    except KeyboardInterrupt:
        loop.stop()
        print("\nFinal stats:", loop.get_stats())


if __name__ == "__main__":
    asyncio.run(main())
