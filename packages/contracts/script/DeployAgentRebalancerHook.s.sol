// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/uniswap-v4/AgentRebalancerHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";

/// @title DeployAgentRebalancerHook - Deploy AgentRebalancerHook to Base Sepolia
/// @notice Deploys hook with correct address prefix for hook permissions  
contract DeployAgentRebalancerHook is Script {
    // Base Sepolia Uniswap v4 PoolManager (official deployment)
    address constant POOL_MANAGER = 0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408;
    
    // MockPublicResolver for ENS (our deployment)
    address constant ENS_RESOLVER = 0xD257737006c06C99709513A0491D585D5689316b;

    function run() external returns (AgentRebalancerHook hook) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying AgentRebalancerHook...");
        console.log("PoolManager:", POOL_MANAGER);
        console.log("ENS Resolver:", ENS_RESOLVER);
        console.log("Deployer:", deployer);
        
        // Hook permissions: only afterSwap is enabled
        uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // For demo, we deploy directly (production would use CREATE2 for deterministic address)
        hook = new AgentRebalancerHook(
            IPoolManager(POOL_MANAGER),
            ENS_RESOLVER
        );
        
        console.log("");
        console.log("========================================");
        console.log("AgentRebalancerHook deployed at:", address(hook));
        console.log("========================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Initialize a pool with this hook");
        console.log("2. Open an agent position");
        console.log("3. Execute a swap to trigger afterSwap");
        
        vm.stopBroadcast();
        
        return hook;
    }
}
