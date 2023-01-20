#! /usr/bin/env node

import { createCommand } from '../lib/command-helpers'
import { getProject } from '../lib/config'

export const makeCommand = () => {
  const command = createCommand({
    name: 'info',
    alias: 'i',
    description: 'Show information about a fork',
  })
    .option('-s, --select', 'Interactively select a fork to show information about')
    .action(
      async (opts, cmd) => {
        const project = await getProject(cmd, opts.select)
        console.log(JSON.stringify(project, null, 2))
      })

  return command
}
