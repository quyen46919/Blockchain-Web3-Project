var MyTokenSale = artifacts.require('./MyTokenSale.sol');

module.exports = async function  (deployer) {
  await deployer.deploy(MyTokenSale, 18);
};
