// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";

/// @title AgentLiquidityManager - Manages LP positions for AI agents
/// @author DeepMind Vaults Team
/// @notice Provides liquidity management functions for autonomous agents on Uniswap v4
contract AgentLiquidityManager {
    using PoolIdLibrary for PoolKey;

    /*//////////////////////////////////////////////////////////////
                                 STRUCTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Represents an agent's liquidity position
    struct AgentPosition {
        uint256 agentId;
        PoolId poolId;
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;
        uint256 feesCollected0;
        uint256 feesCollected1;
        uint256 createTime;
        bool isActive;
    }

    /*//////////////////////////////////////////////////////////////
                                 STATE
    //////////////////////////////////////////////////////////////*/

    /// @notice Uniswap v4 PoolManager
    IPoolManager public immutable poolManager;

    /// @notice DeepMindVault contract address
    address public immutable deepMindVault;

    /// @notice Agent ID => Position index => Position
    mapping(uint256 => mapping(uint256 => AgentPosition)) public positions;

    /// @notice Agent ID => Number of positions
    mapping(uint256 => uint256) public positionCount;

    /// @notice Authorized executor address
    address public executor;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when liquidity is added
    event LiquidityAdded(
        uint256 indexed agentId,
        uint256 indexed positionIndex,
        PoolId poolId,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    );

    /// @notice Emitted when liquidity is removed
    event LiquidityRemoved(
        uint256 indexed agentId,
        uint256 indexed positionIndex,
        uint128 liquidity
    );

    /// @notice Emitted when fees are collected
    event FeesCollected(
        uint256 indexed agentId,
        uint256 indexed positionIndex,
        uint256 amount0,
        uint256 amount1
    );

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @param _poolManager Uniswap v4 PoolManager address
    /// @param _deepMindVault DeepMindVault contract address
    constructor(address _poolManager, address _deepMindVault) {
        poolManager = IPoolManager(_poolManager);
        deepMindVault = _deepMindVault;
        executor = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Add liquidity for an agent
    /// @param agentId Agent NFT ID
    /// @param key Pool key
    /// @param tickLower Lower tick bound
    /// @param tickUpper Upper tick bound
    /// @param liquidity Amount of liquidity to add
    /// @return positionIndex Index of the created position
    function addLiquidity(
        uint256 agentId,
        PoolKey calldata key,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    ) external returns (uint256 positionIndex) {
        require(msg.sender == executor, "Only executor");
        require(liquidity > 0, "Invalid liquidity");

        PoolId poolId = key.toId();
        positionIndex = positionCount[agentId];

        // Create position record
        positions[agentId][positionIndex] = AgentPosition({
            agentId: agentId,
            poolId: poolId,
            tickLower: tickLower,
            tickUpper: tickUpper,
            liquidity: liquidity,
            feesCollected0: 0,
            feesCollected1: 0,
            createTime: block.timestamp,
            isActive: true
        });

        positionCount[agentId]++;

        // In production: call poolManager.modifyLiquidity() via unlock callback
        // For hackathon demo, we track positions and emit events

        emit LiquidityAdded(
            agentId,
            positionIndex,
            poolId,
            tickLower,
            tickUpper,
            liquidity
        );
    }

    /// @notice Remove liquidity from an agent's position
    /// @param agentId Agent NFT ID
    /// @param positionIndex Index of the position
    /// @param liquidityToRemove Amount of liquidity to remove (0 = all)
    function removeLiquidity(
        uint256 agentId,
        uint256 positionIndex,
        uint128 liquidityToRemove
    ) external {
        require(msg.sender == executor, "Only executor");
        
        AgentPosition storage pos = positions[agentId][positionIndex];
        require(pos.isActive, "Position not active");

        uint128 toRemove = liquidityToRemove == 0 ? pos.liquidity : liquidityToRemove;
        require(toRemove <= pos.liquidity, "Insufficient liquidity");

        pos.liquidity -= toRemove;
        
        if (pos.liquidity == 0) {
            pos.isActive = false;
        }

        // In production: call poolManager.modifyLiquidity() to remove

        emit LiquidityRemoved(agentId, positionIndex, toRemove);
    }

    /// @notice Collect accumulated fees from a position
    /// @param agentId Agent NFT ID
    /// @param positionIndex Index of the position
    /// @return amount0 Token0 fees collected
    /// @return amount1 Token1 fees collected
    function collectFees(
        uint256 agentId,
        uint256 positionIndex
    ) external returns (uint256 amount0, uint256 amount1) {
        require(msg.sender == executor, "Only executor");
        
        AgentPosition storage pos = positions[agentId][positionIndex];
        require(pos.isActive, "Position not active");

        // In production: call poolManager.collect()
        // For hackathon demo, simulate fee collection based on time and liquidity
        
        uint256 timePassed = block.timestamp - pos.createTime;
        
        // Simulated fee calculation (for demo purposes)
        // ~20% APR = 0.00054% per hour
        amount0 = (uint256(pos.liquidity) * timePassed * 54) / (100_000_000 * 3600);
        amount1 = (uint256(pos.liquidity) * timePassed * 54) / (100_000_000 * 3600);

        pos.feesCollected0 += amount0;
        pos.feesCollected1 += amount1;

        emit FeesCollected(agentId, positionIndex, amount0, amount1);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Get position details
    /// @param agentId Agent NFT ID
    /// @param positionIndex Position index
    /// @return position AgentPosition struct
    function getPosition(
        uint256 agentId,
        uint256 positionIndex
    ) external view returns (AgentPosition memory) {
        return positions[agentId][positionIndex];
    }

    /// @notice Get all positions for an agent
    /// @param agentId Agent NFT ID
    /// @return allPositions Array of positions
    function getAllPositions(
        uint256 agentId
    ) external view returns (AgentPosition[] memory allPositions) {
        uint256 count = positionCount[agentId];
        allPositions = new AgentPosition[](count);
        
        for (uint256 i = 0; i < count; i++) {
            allPositions[i] = positions[agentId][i];
        }
    }

    /// @notice Get total value locked by an agent
    /// @param agentId Agent NFT ID
    /// @return totalLiquidity Sum of all active position liquidities
    function getTotalLiquidity(uint256 agentId) external view returns (uint128 totalLiquidity) {
        uint256 count = positionCount[agentId];
        
        for (uint256 i = 0; i < count; i++) {
            if (positions[agentId][i].isActive) {
                totalLiquidity += positions[agentId][i].liquidity;
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Update executor address
    /// @param newExecutor New executor address
    function setExecutor(address newExecutor) external {
        require(msg.sender == executor, "Only executor");
        executor = newExecutor;
    }
}
