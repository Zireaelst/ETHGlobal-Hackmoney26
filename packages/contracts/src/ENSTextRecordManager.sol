// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @notice Simplified ENS interface for hackathon
interface IENS {
    function resolver(bytes32 node) external view returns (address);
}

/// @notice Simplified PublicResolver interface
interface IPublicResolver {
    function setText(
        bytes32 node,
        string calldata key,
        string calldata value
    ) external;
}

/// @title ENSTextRecordManager - ENS integration for agent metadata
/// @author DeepMind Vaults Team
/// @notice Manages ENS text records for transparent agent decision logging
/// @dev Provides gas-optimized batch updates for on-chain transparency
contract ENSTextRecordManager is Ownable {
    using Strings for uint256;
    using Strings for int256;

    /*//////////////////////////////////////////////////////////////
                                 STATE
    //////////////////////////////////////////////////////////////*/

    /// @notice ENS registry contract
    IENS public immutable ens;

    /// @notice ENS public resolver
    IPublicResolver public immutable resolver;

    /// @notice Agent ID => ENS node mapping
    mapping(uint256 => bytes32) public agentToENSNode;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when agent is registered with ENS
    event AgentENSRegistered(uint256 indexed agentId, bytes32 ensNode);

    /// @notice Emitted when decision is logged
    event DecisionLogged(uint256 indexed agentId, string decision);

    /// @notice Emitted when reputation is synced
    event ReputationSynced(uint256 indexed agentId, uint256 reputation);

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @param _ens ENS registry address
    /// @param _resolver ENS public resolver address
    constructor(
        address _ens,
        address _resolver
    ) Ownable(msg.sender) {
        ens = IENS(_ens);
        resolver = IPublicResolver(_resolver);
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Register agent with ENS name
    /// @param agentId Agent NFT ID
    /// @param ensName Full ENS name (e.g., "agent-42.deepmind.eth")
    function registerAgentENS(
        uint256 agentId,
        string memory ensName
    ) external onlyOwner {
        // Calculate ENS namehash (simplified)
        bytes32 node = _namehash(ensName);

        agentToENSNode[agentId] = node;

        // Set initial text records
        _setTextRecord(node, "agent.id", agentId.toString());
        _setTextRecord(node, "agent.erc8004", "true");
        _setTextRecord(node, "agent.reputation", "500");
        _setTextRecord(node, "agent.version", "1.0.0");

        emit AgentENSRegistered(agentId, node);
    }

    /// @notice Log agent decision to ENS text records
    /// @param agentId Agent NFT ID
    /// @param decision Human-readable decision summary
    /// @param reasoning AI's reasoning (for transparency)
    /// @param profitLoss P&L in USDC (can be negative)
    function logDecisionToENS(
        uint256 agentId,
        string memory decision,
        string memory reasoning,
        int256 profitLoss
    ) external onlyOwner {
        bytes32 node = agentToENSNode[agentId];
        require(node != bytes32(0), "Agent not registered");

        // Update decision records
        _setTextRecord(node, "agent.last_decision", decision);
        _setTextRecord(node, "agent.last_reasoning", reasoning);

        // Format P&L with sign
        string memory pnlString;
        if (profitLoss >= 0) {
            pnlString = string(
                abi.encodePacked("+", uint256(profitLoss).toString(), " USDC")
            );
        } else {
            pnlString = string(
                abi.encodePacked("-", uint256(-profitLoss).toString(), " USDC")
            );
        }
        _setTextRecord(node, "agent.last_pnl", pnlString);

        // Timestamp
        _setTextRecord(node, "agent.timestamp", block.timestamp.toString());

        emit DecisionLogged(agentId, decision);
    }

    /// @notice Sync reputation metrics from Sui to ENS
    /// @param agentId Agent NFT ID
    /// @param newReputation Reputation score (0-1000)
    /// @param totalTrades Total number of trades
    /// @param profitableTrades Number of profitable trades
    function syncReputationToENS(
        uint256 agentId,
        uint256 newReputation,
        uint256 totalTrades,
        uint256 profitableTrades
    ) external onlyOwner {
        bytes32 node = agentToENSNode[agentId];
        require(node != bytes32(0), "Agent not registered");

        // Update reputation
        _setTextRecord(
            node,
            "agent.reputation",
            string(abi.encodePacked(newReputation.toString(), "/1000"))
        );

        // Update trade stats
        _setTextRecord(node, "agent.total_trades", totalTrades.toString());
        _setTextRecord(
            node,
            "agent.profitable_trades",
            profitableTrades.toString()
        );

        // Calculate and set win rate
        if (totalTrades > 0) {
            uint256 winRate = (profitableTrades * 100) / totalTrades;
            _setTextRecord(
                node,
                "agent.win_rate",
                string(abi.encodePacked(winRate.toString(), "%"))
            );
        }

        emit ReputationSynced(agentId, newReputation);
    }

    /// @notice Batch update multiple text records (gas optimization)
    /// @param agentId Agent NFT ID
    /// @param keys Array of record keys
    /// @param values Array of record values
    function batchUpdateTextRecords(
        uint256 agentId,
        string[] memory keys,
        string[] memory values
    ) external onlyOwner {
        require(keys.length == values.length, "Length mismatch");

        bytes32 node = agentToENSNode[agentId];
        require(node != bytes32(0), "Agent not registered");

        for (uint256 i = 0; i < keys.length; i++) {
            _setTextRecord(node, keys[i], values[i]);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Internal helper to set text record
    /// @param node ENS node
    /// @param key Record key
    /// @param value Record value
    function _setTextRecord(
        bytes32 node,
        string memory key,
        string memory value
    ) internal {
        resolver.setText(node, key, value);
    }

    /// @notice Calculate ENS namehash
    /// @param name Full ENS name
    /// @return node The namehash
    function _namehash(string memory name) internal pure returns (bytes32 node) {
        // Simplified namehash for hackathon
        // In production, use proper ENS namehash algorithm
        node = keccak256(abi.encodePacked(name));
    }
}
