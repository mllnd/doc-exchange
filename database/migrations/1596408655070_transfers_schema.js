'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransfersSchema extends Schema {
  up () {
    this.create('transfers', (table) => {
      table.increments()
      table.string('transfer_identifier').notNullable()
      table.integer('sender_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('recipient_id').unsigned().references('id').inTable('users')
      table.string('contract_address', 42).nullable()
      table.string('document_name').notNullable()
      table.string('document_mime').notNullable()
      table.string('document_hash', 64).notNullable()
      table.string('sender_signature', 132).notNullable()
      table.string('receiver_signature', 132).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('transfers')
  }
}

module.exports = TransfersSchema
