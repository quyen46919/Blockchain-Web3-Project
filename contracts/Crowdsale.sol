// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// đây là contract có chức năng làm cổng giao dịch để mua bán token của mình
contract Crowdsale is Context, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // The token being sold
    // Token mà mình đang bán
    IERC20 private _token;

    // Address where funds are collected
    // Địa chỉ ví của mình
    address payable private _wallet;

    // How many token units a buyer gets per wei.
    // The rate is the conversion between wei and the smallest and indivisible token unit.
    // So, if you are using a rate of 1 with a ERC20Detailed token with 3 decimals called TOK
    // 1 wei will give you 1 unit, or 0.001 TOK.

    // Vd dễ hiểu hơn
    // Ta muốn bán 1ETH = 400$, tương đương _rate = 400
    // TKNbits = _rate * wei, nếu _rate = 1 => 1 * 10^18
    // tương ứng 10^18 wei = 400$
    // => 1$ = 10^18/400 = 2.5*10^15
    // => Nếu người dùng gửi cho crowdsale 1$, mình sẽ gửi lại cho họ 10^18TKNbits

    uint256 private _rate;

    // Amount of wei raised
    // Tổng số lượng token đã được mua
    uint256 private _weiRaised;

    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens - address của người mua
     * @param beneficiary who got the tokens - address của người nhận
     * @param value weis paid for purchase - số lượng wei họ đã gửi cho mình
     * @param amount amount of tokens purchased - số lượng token mình gửi lại cho họ
     */
    event TokensPurchased(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    /**
     * @param rate Number of token units a buyer gets per wei
     * @dev The rate is the conversion between wei and the smallest and indivisible
     * token unit. So, if you are using a rate of 1 with a ERC20Detailed token
     * with 3 decimals called TOK, 1 wei will give you 1 unit, or 0.001 TOK.
     * @param wallet Address where collected funds will be forwarded to
     * @param token Address of the token being sold
     */
    constructor(
        uint256 rate, // Số lượng token người mua sẽ có trên mỗi wei
        address payable wallet, // địa chỉ ví của mình
        IERC20 token // address của cái contract token của mình
    ) public {
        // check các điều kiện tham số đầu vào
        require(rate > 0, "Crowdsale: rate is 0");
        require(wallet != address(0), "Crowdsale: wallet is the zero address");
        require(
            address(token) != address(0),
            "Crowdsale: token is the zero address"
        );
        // gán vào biến khởi tạo contructor vào biến nội bộ của contract
        _rate = rate;
        _wallet = wallet;
        _token = token;
    }

    /**
     * @dev fallback function ***DO NOT OVERRIDE***
     * Note that other contracts will transfer funds with a base gas stipend
     * of 2300, which is not enough to call buyTokens. Consider calling
     * buyTokens directly when purchasing tokens from a contract.
     */
    // hàm receive là hàm được gọi khi contract không có dữ liệu truyền vào mà chỉ có ether chuyển vào
    receive() external payable {
        buyTokens(_msgSender());
    }

    /**
     * @return the token being sold. - tương tự hàm get trong java, trả về cái _token
     */
    function token() public view returns (IERC20) {
        return _token;
    }

    /**
     * @return the address where funds are collected. - tương tự hàm get trong java, trả về cái _wallet
     */
    function wallet() public view returns (address payable) {
        return _wallet;
    }

    /**
     * @return the number of token units a buyer gets per wei. - tương tự hàm get trong java, trả về cái _rate
     */
    function rate() public view returns (uint256) {
        return _rate;
    }

    /**
     * @return the amount of wei raised. - tương tự hàm get trong java, trả về cái _weiRaised
     */
    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    /**
     * @dev low level token purchase ***DO NOT OVERRIDE***
     * This function has a non-reentrancy guard, so it shouldn't be called by
     * another `nonReentrant` function.
     * @param beneficiary Recipient of the token purchase
     */

    // hàm này dùng để một address mua token từ contract
    // muốn gọi hàm này phải qua một cổng bảo vệ là nonReentrant
    function buyTokens(address beneficiary) public payable nonReentrant {
        // gọi weiAmount là số lượng ether msg gửi vào để mua ether
        uint256 weiAmount = msg.value;
        // gọi hàm _preValidatePurchase để kiểm tra dữ liệu đầu vào
        _preValidatePurchase(beneficiary, weiAmount);

        // gọi hàm _getTokenAmount để tính toán số lượng token trả ra cho người mua
        uint256 tokens = _getTokenAmount(weiAmount);

        // cộng số ether người dùng gửi vào vào _weiRaised sau này truy xuất
        _weiRaised = _weiRaised.add(weiAmount);

        // gọi hàm _processPurchase để gửi token cho người mua
        _processPurchase(beneficiary, tokens);
        // gọi sự kiện TokensPurchased để tạo log sự kiện với các thông số mua bán
        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);

        // gọi hàm _updatePurchasingState để update trạng thái giao dịch (tùy chọn)
        _updatePurchasingState(beneficiary, weiAmount);

        // chuyển số ether đó vào ví của mình
        _forwardFunds();

        // gọi hàm _postValidatePurchase để xác thực giao dịch (tùy chọn)
        _postValidatePurchase(beneficiary, weiAmount);
    }

    /**
     * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met.
     * Use `super` in contracts that inherit from Crowdsale to extend their validations.
     * Example from CappedCrowdsale.sol's _preValidatePurchase method:
     *     super._preValidatePurchase(beneficiary, weiAmount);
     *     require(weiRaised().add(weiAmount) <= cap);
     * @param beneficiary Address performing the token purchase
     * @param weiAmount Value in wei involved in the purchase
     */

    
    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        virtual
    {
        // kiểm tra xem địa chỉ người gửi beneficiary có khác address(0) hay không
        // nếu không thì báo lỗi "Crowdsale: beneficiary is the zero address"
        // tương tự với bên dưới nhé
        require(
            beneficiary != address(0),
            "Crowdsale: beneficiary is the zero address"
        );
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
        this; // dùng this này để không tạo bytecode (cái này t cũng không hiểu lắm)
    }

    /**
     * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid
     * conditions are not met.
     * @param beneficiary Address performing the token purchase
     * @param weiAmount Value in wei involved in the purchase
     */
    function _postValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
    {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends
     * its tokens.
     * @param beneficiary Address performing the token purchase
     * @param tokenAmount Number of tokens to be emitted
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount)
        internal
        virtual
    {
        // 
        _token.safeTransfer(beneficiary, tokenAmount);
    }

    /**
     * @dev Executed when a purchase has been validated and is ready to be executed. Doesn't necessarily emit/send
     * tokens.
     * @param beneficiary Address receiving the tokens
     * @param tokenAmount Number of tokens to be purchased
     */

    // hàm này tùy chọn, đã giải thích phía trên
    function _processPurchase(address beneficiary, uint256 tokenAmount)
        internal
    {
        // gọi hàm _deliverTokens để gửi token cho người mua
        _deliverTokens(beneficiary, tokenAmount);
    }

    /**
     * @dev Override for extensions that require an internal state to check for validity (current user contributions,
     * etc.)
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei involved in the purchase
     */
     // hàm này tùy chọn, đã giải thích phía trên
    function _updatePurchasingState(address beneficiary, uint256 weiAmount)
        internal
    {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @dev Override to extend the way in which ether is converted to tokens.
     * @param weiAmount Value in wei to be converted into tokens
     * @return Number of tokens that can be purchased with the specified _weiAmount
     */
     // hàm này tính số token tương ứng với số weiAmount truyền vào
    function _getTokenAmount(uint256 weiAmount)
        internal
        view
        returns (uint256)
    {
        // mul tức là nhân nhé
        return weiAmount.mul(_rate);
    }

    /**
     * @dev Determines how ETH is stored/forwarded on purchases.
     */
     // chuyển ether vào ví của mình
    function _forwardFunds() internal virtual {
        _wallet.transfer(msg.value);
    }
}