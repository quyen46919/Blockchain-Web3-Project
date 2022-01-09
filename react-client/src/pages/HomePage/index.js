import React, { useState, useEffect } from 'react';
import ItemManagerContract from 'contracts/ItemManager.json';
import getWeb3 from '../../getWeb3';
// eslint-disable-next-line no-unused-vars
import _, { cloneDeep } from 'lodash';
import './styles.scss';

function convertState(state) {
    switch (Number(state)) {
    case 0:
        return 'Created';
    case 1:
        return 'Paid';
    case 2:
        return 'Deliveried';
    default:
        return 'Created';
    }
}

function HomePage() {
    const [isLoadding, setIsLoadding] = useState(false);
    const [web3, setWeb3] = useState([]);
    const [itemManagerContract, setItemManagerContract] = useState({});
    // const [itemContract, setItemContract] = useState([]);
    const [account, setAccount] = useState([]);
    const [itemInfo, setItemInfo] = useState({ cost: '0', itemName: '' });
    const [listItem, setListItem] = useState([]);

    useEffect(() => {
        const onInit = async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const itemManager = new web3.eth.Contract(
                    ItemManagerContract.abi,
                    ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address
                );
                // const item = new web3.eth.Contract(
                //     ItemContract.abi,
                //     ItemContract.networks[networkId] && ItemContract.networks[networkId].address,
                // );
                const current = Array.from(Array(20).keys()).map(async (x) => {
                    return await itemManager.methods.items(x).call({ from: accounts[0] });
                });
                Promise.all(current).then((values) => {
                    // lọc ra những item đã lưu sản phẩm vào
                    const filteredItems = values.filter((item) => item[0] !== '0x0000000000000000000000000000000000000000');
                    setListItem(filteredItems);
                });

                setWeb3(web3);
                setAccount(accounts[0]);
                setItemManagerContract(itemManager);
                setIsLoadding(false);
                listenToPaymentEvent();
            } catch (error) {
                console.log('Failed to load web3, accounts, or contract. Check console for details.');
            }
        };
        onInit();
    }, []);

    useEffect(() => {
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log('Account changed', accounts);
            setAccount(accounts[0]);
            // currentAccount.current = accounts[0];
        });
    }, [account]);

    const handleInputChange = (e) => {
        setItemInfo({
            ...itemInfo,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async () => {
        console.log(itemInfo);
        const result = await itemManagerContract.methods.createItem(
            account, itemInfo.itemName, itemInfo.cost).send({ from: account }
        );
        const newItem = result.events.SupplyChainStep.returnValues;
        // console.log("newItem = ", newItem);
        const newItemObject = {
            _item: newItem._itemAddress,
            _identifier: itemInfo.itemName,
            _itemPrice: itemInfo.cost,
            _state: newItem._step,
            _owner: account
        };

        setListItem([...listItem, newItemObject]);
        setItemInfo({ itemName: '', cost: '' });
    };

    const listenToPaymentEvent = () => {
        // TẠO MỚI 1 ITEM
        itemManagerContract.events.SupplyChainStep().on('data', async function(evt) {
            const res = await itemManagerContract.methods.items(evt.returnValues._itemIndex).call();
            console.log(res);
            alert('have item change state');
        });
    };

    const handleTriggerDelivery = async (index) => {
        try {
            await itemManagerContract.methods.triggerDelivery(index).send({ from: account });

            let cloneListItem = cloneDeep(listItem);
            let targetItem = listItem[index];
            targetItem._state = 2;

            cloneListItem.splice(index, 1, targetItem);
            setListItem(cloneListItem);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="App">
            <div className="web3__your-address">
                Your current address:
                <p>{account}</p>
            </div>
            {
                isLoadding ? <div>Loading Web3, accounts, and contract...</div> :
                    <form>
                        <div className="App__line">
                            <label htmlFor="">Item identifier: </label>
                            <input
                                type="text"
                                name="itemName"
                                value={itemInfo.itemName}
                                onChange={handleInputChange}
                                placeholder="Input item's name"
                            />
                        </div>
                        <div className="App__line">
                            <label htmlFor="">Cost in Wei: </label>
                            <input
                                type="text"
                                name="cost"
                                value={itemInfo.cost}
                                onChange={handleInputChange}
                                placeholder="Input item's cost"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}>
                        Create new Item
                        </button>
                    </form>
            }
            <div className="web3__posted-items">
                {
                    listItem.length === 0 ? '' :
                        listItem.map((item, index) => {
                            if (String(item._owner).toLowerCase() !== String(account).toLowerCase()) {
                                return;
                            } else {
                                return (
                                    <div key={item._item}
                                        className={
                                            parseInt(item._state) < 1 ?
                                                'web3__item-block' : parseInt(item._state) === 1 ?
                                                    'web3__item-block web3__trigger' :
                                                    'web3__item-deliveried'
                                        }
                                    >
                                        <p>Address: {item._item}</p>
                                        <p>Identifier: {item._identifier}</p>
                                        <p>Price: {item._itemPrice}</p>
                                        <p>State: {convertState(item._state)}</p>
                                        { parseInt(item._state) === 1 &&
                                        <div className="web3__trigger-noti" onClick={() => handleTriggerDelivery(index)}>
                                            Trigger delivery now
                                        </div>
                                        }
                                    </div>
                                );
                            }
                        })
                }
            </div>
        </div>
    );
}

export default HomePage;