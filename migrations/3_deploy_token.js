var MyToken = artifacts.require('./MyToken.sol');
var MyTokenSale = artifacts.require('./MyTokenSale.sol');
var KycContract = artifacts.require('./KycContract.sol');
require('dotenv').config({ path: '../.env' });

module.exports = async function (deployer) {
    let address = await web3.eth.getAccounts();
    await deployer.deploy(MyToken, process.env.INITIAL_TOKEN, { gas: 6000000 });
    await deployer.deploy(KycContract, { gas: 6000000 });
    await deployer.deploy(
        MyTokenSale,
        100,
        address[0],
        MyToken.address,
        KycContract.address,
        { gas: 6000000 }
    );
    let instance = await MyToken.deployed();
    await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKEN);
};
