import {
  createCommand as createCommander,
  Command,
} from '@commander-js/extra-typings'
import * as fs from 'fs'

let { version } = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8'))

export interface CommandConfig {
  name: string
  alias?: string
  description: string
}

const applyConfig = (command: Command, config: CommandConfig) =>
  command
    .name(config.name)
    .alias(config.alias ?? '')
    .description(config.description ?? '')
    .version(version)
    .configureHelp({
      sortSubcommands: true,
      sortOptions: true,
    })

export const createCommand = (config: CommandConfig) =>
  applyConfig(createCommander(), config)
