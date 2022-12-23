// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable{
    struct KYCUser {
        address _address;
        string _fullName;
        string _phoneNumber;
        string _email;
    }
    mapping(address => KYCUser) allowedUsers;

    event createKYCUser(
        address _userAddress,
        string _fullName,
        string _phoneNumber,
        string _email
    );

    function setKycCompleted(address accountAddr, string memory fullName, string memory phoneNumber, string memory email) 
        public 
    {
        KYCUser memory newUser = KYCUser(accountAddr, fullName, phoneNumber, email);
        allowedUsers[accountAddr] = newUser;

        emit createKYCUser(accountAddr, fullName, phoneNumber, email );
    }

    function setKycRevoked(address _addr) public {
        delete allowedUsers[_addr];
    }

    function kycCompleted(address _addr) public view returns(bool){
        return allowedUsers[_addr]._address != address(0);
    }

    function getKycUserInfor(address _addr) public view returns(KYCUser memory){
        return allowedUsers[_addr];
    }
}