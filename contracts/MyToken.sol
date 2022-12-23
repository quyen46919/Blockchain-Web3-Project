// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ECO Market Token", "ECOMK") {
        _mint(msg.sender, initialSupply);
    }

    function burn(address _accountAddress, uint256 _amount) public virtual {
        _burn(_accountAddress, _amount);
    }
}