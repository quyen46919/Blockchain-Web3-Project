import Web3 from 'web3';
import KycContract from 'contracts/KycContract.json';
import MyToken from 'contracts/MyToken.json';
import MyTokenSale from 'contracts/MyTokenSale.json';
import ItemManagerContract from 'contracts/ItemManager.json';

const loadContract = async (web3) => {
    if (!web3) return new Error('No web3 instance!');

    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const tokenInstance = new web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[networkId] && MyToken.networks[networkId].address
    );
    const tokenSaleInstance = new web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[networkId] &&
                        MyTokenSale.networks[networkId].address
    );
    const kycInstance = new web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[networkId] &&
                        KycContract.networks[networkId].address
    );
    const itemManager = new web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address
    );
    const isValidAccount = await kycInstance.methods.kycCompleted(accounts[0]).call();
    return {
        account: accounts[0],
        tokenInstance,
        tokenSaleInstance,
        kycInstance,
        itemManager,
        isValidAccount
    };
};

const getWeb3 = () =>
    new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener('load', async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    const contractIns = await loadContract(web3);
                    resolve({
                        web3, ...contractIns
                    });
                } catch (error) {
                    reject(error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                const contractIns = await loadContract(web3);
                resolve({
                    web3, ...contractIns
                });
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(
                    'http://127.0.0.1:8545'
                );
                const web3 = new Web3(provider);
                const contractIns = await loadContract(web3);
                resolve({
                    web3, ...contractIns
                });
            }
        });
    });

export default getWeb3;
