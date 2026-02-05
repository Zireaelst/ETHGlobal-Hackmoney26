// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/DeepMindVault.sol";
import "../src/ENSTextRecordManager.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== DeepMind Vaults Deployment ===");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance);
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy DeepMindVault
        console.log("1. Deploying DeepMindVault...");
        DeepMindVault vault = new DeepMindVault();
        console.log("   DeepMindVault:", address(vault));
        
        // 2. Deploy ENS Manager
        console.log("2. Deploying ENSTextRecordManager...");
        // Use mock addresses for testnet (real ENS addresses for mainnet)
        address ensRegistry = address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e); // ENS Registry
        address ensResolver = address(0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41); // Public Resolver
        
        ENSTextRecordManager ensManager = new ENSTextRecordManager(
            ensRegistry,
            ensResolver
        );
        console.log("   ENSTextRecordManager:", address(ensManager));
        
        // 3. Setup permissions
        console.log("3. Setting up permissions...");
        vault.setExecutor(deployer);
        console.log("   Executor set to deployer");
        
        vm.stopBroadcast();
        
        // Save deployment addresses
        console.log("");
        console.log("=== Deployment Complete ===");
        console.log("");
        console.log("Add to .env:");
        console.log(string.concat("DEEPMIND_VAULT_ADDRESS=", vm.toString(address(vault))));
        console.log(string.concat("ENS_MANAGER_ADDRESS=", vm.toString(address(ensManager))));
        console.log("");
        console.log("Next steps:");
        console.log("1. Verify contracts on Etherscan");
        console.log("2. Update frontend .env with addresses");
        console.log("3. Deploy Sui contracts");
    }
}
