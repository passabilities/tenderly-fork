import { Command } from '@commander-js/extra-typings'
import * as config from 'config'
import * as fs from 'fs'
import { promptProjectAndFork } from './prompt'
import { IFork } from './tenderly-axios'

const filePath = `${process.cwd()}/config/default.json`

interface IConfig {
  project?: IProject
}

interface IProject {
  slug: string
  fork: IFork
}

export const writeConfig = async <C = IConfig>(cb: (prev: C) => C | Promise<C>) => {
  const newConfig = await cb(config.util.toObject())
  fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2))
}

export const getProject = async (cmd: Command, interactive = false): Promise<IProject> => {
  if (interactive || !config.has('project')) {
    const selections = await promptProjectAndFork(cmd, {
      allowNewFork: true,
    })
    return {
      slug: selections.projectSlug,
      fork: selections.fork,
    }
  } else {
    return config.get<IProject>('project')
  }
}
