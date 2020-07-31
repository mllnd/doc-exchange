'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class Web3Provider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Service/Web3', () => {
      const Env = this.app.use('Adonis/Src/Env')
      return new (require('web3'))(new (require('web3')).providers.HttpProvider(Env.get('INFURA_URL')))
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

module.exports = Web3Provider
