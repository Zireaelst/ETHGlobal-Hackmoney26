// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MockPublicResolver - Mock ENS resolver for hackathon demo
/// @author MoltQore Team
/// @notice Simple key-value store that mimics ENS text records
/// @dev Allows any address to set text records for any node (for demo purposes)
contract MockPublicResolver {
    /*//////////////////////////////////////////////////////////////
                                 STATE
    //////////////////////////////////////////////////////////////*/

    /// @notice node => key => value
    mapping(bytes32 => mapping(string => string)) public textRecords;

    /// @notice node => registered
    mapping(bytes32 => bool) public registered;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event TextChanged(bytes32 indexed node, string indexed key, string value);
    event NodeRegistered(bytes32 indexed node);

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Set a text record for a node
    /// @param node ENS node (namehash)
    /// @param key Record key
    /// @param value Record value
    function setText(
        bytes32 node,
        string calldata key,
        string calldata value
    ) external {
        textRecords[node][key] = value;
        
        if (!registered[node]) {
            registered[node] = true;
            emit NodeRegistered(node);
        }
        
        emit TextChanged(node, key, value);
    }

    /// @notice Get a text record for a node
    /// @param node ENS node (namehash)
    /// @param key Record key
    /// @return The text record value
    function text(bytes32 node, string calldata key) external view returns (string memory) {
        return textRecords[node][key];
    }

    /// @notice Check if a node is registered
    /// @param node ENS node
    /// @return True if registered
    function isRegistered(bytes32 node) external view returns (bool) {
        return registered[node];
    }

    /// @notice Batch set multiple text records
    /// @param node ENS node
    /// @param keys Array of keys
    /// @param values Array of values
    function setTexts(
        bytes32 node,
        string[] calldata keys,
        string[] calldata values
    ) external {
        require(keys.length == values.length, "Length mismatch");
        
        for (uint256 i = 0; i < keys.length; i++) {
            textRecords[node][keys[i]] = values[i];
            emit TextChanged(node, keys[i], values[i]);
        }
        
        if (!registered[node]) {
            registered[node] = true;
            emit NodeRegistered(node);
        }
    }
}
