const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploying EnergyToken contract
    const EnergyToken = await hre.ethers.getContractFactory("EnergyToken");
    const energyToken = await EnergyToken.deploy(1000000);  
    await energyToken.deployTransaction;
    console.log("EnergyToken deployed to:", energyToken.target);
    // EnergyToken deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F

    // Deploying EnergyTrading contract
    const EnergyTrading = await hre.ethers.getContractFactory("EnergyTrading");
    const energyTrading = await EnergyTrading.deploy(energyToken.target);
    await energyTrading.deployTransaction;
    console.log("EnergyTrading deployed to:", energyTrading.target);

    // // Deploying Lock contract
    const Lock = await hre.ethers.getContractFactory("Lock");
    const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60; 
    const lock = await Lock.deploy(unlockTime);
    await lock.deployTransaction; 
    console.log("Lock deployed at:", lock.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
