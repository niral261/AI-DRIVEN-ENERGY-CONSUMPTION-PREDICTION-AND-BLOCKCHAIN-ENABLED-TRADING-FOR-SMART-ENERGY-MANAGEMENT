const express = require('express');
const { ethers } = require('ethers');
const dotenv = require('dotenv');
const { energyTokenABI, energyTradingABI, lockABI } = require('./ABI/abi');

dotenv.config();

const app = express();
const port = 3000;

const provider = new ethers.JsonRpcProvider(process.env.NETWORK_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const energyTokenAddress = process.env.ENERGY_TOKEN_CONTRACT_ADDRESS;
const energyTradingAddress = process.env.ENERGY_TRADING_CONTRACT_ADDRESS;
const lockAddress = process.env.LOCK_CONTRACT_ADDRESS;

// Instantiate contract objects
const energyTokenContract = new ethers.Contract(energyTokenAddress, energyTokenABI, wallet);
const energyTradingContract = new ethers.Contract(energyTradingAddress, energyTradingABI, wallet);
const lockContract = new ethers.Contract(lockAddress, lockABI, wallet);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




// // Create a contract instance
// const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// // Sample endpoint to interact with your contract
// app.get('/getData', async (req, res) => {
//   try {
//     // Call a function from your contract
//     const data = await contract.someFunction(); // Replace with actual function
//     res.json({ success: true, data });
//   } catch (error) {
//     console.error("Error getting data from contract:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Sample endpoint to send a transaction to your contract
// app.post('/sendTransaction', async (req, res) => {
//   try {
//     const tx = await contract.someTransactionFunction(); // Replace with your contract function
//     await tx.wait(); // Wait for transaction to be mined
//     res.json({ success: true, transactionHash: tx.hash });
//   } catch (error) {
//     console.error("Error sending transaction to contract:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });