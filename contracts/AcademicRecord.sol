// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract AcademicRecord {
 
 struct Record {
    address issuerAddress;
    bytes32 txHash;
 }

    mapping(bytes32 => Record) public records;
    mapping(bytes32 => bool) private recordExists;

    event RecordIssued(address indexed _issuerAddress, bytes32 _txHash);

    function AddRecord(bytes32  _txHash) public {
        require(!recordExists[_txHash], "Record Already exist");
        records[_txHash] = Record(msg.sender, _txHash);
        recordExists[_txHash] = true;
        emit RecordIssued(msg.sender, _txHash);
        
    }

    function isRecordTxHashExist(bytes32  _addr) public view returns (bool) {
        return recordExists[_addr];
    }
}