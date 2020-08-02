'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const Helpers = use('Helpers')

class MainAccountProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Service/MainAccount', () => {
      const Web3 = this.app.use('Service/Web3')
      const Env = this.app.use('Adonis/Src/Env')
      const keyStore = require('fs').readFileSync(Helpers.appRoot('keystore.json')).toString()
      return Web3.eth.accounts.decrypt(keyStore, Env.get('APP_KEY'))
    })
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    //
  }
}

module.exports = MainAccountProvider
