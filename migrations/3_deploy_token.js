var MyToken = artifacts.require('./MyToken.sol');
var MyTokenSale = artifacts.require('./MyTokenSale.sol');

module.exports = async function (deployer) {
  let address = await web3.eth.getAccounts();
  // tạo ra 10000000 token ECO
  await deployer.deploy(MyToken, 10000000);
  // khởi tạo MyTokenSale để bán token với tỷ lệ quy đổi 1 - 1
  await deployer.deploy(MyTokenSale, 1, address[0], MyToken.address);
  let instance = await MyToken.deployed();
  // khởi tạo token xong thì chuyển tử sang MyTokenSale 10000000
  await instance.transfer(MyTokenSale.address, 10000000);
};
