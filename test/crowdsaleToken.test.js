const Token = artifacts.require('MyToken');
const MyTokenSale = artifacts.require('MyTokenSale');
const KycContract = artifacts.require('KycContract');
const BN = web3.utils.BN;
const chai = require('../chai.setup');
const expect = chai.expect;
require('dotenv').config({ path: '../.env' });

contract('TokenSale Test', async (accounts) => {
    const [deployerAccount, recipient, anotherAccount] = accounts;

    it('Should not have any tokens in my deployer account', async () => {
        let instance = await Token.deployed();
        await expect(
            instance.balanceOf(deployerAccount)
        ).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it('All tokens should be in the TokenSale Smart Contract by default', async () => {
        let instance = await Token.deployed();
        let balanceOfToken = await instance.balanceOf(MyTokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balanceOfToken).to.be.a.bignumber.equal(totalSupply);
    });

    it('Should be possible to buy and burn tokens', async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let kycContract = await KycContract.deployed();
        let initBalance = await tokenInstance.balanceOf(deployerAccount);

        await kycContract.setKycCompleted(deployerAccount, "Nguyen Chau Quyen", "0345512215", "quyen46919@donga.edu.vn", {
            from: deployerAccount,
        });

        await expect(
            tokenInstance.balanceOf(deployerAccount)
        ).to.eventually.be.a.bignumber.equal(new BN(0));

        await expect(
            tokenSaleInstance.sendTransaction({
                from: deployerAccount,
                value: web3.utils.toWei('1', 'wei'),
            })
        ).to.be.fulfilled;

        await expect(
            tokenInstance.balanceOf(deployerAccount)
        ).to.eventually.be.a.bignumber.equal(initBalance.add(new BN(1)));

        await expect(
            tokenInstance.burn(deployerAccount, 1)
        ).to.be.fulfilled;

        await expect(
            tokenInstance.balanceOf(deployerAccount)
        ).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it('Should be possible buy token with paypal payment', async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let kycContract = await KycContract.deployed();
        let initBalance = await tokenInstance.balanceOf(deployerAccount);

        await kycContract.setKycCompleted(deployerAccount, "Nguyen Chau Quyen", "0345512215", "quyen46919@donga.edu.vn", {
            from: deployerAccount,
        });
        await expect(
            tokenSaleInstance.buyTokensPaypal(deployerAccount, 10)
        ).to.be.fulfilled;
        await expect(
            tokenInstance.balanceOf(deployerAccount)
        ).to.eventually.be.a.bignumber.equal(initBalance.add(new BN(10)));
    });
});
