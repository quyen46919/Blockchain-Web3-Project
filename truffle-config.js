const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config({ path: './.env' });
const Mnemonic = process.env.MNEMONIC;
const accountIndex = 0;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(
        __dirname,
        'react-client/src/contracts'
    ),
    networks: {
        // test: {
        //     provider: function () {
        //         return new HDWalletProvider(
        //             Mnemonic,
        //             'http://127.0.0.1:8545/',
        //             accountIndex
        //         );
        //     },
        //     network_id: '*',
        // },
        develop: {
            port: 8545,
            host: '127.0.0.1',
            network_id: 5777,
            provider: function () {
                return new HDWalletProvider(
                    Mnemonic,
                    'http://127.0.0.1:8545/',
                    accountIndex
                );
            },
            // gas: 5500000, // Default gas to send per transaction
            // gasPrice: 10000000000, // 10 gwei (default: 20 gwei)
            confirmations: 2, // # of confs to wait between deployments. (default: 0)
            timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
            skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
        },
        infura: {
            provider: () => new HDWalletProvider(Mnemonic, `https://mainnet.infura.io/v3/${INFURA_API_KEY}`, 5),
            network_id: '*',
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true,
        },
        sepolia: {
            provider: () => new HDWalletProvider(Mnemonic, `https://sepolia.infura.io/v3/${INFURA_API_KEY}`, 5),
            network_id: '*',
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true,
        }
    },
    compilers: {
        solc: {
            version: '>=0.8.0',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1000,
                },
            },
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
};
