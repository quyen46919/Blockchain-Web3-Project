var MyToken = artifacts.require('./MyToken.sol');
var MyTokenSale = artifacts.require('./MyTokenSale.sol');

module.exports = async function (deployer) {
  await deployer.deploy(MyToken, 18);
  await deployer.deploy(MyTokenSale, 18);
};
