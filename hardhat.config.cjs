require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

dotenv.config();
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.27",
  networks: {
    myNetwork: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],  
    },
  }
};
