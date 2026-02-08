// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IERC8004.sol";

/// @title DeepMindVault - ERC-8004 Autonomous Agent NFT
/// @author DeepMind Vaults Team
/// @notice Manages AI agent identities and cross-chain vault coordination
/// @dev Implements IERC8004 for autonomous agent NFT standard
contract DeepMindVault is ERC721, IERC8004, Ownable {
    using Strings for uint256;

    /*//////////////////////////////////////////////////////////////
                                 STRUCTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Complete agent data structure
    struct Agent {
        uint256 agentId;
        address owner;
        bytes32 ensNode;           // ENS namehash
        bytes32 strategyHash;      // IPFS CID of strategy config
        bytes32 suiVaultAddress;   // Sui vault object ID
        uint256 reputation;        // 0-1000 score
        uint256 totalTrades;
        uint256 profitableTrades;
        uint256 lastSyncTimestamp;
        bool isPaused;
    }

    /// @notice Session key delegation for autonomous actions
    struct SessionKey {
        address keyAddress;
        uint256 expiry;
        bool isActive;
    }

    /*//////////////////////////////////////////////////////////////
                                 STATE
    //////////////////////////////////////////////////////////////*/

    /// @notice Agent ID => Agent data
    mapping(uint256 => Agent) public agents;

    /// @notice Agent ID => Session key
    mapping(uint256 => SessionKey) public sessionKeys;

    /// @notice Counter for next agent ID
    uint256 private _nextAgentId = 1;

    /// @notice Authorized executor address (backend service)
    address public executor;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a new agent is minted
    event AgentMinted(
        uint256 indexed agentId,
        address indexed owner,
        bytes32 ensNode,
        bytes32 suiVault
    );

    /// @notice Emitted when session key is delegated
    event SessionKeyDelegated(
        uint256 indexed agentId,
        address indexed sessionKey,
        uint256 expiry
    );

    /// @notice Emitted when agent strategy is updated
    event StrategyUpdated(
        uint256 indexed agentId,
        bytes32 oldStrategy,
        bytes32 newStrategy
    );

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() ERC721("DeepMind Agent", "DMAI") Ownable(msg.sender) {}

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Mint a new agent NFT
    /// @param ensName ENS name (e.g., "agent-42.moltqore.eth")
    /// @param strategyHash IPFS hash of strategy configuration
    /// @param suiVaultAddress Sui vault object ID
    /// @return agentId The minted agent's ID
    function mintAgent(
        string memory ensName,
        bytes32 strategyHash,
        bytes32 suiVaultAddress
    ) external returns (uint256 agentId) {
        agentId = _nextAgentId++;

        // Calculate ENS namehash (simplified for hackathon)
        bytes32 ensNode = keccak256(
            abi.encodePacked(
                keccak256(abi.encodePacked(bytes32(0), keccak256("eth"))),
                keccak256(bytes(ensName))
            )
        );

        // Mint NFT
        _mint(msg.sender, agentId);

        // Create agent record
        agents[agentId] = Agent({
            agentId: agentId,
            owner: msg.sender,
            ensNode: ensNode,
            strategyHash: strategyHash,
            suiVaultAddress: suiVaultAddress,
            reputation: 500, // Starting reputation
            totalTrades: 0,
            profitableTrades: 0,
            lastSyncTimestamp: block.timestamp,
            isPaused: false
        });

        emit AgentMinted(agentId, msg.sender, ensNode, suiVaultAddress);
    }

    /// @notice Delegate session key for autonomous actions
    /// @param agentId Agent NFT ID
    /// @param sessionKey Address authorized to execute actions
    /// @param expiry Unix timestamp when key expires
    function delegateSessionKey(
        uint256 agentId,
        address sessionKey,
        uint256 expiry
    ) external {
        require(ownerOf(agentId) == msg.sender, "Not agent owner");
        require(expiry > block.timestamp, "Invalid expiry");

        sessionKeys[agentId] = SessionKey({
            keyAddress: sessionKey,
            expiry: expiry,
            isActive: true
        });

        emit SessionKeyDelegated(agentId, sessionKey, expiry);
    }

    /// @notice Update agent strategy
    /// @param agentId Agent NFT ID
    /// @param newStrategy New IPFS hash
    function updateStrategy(uint256 agentId, bytes32 newStrategy) external {
        require(ownerOf(agentId) == msg.sender, "Not agent owner");

        bytes32 oldStrategy = agents[agentId].strategyHash;
        agents[agentId].strategyHash = newStrategy;

        emit StrategyUpdated(agentId, oldStrategy, newStrategy);
    }

    /// @notice Pause an agent (emergency stop)
    /// @param agentId Agent NFT ID
    function pauseAgent(uint256 agentId) external override {
        require(ownerOf(agentId) == msg.sender, "Not agent owner");

        agents[agentId].isPaused = true;

        emit AgentStateUpdated(
            agentId,
            AgentState({
                configHash: agents[agentId].strategyHash,
                reputation: agents[agentId].reputation,
                lastActionTime: block.timestamp,
                isPaused: true
            })
        );
    }

    /// @notice Resume a paused agent
    /// @param agentId Agent NFT ID
    function resumeAgent(uint256 agentId) external override {
        require(ownerOf(agentId) == msg.sender, "Not agent owner");

        agents[agentId].isPaused = false;

        emit AgentStateUpdated(
            agentId,
            AgentState({
                configHash: agents[agentId].strategyHash,
                reputation: agents[agentId].reputation,
                lastActionTime: block.timestamp,
                isPaused: false
            })
        );
    }

    /// @notice Get agent state (ERC-8004 interface)
    /// @param agentId Agent NFT ID
    /// @return state Current agent state
    function getAgentState(
        uint256 agentId
    ) external view override returns (AgentState memory state) {
        Agent memory agent = agents[agentId];

        return
            AgentState({
                configHash: agent.strategyHash,
                reputation: agent.reputation,
                lastActionTime: agent.lastSyncTimestamp,
                isPaused: agent.isPaused
            });
    }

    /// @notice Execute autonomous action (ERC-8004)
    /// @param agentId Agent NFT ID
    /// @param action Encoded action data
    /// @return success Whether action succeeded
    function executeAction(
        uint256 agentId,
        bytes calldata action
    ) external override returns (bool success) {
        require(!agents[agentId].isPaused, "Agent paused");

        // Verify session key authorization
        SessionKey memory sessionKey = sessionKeys[agentId];
        require(sessionKey.isActive, "No active session key");
        require(sessionKey.expiry > block.timestamp, "Session key expired");
        require(msg.sender == sessionKey.keyAddress, "Unauthorized");

        // In production, decode and execute action
        // For hackathon, just emit event
        emit AgentActionExecuted(agentId, action, true, block.timestamp);

        return true;
    }

    /// @notice Update agent state (restricted to executor)
    /// @param agentId Agent NFT ID
    /// @param newState New state to set
    function updateAgentState(
        uint256 agentId,
        AgentState calldata newState
    ) external override {
        require(msg.sender == executor, "Only executor");

        Agent storage agent = agents[agentId];
        agent.strategyHash = newState.configHash;
        agent.reputation = newState.reputation;
        agent.lastSyncTimestamp = newState.lastActionTime;
        agent.isPaused = newState.isPaused;

        emit AgentStateUpdated(agentId, newState);
    }

    /// @notice Sync reputation from Sui chain
    /// @param agentId Agent NFT ID
    /// @param newReputation New reputation score
    /// @param totalTrades Total trades count
    /// @param profitableTrades Profitable trades count
    /// @param proof Merkle proof (simplified for hackathon)
    function syncReputationFromSui(
        uint256 agentId,
        uint256 newReputation,
        uint256 totalTrades,
        uint256 profitableTrades,
        bytes memory proof
    ) external {
        require(msg.sender == executor, "Only executor");
        // In production, verify Merkle proof here

        Agent storage agent = agents[agentId];
        uint256 oldReputation = agent.reputation;

        agent.reputation = newReputation;
        agent.totalTrades = totalTrades;
        agent.profitableTrades = profitableTrades;
        agent.lastSyncTimestamp = block.timestamp;

        emit ReputationChanged(agentId, oldReputation, newReputation);
    }

    /// @notice Set authorized executor address
    /// @param _executor New executor address
    function setExecutor(address _executor) external onlyOwner {
        executor = _executor;
    }

    /// @notice Get full agent data
    /// @param agentId Agent NFT ID
    /// @return Agent struct
    function getAgent(uint256 agentId) external view returns (Agent memory) {
        return agents[agentId];
    }
}
