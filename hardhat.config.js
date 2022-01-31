// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const RINKEBY_PRIVATE_KEY = "";

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");


module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    }
  }
};

// Задача! Внести пожертвование
// npx hardhat dDonation --address <Contract address> --network rinkeby
task("dDonation", "Send 0.001ETH to contract")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs) => {
    const provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(RINKEBY_PRIVATE_KEY, provider);
    const tx = {
      to: taskArgs.address,
      value: ethers.utils.parseEther('0.001')
    }
    const sendTx = await signer.sendTransaction(tx)
    await sendTx.wait()
});

// Задача! Вывести деньги на определенный адрес в определенном количестве
// npx hardhat dWithdraw 
//    --address <Contract address> 
//    --dest <user address destination> 
//    --money <0.001ETH> 
//    --network rinkeby
task("dWithdraw", "Withdraw all money to user")
  .addParam("address", "Contract address")
  .addParam("dest", "Address user destination")
  .addParam("money", "ETH")
  .setAction(async (taskArgs) => {
    const contract = require("./artifacts/contracts/Donation.sol/Donation.json");
    const provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(RINKEBY_PRIVATE_KEY, provider);
    const donationContract = new ethers.Contract(
      taskArgs.address, 
      contract.abi, 
      signer);
    await donationContract.withdrawDonation(ethers.utils.parseEther(taskArgs.money), taskArgs.dest)
});

// Задача! Получить список пожертвователей
// npx hardhat dGetUsers --address <Contract address>  --network rinkeby
task("dGetUsers", "Getting a list of users")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs) => {
    const contract = require("./artifacts/contracts/Donation.sol/Donation.json");
    const provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(RINKEBY_PRIVATE_KEY, provider);
    const donationContract = new ethers.Contract(
      taskArgs.address, 
      contract.abi, 
      signer);
    
    console.log(await donationContract.getAllDonors())
});

// Задача! Получить сумму пожертвователей для заданного пользователя
// npx hardhat dGetBalance --address <Contract address> --user <Address user> --network rinkeby
task("dGetBalance", "get the amount of donations")
  .addParam("address", "Contract address")
  .addParam("user", "Address user")
  .setAction(async (taskArgs) => {
    const contract = require("./artifacts/contracts/Donation.sol/Donation.json");
    const provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(RINKEBY_PRIVATE_KEY, provider);
    const donationContract = new ethers.Contract(
      taskArgs.address, 
      contract.abi, 
      signer);
    const data = await donationContract.getBelance(taskArgs.user);
    console.log("Balance: ", ethers.utils.formatEther(data),"Ether")
});