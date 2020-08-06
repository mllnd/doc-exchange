'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Transfer extends Model {
  sender () {
    return this.hasOne('App/Models/User', 'sender_id', 'id')
  }

  recipient () {
    return this.hasOne('App/Models/User', 'recipient_id', 'id')
  }
}

module.exports = Transfer
