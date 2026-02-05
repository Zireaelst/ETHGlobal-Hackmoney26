"""
AgentDecisionEngine - LLM-powered decision making for autonomous agents
"""
from typing import List, Dict
from openai import AsyncOpenAI
import json
import os


class AgentDecisionEngine:
    """Uses GPT-4o to make portfolio decisions for agents"""
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.model = "gpt-4o"

    async def make_decision(
        self,
        agent_id: int,
        agent_strategy: str,  # "aggressive", "balanced", "safe"
        current_positions: List[Dict],
        opportunities: List[Dict],
        market_context: Dict
    ) -> Dict:
        """Ask LLM to decide agent's next action"""
        
        prompt = self._build_decision_prompt(
            agent_strategy,
            current_positions,
            opportunities,
            market_context
        )
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an autonomous DeFi portfolio manager. "
                            "Make data-driven decisions to optimize yield while managing risk "
                            "according to the agent's strategy. Your reasoning will be displayed "
                            "on-chain via ENS for full transparency."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                tools=[
                    {
                        "type": "function",
                        "function": {
                            "name": "make_portfolio_decision",
                            "description": "Decide the next action for the agent's portfolio",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "action": {
                                        "type": "string",
                                        "enum": [
                                            "MOVE_TO_UNISWAP_V4",
                                            "MOVE_TO_SUI_DEEPBOOK",
                                            "REBALANCE_UNISWAP",
                                            "EXECUTE_ARBITRAGE",
                                            "HOLD"
                                        ],
                                        "description": "The action to take"
                                    },
                                    "reasoning": {
                                        "type": "string",
                                        "description": "Detailed explanation for transparency (shown on ENS)"
                                    },
                                    "target_opportunity": {
                                        "type": "object",
                                        "description": "The specific opportunity to pursue"
                                    },
                                    "confidence": {
                                        "type": "number",
                                        "description": "Confidence score 0-1"
                                    }
                                },
                                "required": ["action", "reasoning", "confidence"]
                            }
                        }
                    }
                ],
                tool_choice={"type": "function", "function": {"name": "make_portfolio_decision"}},
                temperature=0.7,
            )
            
            # Parse function call response
            tool_call = response.choices[0].message.tool_calls[0]
            function_args = json.loads(tool_call.function.arguments)
            
            return function_args
            
        except Exception as e:
            print(f"LLM decision error: {e}")
            # Fallback to safe decision
            return {
                "action": "HOLD",
                "reasoning": f"Error in decision making: {str(e)}. Holding current positions for safety.",
                "confidence": 0.0,
                "target_opportunity": None
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
- **Aggressive**: Target 20-35% APR, accept high risk, use 80% of capital, rebalance frequently
- **Balanced**: Target 10-15% APR, medium risk, use 50% of capital, balanced approach  
- **Safe**: Target 5-8% APR, low risk, use 30% of capital, prioritize stability

## Decision Task
Analyze the opportunities and decide:
1. Should we move capital to Uniswap v4 (Ethereum/Base)?
2. Should we move to Sui DeepBook (high speed, market making)?
3. Should we rebalance existing Uniswap LP positions?
4. Is there an arbitrage opportunity worth executing?
5. Or should we hold current positions?

## IMPORTANT
Your reasoning will be displayed to users on-chain via ENS. Be clear, concise, and transparent about:
- Why you made this decision
- What data points influenced you
- What risks you considered
- Expected outcomes

Provide a detailed explanation that builds user trust.
"""
