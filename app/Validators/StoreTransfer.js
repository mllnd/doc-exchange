'use strict'

class StoreTransfer {
  get rules () {
    return {
      document: 'required|file',
      recipient: 'required'
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'document.required': 'Please select a document',
      'recipient.required': 'Please select a recipient'
    }
  }
}

module.exports = StoreTransfer
