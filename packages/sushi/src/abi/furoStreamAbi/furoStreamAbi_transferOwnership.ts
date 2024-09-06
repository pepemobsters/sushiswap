export const furoStreamAbi_transferOwnership = [
  {
    inputs: [
      { internalType: 'address', name: 'newOwner', type: 'address' },
      { internalType: 'bool', name: 'direct', type: 'bool' },
      { internalType: 'bool', name: 'renounce', type: 'bool' },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
