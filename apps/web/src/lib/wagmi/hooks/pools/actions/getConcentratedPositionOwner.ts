import { SUSHISWAP_V3_POSTIION_MANAGER, SushiSwapV3ChainId } from 'sushi/config'
import { readContracts } from 'wagmi/actions'
import { PublicWagmiConfig } from '../../../config/public'

export const getConcentratedPositionOwners = async ({
  tokenIds,
  config,
}: {
  tokenIds: { chainId: SushiSwapV3ChainId; tokenId: bigint }[]
  config: PublicWagmiConfig
}) => {
  return readContracts(config, {
    contracts: tokenIds.map(
      ({ tokenId, chainId }) =>
        ({
          chainId,
          address: SUSHISWAP_V3_POSTIION_MANAGER[chainId],
          abi: [
            {
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'tokenId',
                  type: 'uint256',
                },
              ],
              name: 'ownerOf',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ] as const,
          functionName: 'ownerOf',
          args: [tokenId ?? 0n],
        }) as const,
    ),
  })
}
