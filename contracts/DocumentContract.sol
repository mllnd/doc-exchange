//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract DocumentContract {

  string public senderSignature;
  string public receiverSignature;
  address public ownerAddress;
  string public documentHash;

  constructor(string memory _senderSignature, string memory _documentHash) public {
    senderSignature = _senderSignature;
    // When the contract is created, the owner is always the sender.
    ownerAddress = msg.sender;
    documentHash = _documentHash;
  }

  function getSenderSignature() public view returns (string memory) {
    return senderSignature;
  }

  function getReceiverSignature() public view returns (string memory) {
    return receiverSignature;
  }

  function getOwnerAddress() public view returns (address) {
    return ownerAddress;
  }
}
