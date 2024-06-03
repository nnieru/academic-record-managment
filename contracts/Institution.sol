// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Institution {
    struct InstitutionData {
        string name;
        string email;
        address addr;
    }

    mapping(address => InstitutionData) public institutions;
    mapping(address => bool) private institutionExists;

    event InstitutionRegistered(string name, string email, address addr);

    function register(string memory _name, string memory _email) public {
        require(!isInstitutionExists(msg.sender), "Institution already exists");
        institutions[msg.sender] = InstitutionData(_name, _email, msg.sender);
        institutionExists[msg.sender] = true;
        emit InstitutionRegistered(_name, _email, msg.sender);
    }
    
    function isInstitutionExists(address _addr) public view returns (bool) {
        return institutionExists[_addr];
    }

}