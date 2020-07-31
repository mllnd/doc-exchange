'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class RedirectIfNotAuthenticated {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Response} ctx.auth
   * @param {Function} next
   */
  async handle ({ response, auth }, next) {
    // call next to advance the request
    try {
      await auth.check()
    } catch (error) {
      return response.route('AuthController.login')
    }
    await next()
  }
}

module.exports = RedirectIfNotAuthenticated
