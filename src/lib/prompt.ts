import { Command } from '@commander-js/extra-typings'
import { Choice } from 'prompts'
import * as prompts from 'prompts'
import * as tenderlyAxios from './tenderly-axios'
import { IFork } from './tenderly-axios'

export const promptProject = async (cmd: Command, initialValue?: any) => {
  const projects = await tenderlyAxios.getProjects()
  let initialIndex = 0
  const choices = projects.map((project, index) => {
    if (initialValue === project.slug) initialIndex = index
    return {
      title: project.name,
      value: project.slug,
    }
  })
  const { slug }: { slug: string } = await prompts({
    type: 'select',
    name: 'slug',
    message: 'Select a project',
    initial: initialIndex,
    choices,
  })
  if (slug == null) cmd.error('No project selected')
  return slug
}

export const promptFork = async (cmd: Command, slug: string, allowNew = false, initialValue?: any) => {
  const forks = await tenderlyAxios.getForks(slug)
  let initialIndex = 0
  const choices: Choice[] = forks.map((fork, index) => {
    if (initialValue === fork.id) initialIndex = index
    return {
      title: fork.name,
      value: fork,
    }
  })
  if (allowNew) {
    choices.push({
      title: 'Create a new fork',
      value: 'new',
    })
  }

  const { fork: forkChoice }: { fork: 'new' | IFork } = await prompts({
    type: 'select',
    name: 'fork',
    message: 'Select a fork',
    initial: initialIndex,
    choices,
  })
  if (forkChoice == null) cmd.error('No fork selected')
  let fork: IFork
  if (forkChoice === 'new') {
    const config = await prompts([
      {
        type: 'text',
        message: 'Name',
        name: 'name',
      },
      {
        type: 'text',
        message: 'Description',
        name: 'description',
        initial: 'Created with tendfork CLI',
      },
      {
        type: 'text',
        message: 'Network ID',
        name: 'network_id',
        initial: 1,
        format: (value) => parseInt(value),
      },
      {
        type: 'text',
        message: 'Chain ID',
        name: 'chain_id',
        initial: 1,
        format: (value) => parseInt(value),
      },
    ])
    if (!config.name) cmd.error('Must provide a name for the fork!')
    fork = await tenderlyAxios.createFork(slug, {
      name: config.name,
      description: config.description,
      network_id: config.network_id,
      details: {
        chain_config: {
          chain_id: config.chain_id,
        }
      }
    })
  } else {
    fork = forkChoice
  }
  return fork
}

interface IPromptProjectAndForkConfig {
  allowNewFork?: boolean
  initial?: {
    slug?: string
    fork?: string
  }
}

export const promptProjectAndFork = async (cmd: Command, config?: IPromptProjectAndForkConfig): Promise<{ projectSlug: string, fork: IFork }> => {
  const projectSlug = await promptProject(cmd, config?.initial?.slug)
  const fork = await promptFork(cmd, projectSlug, config?.allowNewFork, config?.initial?.fork)
  return { projectSlug, fork }
}
