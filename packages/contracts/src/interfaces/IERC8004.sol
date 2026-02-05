// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title IERC8004 - Non-Fungible Autonomous Agent Standard
/// @author DeepMind Vaults Team
/// @notice Interface for autonomous AI agents represented as NFTs
/// @dev Extends ERC-721 with agent state management and action execution capabilities
interface IERC8004 is IERC721 {
    /// @notice Agent state structure containing configuration and metrics
    /// @param configHash IPFS hash of agent configuration
    /// @param reputation Agent reputation score (0-1000)
    /// @param lastActionTime Timestamp of last autonomous action
    /// @param isPaused Emergency stop flag
    struct AgentState {
        bytes32 configHash;
        uint256 reputation;
        uint256 lastActionTime;
        bool isPaused;
    }

    /// @notice Emitted when an agent executes an autonomous action
    /// @param agentId The agent NFT ID
    /// @param action Encoded action data
    /// @param success Whether the action succeeded
    /// @param timestamp Block timestamp of execution
    event AgentActionExecuted(
        uint256 indexed agentId,
        bytes action,
        bool success,
        uint256 timestamp
    );

    /// @notice Emitted when agent state is updated
    /// @param agentId The agent NFT ID
    /// @param newState The new agent state
    event AgentStateUpdated(uint256 indexed agentId, AgentState newState);

    /// @notice Emitted when agent reputation changes
    /// @param agentId The agent NFT ID
    /// @param oldReputation Previous reputation score
    /// @param newReputation New reputation score
    event ReputationChanged(
        uint256 indexed agentId,
        uint256 oldReputation,
        uint256 newReputation
    );

    /// @notice Get the current state of an agent
    /// @param agentId The agent NFT ID
    /// @return state Current agent state struct
    function getAgentState(
        uint256 agentId
    ) external view returns (AgentState memory state);

    /// @notice Execute an autonomous action on behalf of the agent
    /// @dev Caller must be authorized (owner or delegated session key)
    /// @param agentId The agent NFT ID
    /// @param action Encoded action data
    /// @return success Whether the action succeeded
    function executeAction(
        uint256 agentId,
        bytes calldata action
    ) external returns (bool success);

    /// @notice Update the state of an agent
    /// @dev Restricted to authorized callers (executor or oracle)
    /// @param agentId The agent NFT ID
    /// @param newState New state to set
    function updateAgentState(
        uint256 agentId,
        AgentState calldata newState
    ) external;

    /// @notice Pause an agent (emergency stop)
    /// @dev Only the agent NFT owner can pause
    /// @param agentId The agent NFT ID
    function pauseAgent(uint256 agentId) external;

    /// @notice Resume a paused agent
    /// @dev Only the agent NFT owner can resume
    /// @param agentId The agent NFT ID
    function resumeAgent(uint256 agentId) external;
}
