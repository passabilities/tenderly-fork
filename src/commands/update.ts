#! /usr/bin/env node

import * as config from 'config'
import * as prompts from 'prompts'

import { createCommand } from '../lib/command-helpers'
import { promptProjectAndFork } from '../lib/prompt'
import * as tenderlyAxios from '../lib/tenderly-axios'
import { writeConfig } from '../lib/config'

export const makeCommand = () => {
  const command = createCommand({
    name: 'update',
    alias: 'up',
    description: 'Update an existing fork on a Tenderly project',
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

        const updateOptions = await prompts({
          type: 'multiselect',
          message: 'Select options to update',
          name: 'options',
          choices: [
            {
              title: 'Name',
              value: {
                type: 'text',
                message: 'New Name',
                name: 'name',
                initial: fork.name,
              }
            },
            {
              title: 'Description',
              value: {
                type: 'text',
                message: 'New Description',
                name: 'description',
                initial: fork.description,
              }
            },
            {
              title: 'Head Simulation ID',
              value: {
                type: 'text',
                message: 'New Head Simulation ID',
                name: 'head_simulation_id',
                initial: fork.head_simulation_id,
              }
            },
          ],
        })

        if (updateOptions.options.length) {
          // @ts-ignore
          const body = await prompts(updateOptions.options)
          const updatedValues = Object.values(body)
          const isMissingValues = updatedValues.length === 0 || updatedValues.some((value) => !value)
          if (isMissingValues) cmd.error('Must provide a value for all selected options')

          await tenderlyAxios.updateFork(projectSlug, fork.id, body)
          console.log(`Fork "${fork.name}" updated`)

          // If the deleted fork was the default fork, remove it from the config
          if (initial?.fork === fork.id)
            await writeConfig(({ project, ...prev }) => prev)
        } else {
          cmd.error('No options selected')
        }
      })
  return command
}
