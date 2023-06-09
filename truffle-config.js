const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config()

const PASS_PHRASE = process.env.PASS_PHRASE
const API_KEY = process.env.NODE_KEY

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    mumbai: {
      provider: function () {
        return new HDWalletProvider(PASS_PHRASE, `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`);
      },
      network_id: 80001,
      confirmations: 2,
      skipDryRun: true

    },
    dashboard: {
      port: 24012
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.13"
    }
  },
  db: {
    enabled: false
  }
};
