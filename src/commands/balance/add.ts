#! /usr/bin/env node

import { ethers } from 'ethers'

import { createCommand } from '../../lib/command-helpers'
import { makeAddressOption, makeValueOption } from '../../lib/command-options'
import { getProject } from '../../lib/config'
import * as tenderlyProvider from '../../lib/tenderly-provider'
import { logBalance } from './get'

export const makeCommand = () => {
  const command = createCommand({
    name: 'add',
    description: 'Increase the balance of an account on the forked chain',
  })
    .addOption(makeAddressOption({ mandatory: true }))
    .addOption(makeValueOption({ mandatory: true }))
    .action(async (opts, cmd) => {
      const value = ethers.utils.hexValue(
        ethers.utils.parseUnits(opts.value, 'ether').toHexString(),
      )

      const project = await getProject(cmd)
      const provider = tenderlyProvider.create(project.fork.id)
      await provider.send('tenderly_addBalance', [ [ opts.addr ], value ])

      console.log(`Balance increased by ${opts.value} ETH`)
      console.log(`New balance:`)
      await logBalance(provider, opts.addr)
    })
  return command
}
