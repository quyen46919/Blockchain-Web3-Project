// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYCUser {
    address _account;
    string _fullName;
    string _phoneNumber;
    string _email;

    constructor(
        address accountAddr, 
        string memory fullName, 
        string memory phoneNumber, 
        string memory email
    ) {
        _account = accountAddr;
        _fullName = fullName;
        _phoneNumber = phoneNumber;
        _email = email;
    }

    fallback() external {}
}