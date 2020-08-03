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
      table.string('transaction').nullable()
      table.string('document_name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('transfers')
  }
}

module.exports = TransfersSchema
