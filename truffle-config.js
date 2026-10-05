
// require('babel-register')
// require('babel-polyfill')
require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  // Configure networks (Localhost, Rinkeby, etc.)
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
    },
  
    sepolia: {
        provider: () => {
          return new HDWalletProvider({
            privateKeys: [process.env.PRIVATE_WALLET_KEY],
            provider: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
          });
        },
          network_id: 11155111,
          networkCheckTimeout: 10000,
          confirmations: 5,
          timeoutBlocks: 200,
          skipDryRun: true
    },

      goerli: {
        provider: () => {
          return new HDWalletProvider({
            privateKeys: [process.env.PRIVATE_WALLET_KEY],
            provider: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
          });
        },
          network_id: 5,
      },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './build/contracts',

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.11',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    },
  },
}
