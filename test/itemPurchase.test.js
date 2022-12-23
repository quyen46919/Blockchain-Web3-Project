// const Token = artifacts.require('MyToken');
// const MyTokenSale = artifacts.require('MyTokenSale');
// const KycContract = artifacts.require('KycContract');
// const Item = artifacts.require('Item');
// const ItemManager = artifacts.require('ItemManager');
// const BN = web3.utils.BN;
// const chai = require('../chai.setup');
// const expect = chai.expect;
// require('dotenv').config({ path: '../.env' });

// contract('Item Test', async (accounts) => {
//     const [deployerAccount, recipient, anotherAccount] = accounts;

//     it('It is able to buy item with token', async () => {
//         const itemManagerIns = ItemManager.deployed();
//         // create item
//         itemManagerIns.createItem(
//             anotherAccount,
//             "Laptop ASUS ROG STRIX G531GD",
//             web3.utils.toWei('10', 'wei'),
//             9,
//             "Chuỗi mã hóa thông tin sản phẩm"
//         ).call();
        
//         itemManagerIns.getItemInfor(0).call().then(value => console.log(value))

//         // buy token

//         // buy item

//         // check rs
//         // let tokenInstance = await Token.deployed();
//         // let tokenSaleInstance = await MyTokenSale.deployed();
//         // let kycContract = await KycContract.deployed();
//         // let initBalance = await tokenInstance.balanceOf(deployerAccount);

//         // await kycContract.setKycCompleted(deployerAccount, "Nguyen Chau Quyen", "0345512215", "quyen46919@donga.edu.vn", {
//         //     from: deployerAccount,
//         // });
//     })
// });