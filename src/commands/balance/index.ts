#! /usr/bin/env node

import { createCommand } from '../../lib/command-helpers'

import * as add from './add'
import * as get from './get'

export const makeCommand = () => {
  const balanceCmd = createCommand({
    name: 'balance',
    alias: 'bal',
    description: 'Get or add to a Tenderly fork balance',
  })

  const getCommand = get.makeCommand()

  balanceCmd
    .addCommand(getCommand, { isDefault: true })

  balanceCmd
    .addCommand(add.makeCommand())

  return balanceCmd
}
