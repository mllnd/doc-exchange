'use strict'

const { Command } = require('@adonisjs/ace')
const Web3 = use('Service/Web3')
const Env = use('Env')
const Helpers = use('Helpers')

class Setup extends Command {
  static get signature () {
    return 'setup'
  }

  static get description () {
    return 'Setup the app by generating a main Ethereum account keystore file'
  }

  async handle (args, options) {
    if (await this.pathExists(Helpers.appRoot('keystore.json'), 'utf-8')) {
      this.warn(`${this.icon('warn')} Unable to setup! Main keystore file already exists.`)
      return
    }
    const account = Web3.eth.accounts.create()
    const keystore = Web3.eth.accounts.encrypt(account.privateKey, Env.get('APP_KEY'))
    await this.writeFile(Helpers.appRoot('keystore.json'), JSON.stringify(keystore, null, 2))
    this.success(`${this.icon('success')} Keystore file created! The passphrase is currently APP_KEY.`)
  }
}

module.exports = Setup
