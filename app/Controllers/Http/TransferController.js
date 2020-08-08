'use strict'

const User = use('App/Models/User')
const Transfer = use('App/Models/Transfer')

/** @type {import('@adonisjs/framework/src/Encryption')} */
const Helpers = use('Helpers')
const Drive = use('Drive')
/** @type {import('web3')} */
const Web3 = use('Service/Web3')
const Encryption = use('Encryption')
const MainAccount = use('Service/MainAccount')
const TransferService = new (require('../../Services/TransferService'))()

const sha256File = require('sha256-file');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { RandomToken } = require('@sibevin/random-token')

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
  async index({ request, response, view, auth }) {
    const initiatedTransfers = await Transfer.query().where('sender_id', auth.user.id).with('recipient').fetch()
    const receivedTransfers = await Transfer.query().where('recipient_id', auth.user.id).with('sender').fetch()

    return view.render('transfer.index', {
      initiated: initiatedTransfers.toJSON(),
      received: receivedTransfers.toJSON()
    })
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
  async create({ request, response, view }) {
    const users = await User.all()
    return view.render('transfer.create', { users: users.toJSON() })
  }

  /**
   * Create/save a new transfer.
   * POST transfers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth, session }) {
    const recipient = await User.find(request.input('recipient'))
    const document = request.file('document')
    const identifier = RandomToken.gen({ length: 9, casing: 'lower' })
    const documentHash = sha256File(document.tmpPath)
    const documentName = `${identifier}.${document.extname}`
    const signature = (await auth.user.account()).sign(documentHash).signature

    // Save the DB entry for the transfer.
    const transfer = await TransferService.storeTransfer(
      auth.user.id, recipient.id, documentName, signature,
      identifier, documentHash, document.headers['content-type']
    )

    // Save the document associated with the transfer.
    await TransferService.storeDocument(document, identifier)

    // Deploy a smart contract.
    const contract = await TransferService.deployContract('TransferContract', [signature, documentHash])
    console.log(contract.options.address)

    // Attach the created contract.
    transfer.contract_address = contract.options.address
    await transfer.save()

    session.flash({ success_message: 'Transfer successfully initiated! The recipient should accept it to view details.' })
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
  async show({ params, request, response, view }) {
    const transfer = await Transfer.findByOrFail('id', params.id)
    await transfer.loadMany(['recipient', 'sender'])
    return view.render('transfer.show', { transfer: transfer.toJSON() })
  }

  /**
   * Get a single transfer file.
   * GET transfers/:id/file
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async file({ params, request, response, view }) {
    // TODO: implement permission check!
    const transfer = await Transfer.findByOrFail('id', params.id)

    const file = await Drive.get(`${transfer.document_name}.enc`)
    const decrypted = await Encryption.decrypt(file.toString('utf-8'))

    response.header('Content-Disposition', `attachment; filename="${transfer.document_name}"`)
    response.header('Content-Type', transfer.document_mime)

    return response.send(Buffer.from(decrypted))
  }

  /**
   * Accept a transfer.
   * GET transfers/:id/accept
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async accept({ params, request, response, view, auth }) {
    // TODO: implement permission check!
    const transfer = await Transfer.findByOrFail('id', params.id)
    const signature = (await auth.user.account()).sign(transfer.document_hash).signature

    transfer.receiver_signature = signature

    await transfer.save()

    // TODO: smart contract -> store signature
    return response.route(`/transfers/${transfer.id}`)
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
  async edit({ params, request, response, view }) {}

  /**
   * Update transfer details.
   * PUT or PATCH transfers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a transfer with id.
   * DELETE transfers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = TransferController
