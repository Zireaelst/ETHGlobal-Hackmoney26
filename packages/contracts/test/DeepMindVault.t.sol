// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DeepMindVault.sol";

/// @title DeepMindVaultTest - Test suite for ERC-8004 implementation
contract DeepMindVaultTest is Test {
    DeepMindVault public vault;
    address public owner;
    address public user1;
    address public user2;
    address public executor;

    // Test constants
    string constant ENS_NAME = "agent-1.deepmind.eth";
    bytes32 constant STRATEGY_HASH = keccak256("balanced-strategy");
    bytes32 constant SUI_VAULT = bytes32(uint256(0x123));

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        executor = address(0x3);

        vault = new DeepMindVault();
        vault.setExecutor(executor);

        // Fund test accounts
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    /*//////////////////////////////////////////////////////////////
                              MINT TESTS
    //////////////////////////////////////////////////////////////*/

    function testMintAgent() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        // Verify NFT ownership
        assertEq(agentId, 1);
        assertEq(vault.ownerOf(agentId), owner);

        // Verify agent data
        DeepMindVault.Agent memory agent = vault.getAgent(agentId);
        assertEq(agent.agentId, 1);
        assertEq(agent.owner, owner);
        assertEq(agent.strategyHash, STRATEGY_HASH);
        assertEq(agent.suiVaultAddress, SUI_VAULT);
        assertEq(agent.reputation, 500); // Starting reputation
        assertEq(agent.totalTrades, 0);
        assertEq(agent.isPaused, false);
    }

    function testMintMultipleAgents() public {
        uint256 agent1 = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);
        uint256 agent2 = vault.mintAgent(
            "agent-2.deepmind.eth",
            keccak256("aggressive"),
            bytes32(uint256(0x456))
        );

        assertEq(agent1, 1);
        assertEq(agent2, 2);
    }

    function testMintAgentAsUser() public {
        vm.prank(user1);
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        assertEq(vault.ownerOf(agentId), user1);
    }

    /*//////////////////////////////////////////////////////////////
                          SESSION KEY TESTS
    //////////////////////////////////////////////////////////////*/

    function testDelegateSessionKey() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        address sessionKey = address(0x999);
        uint256 expiry = block.timestamp + 60 days;

        vm.expectEmit(true, true, false, true);
        emit DeepMindVault.SessionKeyDelegated(agentId, sessionKey, expiry);

        vault.delegateSessionKey(agentId, sessionKey, expiry);

        // Verify session key
        (address key, uint256 exp, bool active) = vault.sessionKeys(agentId);
        assertEq(key, sessionKey);
        assertEq(exp, expiry);
        assertTrue(active);
    }

    function testDelegateSessionKeyUnauthorized() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vm.prank(user1);
        vm.expectRevert("Not agent owner");
        vault.delegateSessionKey(agentId, address(0x999), block.timestamp + 1 days);
    }

    function testDelegateSessionKeyInvalidExpiry() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vm.expectRevert("Invalid expiry");
        vault.delegateSessionKey(agentId, address(0x999), block.timestamp - 1);
    }

    /*//////////////////////////////////////////////////////////////
                          STRATEGY TESTS
    //////////////////////////////////////////////////////////////*/

    function testUpdateStrategy() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        bytes32 newStrategy = keccak256("aggressive-strategy");

        vm.expectEmit(true, false, false, true);
        emit DeepMindVault.StrategyUpdated(agentId, STRATEGY_HASH, newStrategy);

        vault.updateStrategy(agentId, newStrategy);

        DeepMindVault.Agent memory agent = vault.getAgent(agentId);
        assertEq(agent.strategyHash, newStrategy);
    }

    function testUpdateStrategyUnauthorized() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vm.prank(user1);
        vm.expectRevert("Not agent owner");
        vault.updateStrategy(agentId, keccak256("new"));
    }

    /*//////////////////////////////////////////////////////////////
                          PAUSE/RESUME TESTS
    //////////////////////////////////////////////////////////////*/

    function testPauseAgent() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vault.pauseAgent(agentId);

        DeepMindVault.Agent memory agent = vault.getAgent(agentId);
        assertTrue(agent.isPaused);
    }

    function testResumeAgent() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vault.pauseAgent(agentId);
        vault.resumeAgent(agentId);

        DeepMindVault.Agent memory agent = vault.getAgent(agentId);
        assertFalse(agent.isPaused);
    }

    function testPauseUnauthorized() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vm.prank(user1);
        vm.expectRevert("Not agent owner");
        vault.pauseAgent(agentId);
    }

    /*//////////////////////////////////////////////////////////////
                        EXECUTE ACTION TESTS
    //////////////////////////////////////////////////////////////*/

    function testExecuteAction() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        address sessionKey = address(0x999);
        vault.delegateSessionKey(agentId, sessionKey, block.timestamp + 1 days);

        bytes memory action = abi.encode("rebalance", 100);

        vm.prank(sessionKey);
        bool success = vault.executeAction(agentId, action);

        assertTrue(success);
    }

    function testExecuteActionPaused() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        address sessionKey = address(0x999);
        vault.delegateSessionKey(agentId, sessionKey, block.timestamp + 1 days);
        vault.pauseAgent(agentId);

        vm.prank(sessionKey);
        vm.expectRevert("Agent paused");
        vault.executeAction(agentId, "");
    }

    function testExecuteActionNoSessionKey() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vm.prank(user1);
        vm.expectRevert("No active session key");
        vault.executeAction(agentId, "");
    }

    function testExecuteActionExpiredSessionKey() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        address sessionKey = address(0x999);
        vault.delegateSessionKey(agentId, sessionKey, block.timestamp + 1 days);

        // Warp past expiry
        vm.warp(block.timestamp + 2 days);

        vm.prank(sessionKey);
        vm.expectRevert("Session key expired");
        vault.executeAction(agentId, "");
    }

    /*//////////////////////////////////////////////////////////////
                        REPUTATION SYNC TESTS
    //////////////////////////////////////////////////////////////*/

    function testSyncReputationFromSui() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vm.prank(executor);
        vault.syncReputationFromSui(
            agentId,
            750, // new reputation
            100, // total trades
            75,  // profitable trades
            ""   // proof (simplified)
        );

        DeepMindVault.Agent memory agent = vault.getAgent(agentId);
        assertEq(agent.reputation, 750);
        assertEq(agent.totalTrades, 100);
        assertEq(agent.profitableTrades, 75);
    }

    function testSyncReputationUnauthorized() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        vm.prank(user1);
        vm.expectRevert("Only executor");
        vault.syncReputationFromSui(agentId, 750, 100, 75, "");
    }

    /*//////////////////////////////////////////////////////////////
                            ERC-8004 TESTS
    //////////////////////////////////////////////////////////////*/

    function testGetAgentState() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        IERC8004.AgentState memory state = vault.getAgentState(agentId);

        assertEq(state.configHash, STRATEGY_HASH);
        assertEq(state.reputation, 500);
        assertFalse(state.isPaused);
    }

    function testUpdateAgentState() public {
        uint256 agentId = vault.mintAgent(ENS_NAME, STRATEGY_HASH, SUI_VAULT);

        IERC8004.AgentState memory newState = IERC8004.AgentState({
            configHash: keccak256("new-config"),
            reputation: 800,
            lastActionTime: block.timestamp,
            isPaused: false
        });

        vm.prank(executor);
        vault.updateAgentState(agentId, newState);

        IERC8004.AgentState memory state = vault.getAgentState(agentId);
        assertEq(state.configHash, keccak256("new-config"));
        assertEq(state.reputation, 800);
    }
}
