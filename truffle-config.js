require('babel-register');
require('babel-polyfill');
require('dotenv').config();


module.exports = {
 

  networks: {    
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },    
  },
contracts_directory: './src/contracts/',
contracts_build_directory: './src/abis/',
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {     
      optimizer: {
      enabled: true,
      runs: 200    
    }
  }
 }
}