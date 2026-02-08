// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MockPublicResolver.sol";

contract DeployMockResolver is Script {
    function run() external returns (MockPublicResolver) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MockPublicResolver resolver = new MockPublicResolver();
        
        console.log("MockPublicResolver deployed at:", address(resolver));
        
        vm.stopBroadcast();
        
        return resolver;
    }
}
