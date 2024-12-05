const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnergyTrading Contract", function () {
  let energyToken, energyTrading;
  let accounts;

  beforeEach(async function () {
    // Get test accounts
    accounts = await ethers.getSigners();

    // Deploy EnergyToken contract
    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    energyToken = await EnergyToken.deploy(1000000);  // Initial supply of 1 million tokens
    await energyToken.deployed();

    // Deploy EnergyTrading contract
    const EnergyTrading = await ethers.getContractFactory("EnergyTrading");
    energyTrading = await EnergyTrading.deploy(energyToken.address);
    await energyTrading.deployed();

    // Transfer some tokens to the accounts for testing
    await energyToken.transfer(accounts[0].address, 5000);  // Give account[0] 5000 tokens
    await energyToken.transfer(accounts[1].address, 5000);  // Give account[1] 5000 tokens
  });

  it("should place a bid", async function () {
    // Account[0] places a bid
    await energyToken.connect(accounts[0]).approve(energyTrading.address, 500);
    await energyTrading.connect(accounts[0]).placeBid(100, 50);  // Bid price 100, amount 50

    // Check that the bid was placed
    const bid = await energyTrading.bids(0);
    expect(bid.owner).to.equal(accounts[0].address);
    expect(bid.price).to.equal(100);
    expect(bid.amount).to.equal(50);
    expect(bid.active).to.equal(true);
  });

  it("should place an ask", async function () {
    // Account[1] places an ask
    await energyToken.connect(accounts[1]).approve(energyTrading.address, 500);
    await energyTrading.connect(accounts[1]).placeAsk(90, 30);  // Ask price 90, amount 30

    // Check that the ask was placed
    const ask = await energyTrading.asks(0);
    expect(ask.owner).to.equal(accounts[1].address);
    expect(ask.price).to.equal(90);
    expect(ask.amount).to.equal(30);
    expect(ask.active).to.equal(true);
  });

  it("should match orders between bid and ask", async function () {
    // Account[0] places a bid
    await energyToken.connect(accounts[0]).approve(energyTrading.address, 500);
    await energyTrading.connect(accounts[0]).placeBid(100, 50);  // Bid price 100, amount 50

    // Account[1] places an ask
    await energyToken.connect(accounts[1]).approve(energyTrading.address, 500);
    await energyTrading.connect(accounts[1]).placeAsk(90, 30);  // Ask price 90, amount 30

    // Match the orders
    await energyTrading.connect(accounts[0]).matchOrders();

    // Check that the bid and ask have been updated
    const updatedBid = await energyTrading.bids(0);
    const updatedAsk = await energyTrading.asks(0);

    // Ensure the amounts are updated after the trade
    expect(updatedBid.amount).to.equal(20);  // 50 - 30 = 20
    expect(updatedAsk.amount).to.equal(0);   // All ask amount should be traded

    // Ensure both bid and ask are still active/inactive as needed
    expect(updatedBid.active).to.equal(true);
    expect(updatedAsk.active).to.equal(false);

    // Ensure the energy tokens were transferred
    const balanceBidder = await energyToken.balanceOf(accounts[0].address);
    const balanceAsker = await energyToken.balanceOf(accounts[1].address);
    
    // Check that the bidder's balance is reduced, and the asker's balance is increased
    expect(balanceBidder).to.equal(5000 - 30);  // Initial + 5000 - 30 tokens traded
    expect(balanceAsker).to.equal(5000 + 30);   // Initial + 5000 + 30 tokens received
  });

  it("should fail when trying to match orders with incorrect conditions", async function () {
    // Account[0] places a bid
    await energyToken.connect(accounts[0]).approve(energyTrading.address, 500);
    await energyTrading.connect(accounts[0]).placeBid(100, 50);  // Bid price 100, amount 50

    // Account[1] places an ask with a higher price
    await energyToken.connect(accounts[1]).approve(energyTrading.address, 500);
    await energyTrading.connect(accounts[1]).placeAsk(110, 30);  // Ask price 110, amount 30

    // Try to match orders, should not match since bid price is lower than ask price
    await expect(energyTrading.connect(accounts[0]).matchOrders()).to.be.revertedWith("Token transfer failed");
  });

});
