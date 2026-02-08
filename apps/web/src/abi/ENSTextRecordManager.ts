/**
 * ENSTextRecordManager Contract ABI and Address
 */

export const ENS_TEXT_RECORD_MANAGER_ADDRESS = '0x10E15C7a3Bce8211c5EBbAdB2f478e1Fe0240b1c' as const;

export const ENS_TEXT_RECORD_MANAGER_ABI = [
    // Read Functions
    {
        type: 'function',
        name: 'getAgentENSNode',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [{ name: '', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'agentVault',
        inputs: [],
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'ensResolver',
        inputs: [],
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
    },
    // Write Functions
    {
        type: 'function',
        name: 'registerAgentENS',
        inputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'ensName', type: 'string' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'logDecisionToENS',
        inputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'action', type: 'string' },
            { name: 'reasoning', type: 'string' },
            { name: 'profitLoss', type: 'int256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'syncReputationToENS',
        inputs: [
            { name: 'agentId', type: 'uint256' },
            { name: 'reputation', type: 'uint256' },
            { name: 'totalTrades', type: 'uint256' },
            { name: 'profitableTrades', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    // Events
    {
        type: 'event',
        name: 'DecisionLogged',
        inputs: [
            { name: 'agentId', type: 'uint256', indexed: true },
            { name: 'decision', type: 'string', indexed: false },
            { name: 'profitLoss', type: 'int256', indexed: false },
        ],
    },
    {
        type: 'event',
        name: 'ReputationSynced',
        inputs: [
            { name: 'agentId', type: 'uint256', indexed: true },
            { name: 'reputation', type: 'uint256', indexed: false },
        ],
    },
] as const;
