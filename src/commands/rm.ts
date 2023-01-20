#! /usr/bin/env node

import * as config from 'config'

import { createCommand } from '../lib/command-helpers'
import { promptProjectAndFork } from '../lib/prompt'
import * as tenderlyAxios from '../lib/tenderly-axios'
import { writeConfig } from '../lib/config'

export const makeCommand = () => {
  const command = createCommand({
    name: 'rm',
    description: 'Delete an existing fork on a Tenderly project',
  })
    .action(
      async (opts, cmd) => {
        let initial: { slug: string; fork: string } | undefined
        if (config.has('project')) {
          initial = {
            slug: config.get('project.slug'),
            fork: config.get('project.fork.id'),
          }
        }
        const { projectSlug, fork } = await promptProjectAndFork(cmd, { initial })

        await tenderlyAxios.deleteFork(projectSlug, fork.id)
        console.log(`Fork "${fork.name}" deleted`)

        // If the deleted fork was the default fork, remove it from the config
        if (initial?.fork === fork.id)
          await writeConfig(({ project, ...prev }) => prev)
      })
  return command
}
