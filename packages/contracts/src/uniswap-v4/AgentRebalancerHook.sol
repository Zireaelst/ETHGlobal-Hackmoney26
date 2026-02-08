// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "./BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";

/// @title AgentRebalancerHook - Autonomous LP rebalancing for AI agents
/// @author DeepMind Vaults Team
/// @notice Uniswap v4 hook that automatically rebalances LP positions based on agent strategies
/// @dev Implements afterSwap hook to monitor pool activity and trigger rebalancing
contract AgentRebalancerHook is BaseHook {
    using PoolIdLibrary for PoolKey;
    using StateLibrary for IPoolManager;

    /*//////////////////////////////////////////////////////////////
                                 STRUCTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Agent LP position tracking
    struct AgentPosition {
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;
        uint256 lastRebalanceTime;
        uint256 feesCollected;
    }

    /*//////////////////////////////////////////////////////////////
                                 STATE
    //////////////////////////////////////////////////////////////*/

    /// @notice Agent ID => Pool ID => Position
    mapping(uint256 => mapping(PoolId => AgentPosition)) public agentPositions;

    /// @notice Minimum interval between rebalances (1 hour)
    uint256 public constant REBALANCE_INTERVAL = 1 hours;

    /// @notice Tick drift threshold for triggering rebalance (~1% price change)
    int24 public constant TICK_DRIFT_THRESHOLD = 100;

    /// @notice ENS registry for reading agent strategies
    address public immutable ensRegistry;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a position is rebalanced
    event PositionRebalanced(
        uint256 indexed agentId,
        PoolId indexed poolId,
        int24 newTickLower,
        int24 newTickUpper,
        uint256 timestamp
    );

    /// @notice Emitted when position is opened
    event PositionOpened(
        uint256 indexed agentId,
        PoolId indexed poolId,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    );

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @param _poolManager Uniswap v4 PoolManager
    /// @param _ensRegistry ENS registry address
    constructor(
        IPoolManager _poolManager,
        address _ensRegistry
    ) BaseHook(_poolManager) {
        ensRegistry = _ensRegistry;
    }

    /*//////////////////////////////////////////////////////////////
                            HOOK PERMISSIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Define which hooks this contract implements
    /// @return permissions Hooks.Permissions struct
    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: false,
                afterInitialize: false,
                beforeAddLiquidity: false,
                afterAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: false,
                afterSwap: true, // ✅ Monitor swap activity
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    /*//////////////////////////////////////////////////////////////
                              HOOK CALLBACKS
    //////////////////////////////////////////////////////////////*/

    /// @notice Called after each swap in the pool
    /// @param sender Swap initiator
    /// @param key Pool key
    /// @param params Swap parameters
    /// @param delta Balance changes
    /// @param hookData Encoded agent ID
    /// @return selector Function selector
    /// @return hookDelta Always 0 (no delta modification)
    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external override returns (bytes4, int128) {
        // Only process if hookData contains agent ID
        if (hookData.length == 0) {
            return (BaseHook.afterSwap.selector, 0);
        }

        // Decode agent ID from hookData
        uint256 agentId = abi.decode(hookData, (uint256));

        PoolId poolId = key.toId();
        AgentPosition storage position = agentPositions[agentId][poolId];

        // Check if rebalancing is needed
        if (_shouldRebalance(key, position)) {
            _executeRebalance(agentId, key, position);
        }

        return (BaseHook.afterSwap.selector, 0);
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Open a new LP position for an agent
    /// @param agentId Agent NFT ID
    /// @param key Pool key
    /// @param tickLower Lower tick bound
    /// @param tickUpper Upper tick bound
    /// @param liquidity Liquidity amount
    function openPosition(
        uint256 agentId,
        PoolKey calldata key,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    ) external {
        PoolId poolId = key.toId();

        agentPositions[agentId][poolId] = AgentPosition({
            tickLower: tickLower,
            tickUpper: tickUpper,
            liquidity: liquidity,
            lastRebalanceTime: block.timestamp,
            feesCollected: 0
        });

        emit PositionOpened(agentId, poolId, tickLower, tickUpper, liquidity);
    }

    /// @notice Get agent position for a pool
    /// @param agentId Agent NFT ID
    /// @param key Pool key
    /// @return position Agent position struct
    function getPosition(
        uint256 agentId,
        PoolKey calldata key
    ) external view returns (AgentPosition memory position) {
        return agentPositions[agentId][key.toId()];
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check if rebalancing is needed
    /// @param key Pool key
    /// @param position Agent's position
    /// @return shouldRebalance Whether to trigger rebalance
    function _shouldRebalance(
        PoolKey calldata key,
        AgentPosition storage position
    ) internal view returns (bool) {
        // No position exists
        if (position.liquidity == 0) return false;

        // Time-based: Minimum interval
        if (
            block.timestamp < position.lastRebalanceTime + REBALANCE_INTERVAL
        ) {
            return false;
        }

        // Price-based: Check if current tick drifted
        (, int24 currentTick, , ) = poolManager.getSlot0(key.toId());

        // Calculate midpoint of current range
        int24 tickMid = (position.tickLower + position.tickUpper) / 2;

        // Calculate absolute drift
        int24 tickDrift = currentTick > tickMid
            ? currentTick - tickMid
            : tickMid - currentTick;

        return tickDrift > TICK_DRIFT_THRESHOLD;
    }

    /// @notice Execute position rebalancing
    /// @param agentId Agent NFT ID
    /// @param key Pool key
    /// @param position Agent's position
    function _executeRebalance(
        uint256 agentId,
        PoolKey calldata key,
        AgentPosition storage position
    ) internal {
        // Get agent strategy from ENS (simplified)
        string memory strategy = _getAgentStrategy(agentId);

        // Get current pool tick
        (, int24 currentTick, , ) = poolManager.getSlot0(key.toId());

        // Calculate new optimal range
        (int24 newTickLower, int24 newTickUpper) = _calculateOptimalRange(
            currentTick,
            strategy,
            key.tickSpacing
        );

        // In production, execute actual liquidity modification via PoolManager
        // For hackathon demo, update position record

        // Update position
        position.tickLower = newTickLower;
        position.tickUpper = newTickUpper;
        position.lastRebalanceTime = block.timestamp;

        emit PositionRebalanced(
            agentId,
            key.toId(),
            newTickLower,
            newTickUpper,
            block.timestamp
        );
    }

    /// @notice Get agent strategy from ENS
    /// @param agentId Agent NFT ID
    /// @return strategy Strategy string
    function _getAgentStrategy(
        uint256 agentId
    ) internal view returns (string memory) {
        // Simplified for hackathon - always return balanced
        // In production, query ENS resolver for agent.strategy text record
        return "balanced";
    }

    /// @notice Calculate optimal tick range based on strategy
    /// @param currentTick Current pool tick
    /// @param strategy Agent strategy type
    /// @param tickSpacing Pool's tick spacing
    /// @return lower Lower tick bound
    /// @return upper Upper tick bound
    function _calculateOptimalRange(
        int24 currentTick,
        string memory strategy,
        int24 tickSpacing
    ) internal pure returns (int24 lower, int24 upper) {
        int24 range;

        // Strategy-based range width
        if (
            keccak256(bytes(strategy)) == keccak256(bytes("aggressive"))
        ) {
            // Narrow range: ±5% price range (higher capital efficiency)
            range = 500;
        } else if (
            keccak256(bytes(strategy)) == keccak256(bytes("balanced"))
        ) {
            // Medium range: ±10% price range
            range = 1000;
        } else {
            // Wide range: ±20% price range (safer, less IL)
            range = 2000;
        }

        // Align to tick spacing
        lower = ((currentTick - range) / tickSpacing) * tickSpacing;
        upper = ((currentTick + range) / tickSpacing) * tickSpacing;
    }
}
