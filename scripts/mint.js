const web3 = require("../client/node_modules/web3");
const fs = require("fs");
const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require("dotenv").config();

const PASS_PHRASE = process.env.PASS_PHRASE
const API_KEY = process.env.NODE_KEY

//* Remember to write the nft address in manually after deploying the contract
const NFT_CONTRACT_ADDRESS = "0xc0d912417e9606195885626Ddedac79672C1Fa3A";
const OWNER_ADDRESS = "0x0Adcbc741c97A48B0Ac9481eb14c4cCE58f0C60C";
const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`;

//*Parse the contract artifact for ABI reference.
let rawdata = fs.readFileSync(
  path.resolve(__dirname, "../client/src/contracts/HousesCollection.json")
);
let contractAbi = JSON.parse(rawdata);
const NFT_ABI = contractAbi.abi;

async function main() {
  try {
    //*define web3, contract and wallet instances
    const provider = new HDWalletProvider(PASS_PHRASE, MUMBAI);

    const web3Instance = new web3(provider);

    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS
    );

    //* just mint
    await nftContract.methods
      .mint(4)
      .send({ from: OWNER_ADDRESS, value: web3.utils.toWei("0.0001", 'ether') })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));

    //* mint for a certain amount
    /*
    for (var i = 1; i < NUM_ITEMS; i++) {
      await nftContract.methods
        .mintItem(OWNER_ADDRESS, `https://ipfs.io/ipfs/QmZ13J2TyXTKjjyA46rYENRQYxEKjGtG6qyxUSXwhJZmZt/${i}.json`)
        .send({ from: OWNER_ADDRESS }).then(console.log('minted')).catch(error => console.log(error));
    }
    */
  } catch (e) {
    console.log(e);
  }
}

//invoke
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
