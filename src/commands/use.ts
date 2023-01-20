#! /usr/bin/env node

import { createCommand } from '../lib/command-helpers'
import { promptProjectAndFork } from '../lib/prompt'
import { writeConfig } from '../lib/config'

export const makeCommand = () => {
  const command = createCommand({
    name: 'use',
    description: 'Set the default fork for CLI commands.\nInteractively from list of existing forks OR create a new one.'
  })
    .action(async (opts, cmd) => {
      await writeConfig(async (prev) => {
        const selections = await promptProjectAndFork(cmd, {
          allowNewFork: true,
          initial: {
            slug: prev.project?.slug,
            fork: prev.project?.fork?.id,
          }
        })

        return {
          ...prev,
          project: {
            slug: selections.projectSlug,
            fork: selections.fork,
          },
        }
      })
    })
  return command
}
