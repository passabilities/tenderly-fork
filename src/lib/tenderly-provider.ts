import { InvalidOptionArgumentError } from '@commander-js/extra-typings'
import { ethers } from 'ethers'

export const create = (forkId?: string) => {
  if (!forkId) throw new InvalidOptionArgumentError('Must provide a fork ID')
  return new ethers.providers.JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`)
}
