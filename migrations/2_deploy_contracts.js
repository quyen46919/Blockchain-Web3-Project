var ItemManager = artifacts.require('./ItemManager.sol');
var MyTokenSale = artifacts.require("./MyTokenSale.sol");

module.exports = function (deployer) {
  let addr = web3.eth.getAccounts();
  deployer.deploy(ItemManager);
  deployer.deploy(MyTokenSale, 1, addr[0], ItemManager.address );
  let instance = ItemManager.deployed();
  instance.transfer(MyTokenSale.address)
};
