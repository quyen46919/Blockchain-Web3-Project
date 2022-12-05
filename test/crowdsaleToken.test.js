const Token = artifacts.require('MyToken');
const MyTokenSale = artifacts.require('MyTokenSale');
const BN = web3.utils.BN;
const chai = require('../chai.setup');
const expect = chai.expect;
require('dotenv').config({ path: '../.env' });

contract('TokenSale Test', async (accounts) => {
    const [deployerAccount, recipient, anotherAccount] = accounts;

    it('Should not have any tokens in my deployer account', async () => {
        let instance = await Token.deployed();
        return await expect(
            instance.balanceOf(deployerAccount)
        ).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it('All tokens should be in the TokenSale Smart Contract by default', async () => {
        let instance = await Token.deployed();
        let balanceOfToken = await instance.balanceOf(MyTokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balanceOfToken).to.be.a.bignumber.equal(totalSupply);
    });

    it('Should be possible to buy tokens', async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let initBalance = await tokenInstance.balanceOf(deployerAccount);

        await expect(
            tokenSaleInstance.sendTransaction({
                from: deployerAccount,
                value: web3.utils.toWei('1', 'wei'),
            })
        ).to.be.fulfilled;
        await expect(
            tokenInstance.balanceOf(deployerAccount)
        ).to.eventually.be.a.bignumber.equal(initBalance.add(new BN(1)));
    });
});
