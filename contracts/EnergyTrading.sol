pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./EnergyToken.sol";

contract EnergyTrading {
    struct Bid {
        address owner;
        uint256 price; // Price per kWh
        uint256 amount; // Amount in kWh
        bool active; // Active status
    }

    struct Ask {
        address owner;
        uint256 price; // Price per kWh
        uint256 amount; // Amount in kWh
        bool active; // Active status
    }

    Bid[] public bids;
    Ask[] public asks;

    EnergyToken public energyToken;  // Instance of EnergyToken

    // Constructor to set the EnergyToken contract address
    constructor(address _energyTokenAddress) {
        energyToken = EnergyToken(_energyTokenAddress);
    }

    function placeBid(uint256 _price, uint256 _amount) public {
        bids.push(Bid(msg.sender, _price, _amount, true));
    }

    function placeAsk(uint256 _price, uint256 _amount) public {
        asks.push(Ask(msg.sender, _price, _amount, true));
    }

    function matchOrders() public {
        for (uint256 i = 0; i < bids.length; i++) {
            if (bids[i].active) {
                for (uint256 j = 0; j < asks.length; j++) {
                    if (asks[j].active && bids[i].price >= asks[j].price) {
                        // Execute trade
                        uint256 tradedAmount = bids[i].amount < asks[j].amount ? bids[i].amount : asks[j].amount;

                        // Transfer energy tokens using transferFrom
                        require(
                            energyToken.transferFrom(bids[i].owner, asks[j].owner, tradedAmount),
                            "Token transfer failed"
                        );

                        bids[i].amount -= tradedAmount;
                        asks[j].amount -= tradedAmount;

                        if (bids[i].amount == 0) {
                            bids[i].active = false; 
                        }
                        if (asks[j].amount == 0) {
                            asks[j].active = false;
                        }
                        break; 
                    }
                }
            }
        }
    }

    // Additional functions for managing bids/asks would go here
}
