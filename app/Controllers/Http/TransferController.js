'use strict'

const User = use('App/Models/User')

/** @type {import('@adonisjs/framework/src/Encryption')} */
const Encryption = use('Encryption')
const Drive = use('Drive')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with transfers
 */
class TransferController {
  /**
   * Show a list of all transfers.
   * GET transfers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return view.render('transfer.index')
  }

  /**
   * Render a form to be used for creating a new transfer.
   * GET transfers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    const users = await User.all()
    return view.render('transfer.create', {users: users.toJSON()})
  }

  /**
   * Create/save a new transfer.
   * POST transfers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
     const recipient = request.input('recipient')
     const document = request.file('document')
     const fileContents = require('fs').readFileSync(document.tmpPath).toString()
     // TODO: create the transfer object.
     // Encrypt the contents of the file and store it away.
     const encrypted = await Encryption.encrypt(fileContents)
     await Drive.put(`random.${document.extname}.enc`, Buffer.from(encrypted))
     // Remove the file from temporary storage.
     require('fs').unlinkSync(document.tmpPath)
     return response.redirect('/transfers/create')
  }

  /**
   * Display a single transfer.
   * GET transfers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing transfer.
   * GET transfers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update transfer details.
   * PUT or PATCH transfers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a transfer with id.
   * DELETE transfers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = TransferController
