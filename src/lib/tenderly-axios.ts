import Axios from 'axios'
import * as  fs from 'fs'
import * as  os from 'os'
import * as  path from 'path'
import * as YAML from 'yaml'

const tenderlyConfig = YAML.parse(fs.readFileSync(path.join(os.homedir(), '.tenderly', 'config.yaml'), 'utf8'))

const axios =
  Axios.create({
    baseURL: 'https://api.tenderly.co/api',
    headers: {
      'X-Access-Key': tenderlyConfig.access_key ?? '',
      'Content-Type': 'application/json',
    },
  })
const v1 = () => Axios.create({
  ...axios.defaults,
  baseURL: `${axios.defaults.baseURL}/v1`,
})
const v2 = (slug: string) => Axios.create({
  ...axios.defaults,
  baseURL: `${axios.defaults.baseURL}/v2/project/${slug}/forks`,
})

interface IProject {
  name: string
  slug: string
}
export const getProjects = (): Promise<IProject[]> =>
  v1().get('/account/me/projects')
    .then(({ data }) => data.projects)

export interface IFork {
  id: string
  name: string
  description: string
  network_id: string
  details: {
    chain_config: {
      chain_id: string
    }
  }
  accounts: Record<string, string>
  head_simulation_id: string
  json_rpc_url: string
  config: {
    base_fee: string
  }
}

interface ICreateForkBody {
  name: string
  description: string
  network_id: string
  block_number?: string
  details?: {
    chain_config: {
      chain_id: string
    }
  }
  transaction_index?: string
}
export const createFork = (slug: string, body: ICreateForkBody): Promise<IFork> =>
  v2(slug).post<{ fork: IFork }>('', body)
    .then(({ data }) => data.fork)

export const deleteFork = (slug: string, forkId: string): Promise<void> =>
  v2(slug).delete(`/${forkId}`)

interface IUpdateForkBody {
  name?: string
  description?: string
  head_simulation_id?: string
}

export const updateFork = (slug: string, forkId: string, body: IUpdateForkBody): Promise<void> =>
  v2(slug).patch(`/${forkId}`, body)

export const getFork = (slug: string, forkId: string): Promise<IFork | void> =>
  v2(slug).get(`/${forkId}`)
    .then(({ data }) => data.fork)

export const getForks = (slug: string): Promise<IFork[]> =>
  v2(slug).get<IFork[] | undefined>('')
    .then(({ data }) => data ?? [])
