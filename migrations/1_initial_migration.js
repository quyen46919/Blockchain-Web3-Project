var Migrations = artifacts.require('./Migrations.sol');

module.exports = async function (deployer) {
    await deployer.deploy(Migrations, { gas: 6000000 });
};
