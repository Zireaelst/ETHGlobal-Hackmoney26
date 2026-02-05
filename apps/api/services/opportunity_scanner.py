"""
OpportunityScanner - Scans DeFi opportunities across Uniswap v4 and Sui DeepBook
"""
import asyncio
from typing import List, Dict
from dataclasses import dataclass
import aiohttp


@dataclass
class Opportunity:
    """Represents a DeFi opportunity"""
    strategy_type: str  # "uniswap_lp", "sui_mm", "arbitrage"
    chain: str
    apr: float
    risk_level: str  # "low", "medium", "high"
    details: Dict


class OpportunityScanner:
    """Scans for DeFi opportunities across multiple chains"""
    
    def __init__(
        self,
        uniswap_subgraph_url: str,
        sui_rpc_url: str,
    ):
        self.uniswap_subgraph = uniswap_subgraph_url
        self.sui_rpc = sui_rpc_url

    async def scan_all_opportunities(self) -> List[Opportunity]:
        """Scan both Uniswap v4 and Sui DeepBook"""
        
        uniswap_opps, sui_opps = await asyncio.gather(
            self.scan_uniswap_v4(),
            self.scan_sui_deepbook(),
            return_exceptions=True
        )
        
        # Handle exceptions
        all_opps = []
        if isinstance(uniswap_opps, list):
            all_opps.extend(uniswap_opps)
        if isinstance(sui_opps, list):
            all_opps.extend(sui_opps)
        
        # Sort by APR (highest first)
        all_opps.sort(key=lambda x: x.apr, reverse=True)
        
        return all_opps

    async def scan_uniswap_v4(self) -> List[Opportunity]:
        """Scan Uniswap v4 pools on Base"""
        
        query = """
        {
          pools(first: 10, orderBy: volumeUSD, orderDirection: desc) {
            id
            token0 { symbol }
            token1 { symbol }
            feeTier
            volumeUSD
            tvlUSD
          }
        }
        """
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    self.uniswap_subgraph,
                    json={'query': query},
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    data = await response.json()
                    pools = data.get('data', {}).get('pools', [])
            except Exception as e:
                print(f"Uniswap scan error: {e}")
                # Return mock data for hackathon demo
                return self._get_mock_uniswap_opportunities()
        
        opportunities = []
        for pool in pools:
            # Calculate APR from fees and volume
            daily_fees = float(pool['volumeUSD']) * (int(pool['feeTier']) / 1_000_000)
            annual_fees = daily_fees * 365
            tvl = float(pool['tvlUSD'])
            apr = (annual_fees / tvl * 100) if tvl > 0 else 0
            
            risk = self._classify_risk(tvl, apr)
            
            opportunities.append(Opportunity(
                strategy_type="uniswap_lp",
                chain="base",
                apr=apr,
                risk_level=risk,
                details={
                    'pool_id': pool['id'],
                    'pair': f"{pool['token0']['symbol']}/{pool['token1']['symbol']}",
                    'fee_tier': pool['feeTier'],
                    'tvl': tvl,
                    'volume_24h': float(pool['volumeUSD'])
                }
            ))
        
        return opportunities if opportunities else self._get_mock_uniswap_opportunities()

    async def scan_sui_deepbook(self) -> List[Opportunity]:
        """Scan Sui DeepBook pools for market making opportunities"""
        
        # For hackathon: Return mock data
        # Production would query Sui RPC for DeepBook pool states
        return [
            Opportunity(
                strategy_type="sui_market_making",
                chain="sui",
                apr=24.5,
                risk_level="medium",
                details={
                    'pool_id': '0x123abc...',
                    'pair': 'SUI/USDC',
                    'spread': 0.008,  # 0.8%
                    'liquidity': 50_000,
                    'volatility': 'medium'
                }
            ),
            Opportunity(
                strategy_type="sui_market_making",
                chain="sui",
                apr=18.2,
                risk_level="low",
                details={
                    'pool_id': '0x456def...',
                    'pair': 'USDC/USDT',
                    'spread': 0.002,  # 0.2%
                    'liquidity': 200_000,
                    'volatility': 'low'
                }
            ),
            Opportunity(
                strategy_type="sui_arbitrage",
                chain="sui",
                apr=35.0,
                risk_level="high",
                details={
                    'source_dex': 'DeepBook',
                    'target_dex': 'Cetus',
                    'pair': 'SUI/USDC',
                    'price_diff_bps': 45,  # 0.45%
                }
            ),
        ]

    def _classify_risk(self, tvl: float, apr: float) -> str:
        """Classify risk based on TVL and APR"""
        if tvl > 10_000_000 and apr < 15:
            return "low"
        elif tvl > 1_000_000 and apr < 30:
            return "medium"
        else:
            return "high"

    def _get_mock_uniswap_opportunities(self) -> List[Opportunity]:
        """Return mock opportunities for demo"""
        return [
            Opportunity(
                strategy_type="uniswap_lp",
                chain="base",
                apr=14.5,
                risk_level="low",
                details={
                    'pool_id': '0xabc123...',
                    'pair': 'ETH/USDC',
                    'fee_tier': 3000,
                    'tvl': 15_000_000,
                    'volume_24h': 2_500_000
                }
            ),
            Opportunity(
                strategy_type="uniswap_lp",
                chain="base",
                apr=22.3,
                risk_level="medium",
                details={
                    'pool_id': '0xdef456...',
                    'pair': 'WBTC/ETH',
                    'fee_tier': 500,
                    'tvl': 8_000_000,
                    'volume_24h': 1_800_000
                }
            ),
        ]
