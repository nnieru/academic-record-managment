// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract AcademicRecord {
 
 struct Record {
    address issuerAddress;
    string txHash;
 }

    mapping(string => Record) public records;
    mapping(string => bool) private recordExists;

    event RecordIssued(address indexed _issuerAddress, string _txHash);

    function AddRecord(string memory _txHash) public {
        require(!isRecordTxHashExist(_txHash), "Record Already exist");
        records[_txHash] = Record(msg.sender, _txHash);
        recordExists[_txHash] = true;
        emit RecordIssued(msg.sender, _txHash);
        
    }

    function isRecordTxHashExist(string memory _addr) public view returns (bool) {
        return recordExists[_addr];
    }
}