import Web3 from "web3";
import contract from "./contracts/HousesCollection.json";

const NFT_CONTRACT_ADDRESS = "0xc0d912417e9606195885626Ddedac79672C1Fa3A";

async function getContractMetamask() {
  try {
      const web3 = await new Web3(Web3.givenProvider);
      const abi = contract.abi;
      const nftContract = new web3.eth.Contract(abi, NFT_CONTRACT_ADDRESS);
      return nftContract;
  } catch (err) {
    console.log(err);
  }
}

export default getContractMetamask;
