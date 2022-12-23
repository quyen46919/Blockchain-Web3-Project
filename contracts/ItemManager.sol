// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyOwnable.sol";
import "./Item.sol";

contract ItemManager is MyOwnable{
    enum SupplyChainState {
        Created,
        Paid,
        Delivered
    }

    struct S_Item {
        address payable _owner;
        Item _item;
        string _identifier;
        uint256 _itemPrice;
        uint256 _itemTokenPrice;
        ItemManager.SupplyChainState _state;
        string _otherInfos;
    }

    mapping(uint256 => S_Item) public items;
    uint256 itemIndex;

    // EVENTS
    event SupplyChainStep(
        uint256 _itemIndex,
        uint256 _step,
        address _itemAddress,
        string _otherInfos
    );

    event UpdatedItemInfo(
        uint256 _itemIndex,
        address _itemAddress,
        string _otherInfos
    );

    // FUNCTIONS
    function createItem(
        address payable owner, string memory identifier, uint256 itemPrice, 
        uint256 itemTokenPrice, string memory otherInfos
    )
        public
    {
        Item item = new Item(this, itemPrice, itemIndex);
        items[itemIndex]._owner = owner;
        items[itemIndex]._item = item;
        items[itemIndex]._identifier = identifier;
        items[itemIndex]._itemPrice = itemPrice;
        items[itemIndex]._itemTokenPrice = itemTokenPrice;
        items[itemIndex]._state = SupplyChainState.Created;
        items[itemIndex]._otherInfos = otherInfos;

        emit SupplyChainStep(
            itemIndex,
            uint256(items[itemIndex]._state),
            address(item),
            otherInfos
        );

        itemIndex++;
    }

    function getItemInfor(uint256 _itemIndex) public view returns(S_Item memory) {
        return items[_itemIndex];
    }

    function triggerPaymentWithToken(uint256 _itemIndex) public payable {
        require(
            items[_itemIndex]._state == SupplyChainState.Created,
            "Item is further in the chain!"
        );
        items[_itemIndex]._state = SupplyChainState.Paid;
    
        emit SupplyChainStep(
            _itemIndex,
            uint256(items[_itemIndex]._state),
            address(items[_itemIndex]._item),
            items[_itemIndex]._otherInfos
        );
    }

    function triggerPayment(uint256 _itemIndex) public payable {
        require(
            items[_itemIndex]._itemPrice == msg.value,
            "Only full payments accepted!"
        );
        require(
            items[_itemIndex]._state == SupplyChainState.Created,
            "Item is further in the chain!"
        );
        items[_itemIndex]._state = SupplyChainState.Paid;
    
        emit SupplyChainStep(
            _itemIndex,
            uint256(items[_itemIndex]._state),
            address(items[_itemIndex]._item),
            items[_itemIndex]._otherInfos
        );
    }

    function triggerDelivery(uint256 _itemIndex) public onlyOwner {
        require(
            items[_itemIndex]._state == SupplyChainState.Paid,
            "Item is further in the chain!"
        );
        items[_itemIndex]._state = SupplyChainState.Delivered;

        emit SupplyChainStep(
            _itemIndex,
            uint256(items[_itemIndex]._state),
            address(items[_itemIndex]._item),
            items[_itemIndex]._otherInfos
        );
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function updateInfos(uint256 _itemIndex, string memory infos) public onlyOwner {
        require(
            items[_itemIndex]._state != SupplyChainState.Paid,
            "Paid item cannot update info!"
        );

        require(
            compareStrings(items[_itemIndex]._otherInfos, infos) == false,
            "Nothing change to update!"
        );

        items[_itemIndex]._otherInfos = infos;

        emit UpdatedItemInfo(
            _itemIndex,
            address(items[_itemIndex]._item),
            items[_itemIndex]._otherInfos
        );
    }
}