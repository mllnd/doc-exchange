'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {import('@adonisjs/framework/src/Encryption')} */
const Encryption = use('Encryption')

/** @type {import('web3')} */
const Web3 = use('Service/Web3')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }

      if (userInstance.dirty.key) {
        userInstance.key = await Encryption.encrypt(userInstance.key)
      }
    })
  }

  static get computed () {
    return ['nickname']
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  getNickname ({ fname, lname }) {
    return `${fname} ${lname.charAt(0)}.`
  }

  async account () {
    const privateKey = await Encryption.decrypt(this.key)

    return Web3.eth.accounts.privateKeyToAccount(privateKey)
  }

  async balance () {
    const balance = await Web3.eth.getBalance(this.address)

    return Web3.utils.fromWei(balance)
  }
}

module.exports = User
