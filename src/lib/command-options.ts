import { InvalidOptionArgumentError, Option } from '@commander-js/extra-typings'
import * as appConfig from 'config'
import { ethers } from 'ethers'
import { IFork } from './tenderly-axios'

interface IMakeOptionConfig {
  mandatory?: true
}

export const makeInteractiveOption = (config?: IMakeOptionConfig) => {
  const option =
    new Option('-i, --interactive', 'Fetch list of forks from Tenderly and prompt for selection')

  if (appConfig.has('project') && appConfig.has('fork')) {
    const fork = appConfig.get<IFork>('fork')
    option.default(false, `"false" - default network: [${fork.name}] "${fork.id}"`)
  } else {
    option.default(true, `"true" - default fork not set in config`)
  }

  return option
}

export const makeAddressOption = (config?: IMakeOptionConfig) => {
  const option =
    new Option('--addr <address>', 'The address of the account to interact with')
      .argParser((arg) => {
        try {
          const address = ethers.utils.getAddress(arg)
          return address
        } catch {
          throw new InvalidOptionArgumentError('Address must be a valid Ethereum address prefixed with 0x followed by 40 hexadecimal characters.')
        }
      })
      .makeOptionMandatory(config?.mandatory)

  return option
}

export const makeValueOption = (config?: IMakeOptionConfig) => {
  const option =
    new Option('--value <value>')
      .makeOptionMandatory(config?.mandatory)
  return option
}
