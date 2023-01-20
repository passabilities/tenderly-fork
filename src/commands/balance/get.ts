#! /usr/bin/env node

import { ethers } from 'ethers'

import { createCommand } from '../../lib/command-helpers'
import { makeAddressOption } from '../../lib/command-options'
import { getProject } from '../../lib/config'
import * as tenderlyProvider from '../../lib/tenderly-provider'

export const logBalance = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string,
) => {
  const weiBalance = await provider.getBalance(address)
  const ethBalance = ethers.utils.formatEther(weiBalance)
  console.log(`  * ${ethBalance} ETH`)
  console.log(`  * ${weiBalance} wei`)
}

export const makeCommand = () => {
  const command = createCommand({
    name: 'get',
    description: 'Get the balance of an account on the forked chain',
  })
    .addOption(makeAddressOption({ mandatory: true }))
    .action(async (opts, cmd) => {
      const project = await getProject(cmd)
      const provider = tenderlyProvider.create(project.fork.id)

      console.log(`Balance:`)
      await logBalance(provider, opts.addr)
    })

  return command
}
