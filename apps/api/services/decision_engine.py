"""
AgentDecisionEngine - Hybrid AI decision making for autonomous agents
Supports: Platform GPT-4o, User OpenAI Key, OpenClaw, Custom Endpoints
"""
from typing import List, Dict, Optional, Literal
from dataclasses import dataclass
import json
import os
import httpx


# ============ AI Provider Types ============

@dataclass
class PlatformAIProvider:
    """Use platform's GPT-4o"""
    type: Literal["platform"] = "platform"


@dataclass
class UserOpenAIProvider:
    """User provides their own OpenAI key"""
    type: Literal["openai"] = "openai"
    api_key: str = ""


@dataclass
class OpenClawProvider:
    """Use OpenClaw webhook for decisions"""
    type: Literal["openclaw"] = "openclaw"
    webhook_url: str = ""


@dataclass
class CustomEndpointProvider:
    """Custom AI endpoint (local LLM, etc)"""
    type: Literal["custom"] = "custom"
    endpoint: str = ""
    headers: Dict = None


AIProvider = PlatformAIProvider | UserOpenAIProvider | OpenClawProvider | CustomEndpointProvider


# ============ Decision Engine ============

class AgentDecisionEngine:
    """Hybrid AI decision engine supporting multiple providers"""
    
    def __init__(self, default_api_key: Optional[str] = None):
        self.default_api_key = default_api_key or os.getenv('OPENAI_API_KEY')
        self.model = "gpt-4o"
        self._client = None
    
    @property
    def is_platform_ai_available(self) -> bool:
        """Check if platform AI (GPT-4o) is available"""
        return bool(self.default_api_key)
    
    async def make_decision(
        self,
        agent_id: int,
        agent_strategy: str,  # "aggressive", "balanced", "safe"
        current_positions: List[Dict],
        opportunities: List[Dict],
        market_context: Dict,
        provider: Optional[AIProvider] = None
    ) -> Dict:
        """
        Ask AI to decide agent's next action.
        Uses the specified provider or falls back to rule-based decisions.
        """
        
        # Build prompt for AI
        prompt = self._build_decision_prompt(
            agent_strategy,
            current_positions,
            opportunities,
            market_context
        )
        
        # Route to appropriate AI provider
        if provider is None:
            provider = PlatformAIProvider()
        
        try:
            if isinstance(provider, PlatformAIProvider):
                return await self._call_openai(prompt, self.default_api_key)
            elif isinstance(provider, UserOpenAIProvider):
                return await self._call_openai(prompt, provider.api_key)
            elif isinstance(provider, OpenClawProvider):
                return await self._call_openclaw(prompt, provider.webhook_url)
            elif isinstance(provider, CustomEndpointProvider):
                return await self._call_custom(prompt, provider)
            else:
                return self._rule_based_decision(agent_strategy, opportunities)
        except Exception as e:
            print(f"AI decision error: {e}")
            return self._rule_based_decision(agent_strategy, opportunities)
    
    async def _call_openai(self, prompt: str, api_key: Optional[str]) -> Dict:
        """Call OpenAI GPT-4o"""
        if not api_key:
            raise ValueError("OpenAI API key not provided")
        
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=api_key)
        
        response = await client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an autonomous DeFi portfolio manager. "
                        "Make data-driven decisions to optimize yield while managing risk. "
                        "Your reasoning will be displayed on-chain via ENS for full transparency."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            tools=[{
                "type": "function",
                "function": {
                    "name": "make_portfolio_decision",
                    "description": "Decide the next action for the agent's portfolio",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "action": {
                                "type": "string",
                                "enum": ["MOVE_TO_UNISWAP_V4", "MOVE_TO_SUI_DEEPBOOK", 
                                        "REBALANCE_UNISWAP", "EXECUTE_ARBITRAGE", "HOLD"]
                            },
                            "reasoning": {"type": "string"},
                            "target_opportunity": {"type": "object"},
                            "confidence": {"type": "number"}
                        },
                        "required": ["action", "reasoning", "confidence"]
                    }
                }
            }],
            tool_choice={"type": "function", "function": {"name": "make_portfolio_decision"}},
            temperature=0.7,
        )
        
        tool_call = response.choices[0].message.tool_calls[0]
        return json.loads(tool_call.function.arguments)
    
    async def _call_openclaw(self, prompt: str, webhook_url: str) -> Dict:
        """Call OpenClaw webhook for decision"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                webhook_url,
                json={
                    "message": prompt,
                    "context": "defi_portfolio_decision"
                },
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    
    async def _call_custom(self, prompt: str, provider: CustomEndpointProvider) -> Dict:
        """Call custom AI endpoint"""
        async with httpx.AsyncClient() as client:
            headers = provider.headers or {"Content-Type": "application/json"}
            response = await client.post(
                provider.endpoint,
                json={"prompt": prompt},
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    
    def _rule_based_decision(self, strategy: str, opportunities: List[Dict]) -> Dict:
        """
        Fallback rule-based decision when no AI is available.
        Simple heuristics based on strategy and opportunities.
        """
        if not opportunities:
            return {
                "action": "HOLD",
                "reasoning": "No opportunities available. Holding current positions.",
                "confidence": 0.8,
                "target_opportunity": None,
                "provider": "rule_based"
            }
        
        # Sort by APR
        sorted_opps = sorted(opportunities, key=lambda x: x.get('apr', 0), reverse=True)
        best_opp = sorted_opps[0]
        
        # Strategy-based thresholds
        thresholds = {
            "aggressive": {"min_apr": 15, "max_risk": "high"},
            "balanced": {"min_apr": 10, "max_risk": "medium"},
            "safe": {"min_apr": 5, "max_risk": "low"}
        }
        
        config = thresholds.get(strategy, thresholds["balanced"])
        
        if best_opp.get('apr', 0) >= config['min_apr']:
            chain = best_opp.get('chain', 'base')
            action = "MOVE_TO_SUI_DEEPBOOK" if chain == 'sui' else "MOVE_TO_UNISWAP_V4"
            
            return {
                "action": action,
                "reasoning": f"Found {best_opp.get('apr', 0):.1f}% APR opportunity on {chain}. "
                           f"Meets {strategy} strategy threshold of {config['min_apr']}% min APR.",
                "confidence": 0.7,
                "target_opportunity": best_opp,
                "provider": "rule_based"
            }
        
        return {
            "action": "HOLD",
            "reasoning": f"Best available APR ({best_opp.get('apr', 0):.1f}%) "
                        f"below {strategy} threshold ({config['min_apr']}%).",
            "confidence": 0.6,
            "target_opportunity": None,
            "provider": "rule_based"
        }

    def _build_decision_prompt(
        self,
        strategy: str,
        positions: List[Dict],
        opportunities: List[Dict],
        context: Dict
    ) -> str:
        """Build comprehensive prompt for LLM"""
        
        return f"""
You are managing a DeFi portfolio with a '{strategy}' risk strategy.

## Current Positions
```json
{json.dumps(positions, indent=2)}
```

## Available Opportunities
```json
{json.dumps(opportunities, indent=2)}
```

## Market Context
- Gas prices (Base): {context.get('eth_gas_price', 20)} gwei
- Sui network load: {context.get('sui_load', 'Normal')}
- Market volatility: {context.get('volatility', 'Medium')}

## Strategy Guidelines
- **Aggressive**: Target 20-35% APR, accept high risk, use 80% of capital
- **Balanced**: Target 10-15% APR, medium risk, use 50% of capital
- **Safe**: Target 5-8% APR, low risk, use 30% of capital

## Decision Task
Analyze opportunities and decide the best action. Your reasoning will be displayed on-chain via ENS for transparency.
"""
