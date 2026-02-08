"""
FastAPI Main Application - DeepMind Vaults API
"""
from fastapi import FastAPI, BackgroundTasks, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from contextlib import asynccontextmanager
from pydantic import BaseModel  # type: ignore
from typing import List, Optional
import os
import asyncio

try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except ImportError:
    pass

from services.opportunity_scanner import OpportunityScanner  # type: ignore
from services.decision_engine import AgentDecisionEngine  # type: ignore

# Global instances
scanner: Optional[OpportunityScanner] = None
decision_engine: Optional[AgentDecisionEngine] = None
agent_loop_task: Optional[asyncio.Task] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global scanner, decision_engine, agent_loop_task
    
    print("🚀 Starting DeepMind Vaults API...")
    
    # Initialize services
    scanner = OpportunityScanner(
        uniswap_subgraph_url=os.getenv('UNISWAP_SUBGRAPH_URL', 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'),
        sui_rpc_url=os.getenv('SUI_RPC_URL', 'https://fullnode.testnet.sui.io')
    )
    
    # Initialize decision engine (works without OpenAI key - uses rule-based fallback)
    decision_engine = AgentDecisionEngine()
    
    if decision_engine.is_platform_ai_available:
        print("✅ Platform AI (GPT-4o) available")
    else:
        print("⚠️  No OpenAI key - using rule-based decisions (users can provide their own AI)")
    
    print("✅ Services initialized")
    
    # Start agent loop (commented for manual control during dev)
    # agent_loop_task = asyncio.create_task(run_agent_loop())
    
    yield
    
    # Cleanup
    if agent_loop_task:
        agent_loop_task.cancel()
    print("👋 Shutting down DeepMind Vaults API")


app = FastAPI(
    title="DeepMind Vaults API",
    description="Autonomous AI Agent Portfolio Management",
    version="1.0.0",
    lifespan=lifespan
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://deepmindvaults.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Models ============

class AgentStatus(BaseModel):
    agent_id: int
    is_active: bool
    last_action: str
    total_trades: int
    win_rate: float
    reputation: int


class Decision(BaseModel):
    timestamp: str
    action: str
    reasoning: str
    pnl: str
    confidence: float


class OpportunityResponse(BaseModel):
    strategy_type: str
    chain: str
    apr: float
    risk_level: str
    details: dict


# ============ Endpoints ============

@app.get("/")
async def root():
    """Root endpoint - API info"""
    return {
        "name": "DeepMind Vaults API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "deepmind-vaults-api",
        "version": "1.0.0"
    }


@app.get("/agents/{agent_id}/status", response_model=AgentStatus)
async def get_agent_status(agent_id: int):
    """Get agent's current status"""
    # In production: query from database/blockchain
    return AgentStatus(
        agent_id=agent_id,
        is_active=True,
        last_action="2024-02-06T12:00:00Z",
        total_trades=42,
        win_rate=68.2,
        reputation=750
    )


@app.post("/agents/{agent_id}/pause")
async def pause_agent(agent_id: int):
    """Pause an agent's autonomous execution"""
    # In production: call contract's pauseAgent()
    return {"message": f"Agent {agent_id} paused", "success": True}


@app.post("/agents/{agent_id}/resume")
async def resume_agent(agent_id: int):
    """Resume an agent's autonomous execution"""
    # In production: call contract's resumeAgent()
    return {"message": f"Agent {agent_id} resumed", "success": True}


@app.get("/agents/{agent_id}/decisions", response_model=List[Decision])
async def get_decisions(agent_id: int, limit: int = 10):
    """Get agent's decision history"""
    # In production: query from database
    return [
        Decision(
            timestamp="2024-02-06T12:00:00Z",
            action="MOVE_TO_SUI_DEEPBOOK",
            reasoning="DeepBook spread widened to 0.8% (vs 0.3% average). Low liquidity = high MM profit. Sui network stable. Fits balanced risk profile.",
            pnl="+$127.50",
            confidence=0.85
        ),
        Decision(
            timestamp="2024-02-06T10:30:00Z",
            action="REBALANCE_UNISWAP",
            reasoning="Price moved 3% outside optimal range. Rebalancing LP position to capture more fees.",
            pnl="+$42.30",
            confidence=0.78
        ),
    ]


@app.get("/opportunities", response_model=List[OpportunityResponse])
async def get_opportunities():
    """Scan and return current DeFi opportunities"""
    if not scanner:
        raise HTTPException(status_code=503, detail="Scanner not initialized")
    
    opportunities = await scanner.scan_all_opportunities()
    
    return [
        OpportunityResponse(
            strategy_type=opp.strategy_type,
            chain=opp.chain,
            apr=opp.apr,
            risk_level=opp.risk_level,
            details=opp.details
        )
        for opp in opportunities
    ]


@app.post("/agents/{agent_id}/trigger-decision")
async def trigger_decision(agent_id: int):
    """Manually trigger a decision for an agent (for testing)"""
    if not scanner or not decision_engine:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    # Scan opportunities
    opportunities = await scanner.scan_all_opportunities()
    
    # Mock current positions
    current_positions = [
        {
            "chain": "base",
            "protocol": "uniswap-v4",
            "position_type": "lp",
            "amount_usd": 5000,
            "apr": 12.5
        }
    ]
    
    # Make decision
    decision = await decision_engine.make_decision(
        agent_id=agent_id,
        agent_strategy="balanced",
        current_positions=current_positions,
        opportunities=[
            {
                "strategy_type": opp.strategy_type,
                "chain": opp.chain,
                "apr": opp.apr,
                "risk_level": opp.risk_level,
                "details": opp.details
            }
            for opp in opportunities[:5]
        ],
        market_context={
            "eth_gas_price": 20,
            "sui_load": "Normal",
            "volatility": "Medium"
        }
    )
    
    return {
        "agent_id": agent_id,
        "decision": decision
    }


@app.get("/agents/all")
async def get_all_agents():
    """Get all registered agents"""
    # In production: query from contract events
    return [
        {
            "id": 1,
            "ensName": "agent-1.moltqore.eth",
            "strategy": "aggressive",
            "reputation": 850,
            "winRate": 72.3,
            "totalProfit": 12450,
        },
        {
            "id": 2,
            "ensName": "agent-2.moltqore.eth",
            "strategy": "balanced",
            "reputation": 720,
            "winRate": 68.1,
            "totalProfit": 8920,
        },
        {
            "id": 3,
            "ensName": "agent-3.moltqore.eth",
            "strategy": "safe",
            "reputation": 680,
            "winRate": 65.5,
            "totalProfit": 4230,
        },
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
