/**
 * DeepMindVault Contract ABI and Address
 * Auto-generated from Foundry build
 */

export const DEEPMIND_VAULT_ADDRESS = '0xbAD7056563F0b00C29c08FF06CA22aE94cC5fa1c' as const;

export const DEEPMIND_VAULT_ABI = [
    // Read Functions
    {
        type: 'function',
        name: 'agents',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'owner', type: 'address' },
            { name: 'ensNode', type: 'bytes32' },
            { name: 'strategyHash', type: 'bytes32' },
            { name: 'suiVaultAddress', type: 'bytes32' },
            { name: 'reputation', type: 'uint256' },
            { name: 'totalTrades', type: 'uint256' },
            { name: 'profitableTrades', type: 'uint256' },
            { name: 'lastSyncTimestamp', type: 'uint256' },
            { name: 'isPaused', type: 'bool' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'sessionKeys',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [
            { name: 'keyAddress', type: 'address' },
            { name: 'expiry', type: 'uint256' },
            { name: 'isActive', type: 'bool' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'ownerOf',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
    },
    // Write Functions
    {
        type: 'function',
        name: 'mintAgent',
        inputs: [
            { name: 'ensName', type: 'string' },
            { name: 'strategyHash', type: 'bytes32' },
            { name: 'suiVaultAddress', type: 'bytes32' },
        ],
        outputs: [{ name: 'agentId', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'delegateSessionKey',
        inputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'sessionKey', type: 'address' },
            { name: 'expiry', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'pauseAgent',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'resumeAgent',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'updateStrategy',
        inputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'newStrategy', type: 'bytes32' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    // Events
    {
        type: 'event',
        name: 'AgentMinted',
        inputs: [
            { name: 'agentId', type: 'uint256', indexed: true },
            { name: 'owner', type: 'address', indexed: true },
            { name: 'ensNode', type: 'bytes32', indexed: false },
            { name: 'suiVault', type: 'bytes32', indexed: false },
        ],
    },
    {
        type: 'event',
        name: 'SessionKeyDelegated',
        inputs: [
            { name: 'agentId', type: 'uint256', indexed: true },
            { name: 'sessionKey', type: 'address', indexed: true },
            { name: 'expiry', type: 'uint256', indexed: false },
        ],
    },
    {
        type: 'event',
        name: 'StrategyUpdated',
        inputs: [
            { name: 'agentId', type: 'uint256', indexed: true },
            { name: 'oldStrategy', type: 'bytes32', indexed: false },
            { name: 'newStrategy', type: 'bytes32', indexed: false },
        ],
    },
] as const;
