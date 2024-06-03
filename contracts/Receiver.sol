// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Receiver {
    struct ReceiverData {
        string name;
        string email;
        address addr;
    }

    mapping(address => ReceiverData) public receivers;
    mapping(address => bool) private  receivertExists;

    event IReceiverRegistered(string name, string email, address addr);

    function register(string memory _name, string memory _email) public {
        require(!isReceiverExist(msg.sender), "Institution already exists");
        receivers[msg.sender] = ReceiverData(_name, _email, msg.sender);
        receivertExists[msg.sender] = true;
        emit IReceiverRegistered(_name, _email, msg.sender);
    }
    
    function isReceiverExist(address _addr) public view returns (bool) {
        return receivertExists[_addr];
    }

}