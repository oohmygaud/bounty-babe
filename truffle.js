var HDWalletProvider = require("truffle-hdwallet-provider");
var process = require("process")
var mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic,
          "https://rinkeby.infura.io/v3/72b574db820841cab063fd946c07a5fa");
      },
      network_id: 4
    }
  }
};
