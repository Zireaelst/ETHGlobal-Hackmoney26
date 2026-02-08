// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ENSTextRecordManager.sol";

contract DeployENSWithMockResolver is Script {
    // MockPublicResolver deployed address
    address constant MOCK_RESOLVER = 0xD257737006c06C99709513A0491D585D5689316b;
    // Using same address as mock ENS registry (doesn't matter for our use case)
    address constant MOCK_ENS = 0xD257737006c06C99709513A0491D585D5689316b;

    function run() external returns (ENSTextRecordManager) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        ENSTextRecordManager manager = new ENSTextRecordManager(
            MOCK_ENS,
            MOCK_RESOLVER
        );
        
        console.log("ENSTextRecordManager (with MockResolver) deployed at:", address(manager));
        console.log("Using MockPublicResolver at:", MOCK_RESOLVER);
        
        vm.stopBroadcast();
        
        return manager;
    }
}
