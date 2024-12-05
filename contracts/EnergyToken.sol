pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EnergyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("EnergyToken", "ETK") {
        _mint(msg.sender, initialSupply);
    }

    // Mint new tokens for generated energy
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // Burn tokens for consumed energy
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}