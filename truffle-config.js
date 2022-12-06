const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config({ path: './.env' });
const Mnemonic = process.env.MNEMONIC;
const accountIndex = 0;

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(
        __dirname,
        'react-client/src/contracts'
    ),
    networks: {
        test: {
            provider: function () {
                return new HDWalletProvider(
                    Mnemonic,
                    'http://127.0.0.1:8545/',
                    accountIndex
                );
            },
            network_id: '*',
        },
        develop: {
            port: 8545,
            host: '127.0.0.1',
            network_id: 5777,
        },
    },
    compilers: {
        solc: {
            version: '0.6.2',
        },
    },
};
