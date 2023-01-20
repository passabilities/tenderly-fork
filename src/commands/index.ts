#! /usr/bin/env node

import { createCommand } from '../lib/command-helpers'
import * as balance from './balance'
import * as info from './info'
import * as rm from './rm'
import * as update from './update'
import * as use from './use'

const program = createCommand({
  name: 'tendfork',
  description: 'Interact with Tenderly forks',
})

program
  .addCommand(balance.makeCommand())

program
  .addCommand(info.makeCommand())

program
  .addCommand(rm.makeCommand())

// program
//   .addCommand(token.makeCommand())

program
  .addCommand(update.makeCommand())

program
  .addCommand(use.makeCommand())

program.parse()
