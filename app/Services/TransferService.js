'use strict'

const fs = require('fs')
const Drive = use('Drive')
const Helpers = use('Helpers')
const Web3 = use('Service/Web3')
const Encryption = use('Encryption')
const Transfer = use('App/Models/Transfer')
const MainAccount = use('Service/MainAccount')

/**
 * Resourceful controller for interacting with transfers
 */
class TransferService {

  /**
   * Store the transfer in database.
   * @param {number} sender
   * @param {number} recipient
   * @param {string} docName
   * @param {string} signature
   * @param {string} identifier
   * @param {string} documentHash
   * @param {string} documentMime
   * @returns {Promise<*>}
   */
  async storeTransfer(sender, recipient, docName, signature, identifier, documentHash, documentMime) {
    const transfer = new Transfer()
    transfer.sender_id = sender
    transfer.recipient_id = recipient
    transfer.document_name = docName
    transfer.document_hash = documentHash
    transfer.document_mime = documentMime
    transfer.transfer_identifier = identifier
    transfer.sender_signature = signature
    await transfer.save()

    return transfer
  }

  async storeDocument(document, identifier) {
    const fileContents = fs.readFileSync(document.tmpPath)

    // Encrypt the contents of the file and store it away.
    const encrypted = await Encryption.encrypt(fileContents)
    const docName = `${identifier}.${document.extname}.enc`

    await Drive.put(docName, Buffer.from(encrypted))
    // Remove the file from temporary storage.
    fs.unlinkSync(document.tmpPath)
  }

  async sendTransaction(transaction) {
    const gas = await transaction.estimateGas({ from: MainAccount.address })
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: gas
    }

    const signedTransaction = await Web3.eth.accounts.signTransaction(options, MainAccount.privateKey)

    return Web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
  }

  async deployContract(contractName, contractArgs) {
    const contractData = JSON.parse(fs.readFileSync(Helpers.appRoot(`build/contracts/${contractName}.json`)).toString())
    const contract = new Web3.eth.Contract(contractData.abi)
    const handle = await this.sendTransaction(contract.deploy({ data: contractData.bytecode, arguments: contractArgs }))

    console.log(`${contractName} contract deployed at address ${handle.contractAddress}`)

    return new Web3.eth.Contract(contractData.abi, handle.contractAddress)
  }

}

module.exports = TransferService
