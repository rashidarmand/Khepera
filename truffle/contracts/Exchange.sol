// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Token.sol";

contract Exchange {
	using SafeMath for uint;

	// Variables
	address public feeAccount; // The account that receives exchange fees
	uint256 public feePercent; // The fee percentage
	address constant ETHER = address(0); // store Ether in tokens mapping with blank address
	mapping(address => mapping(address => uint256)) public tokens; // Tracks token & ether balances on the exchange
	mapping(uint256 => _Order) public orders; // Tracks orders
	uint256 public orderCount;
	mapping(uint256 => bool) public filledOrders;
	mapping(uint256 => bool) public cancelledOrders;

	// Events
	event Deposit(address token, address user, uint256 amount, uint256 balance);
	event Withdraw(address token, address user, uint256 amount, uint256 balance);
	event Order (uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
	event Cancel (uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
	event Trade (uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, address userFill, uint256 timestamp);

	// Structs
	struct _Order {
		uint256 id; // unique identifier for order
		address user; // person who created the order
		address tokenGet; // the token they want to purchase
		uint256 amountGet; // the amount of the token they want to purchase
		address tokenGive; // the token they are going to use to trade
		uint256 amountGive; // the amount of the token they are going to use to trade
		uint256 timestamp; // the time the order was created
	}

	constructor(address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	// Fallback: reverts if Ether is mistakenly sent to this smart contract
	fallback() external {
		revert();
	}

	function depositEther() payable public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function withdrawEther(uint256 _amount) public {
		require(tokens[ETHER][msg.sender] >= _amount); // Cannot withdraw more ether than you have available
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
		msg.sender.transfer(_amount);
		emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
	}

	function depositToken(address _token, uint256 _amount) public {
		require(_token != ETHER); // Don't allow Ether Deposits
		require(Token(_token).transferFrom(msg.sender, address(this), _amount)); // transferFrom must execute meaning exchnage is approved
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount); // Manage deposit - update balance
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function withdrawToken(address _token, uint256 _amount) public {
		require(_token != ETHER); // Cannot withdraw Ether using this function
		require(tokens[_token][msg.sender] >= _amount); // Cannot withdraw more tokens than you have available
		tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
		require(Token(_token).transfer(msg.sender, _amount));
		emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf(address _token, address _user) public view returns (uint256) {
		return tokens[_token][_user];
	}

	function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
		orderCount = orderCount.add(1);
		orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
		emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
	}

	function cancelOrder(uint256 _id) public {
		_Order storage _order = orders[_id];
		require(address(_order.user) == msg.sender); // person calling this function must be same person who made the order
		require(_order.id == _id); // Must be a valid order
		cancelledOrders[_id] = true;
		emit Cancel(_order.id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, block.timestamp);
	}

	function fillOrder(uint256 _id) public {
		require(_id > 0 && _id <= orderCount); // valid order
		require(!filledOrders[_id]);
		require(!cancelledOrders[_id]);
		_Order storage _order = orders[_id];
		_trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
		filledOrders[_order.id] = true;
	}

	function _trade(uint256 _orderId, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {
		// Fee paid by the user that fills the order a.k.a msg.sender
		uint256 _feeAmount = _amountGet.mul(feePercent).div(100);

		tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet.add(_feeAmount)); // Fee deducted from _amountGet
		tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
		tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(_feeAmount); // Collect fees for feeAccount
		tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
		tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);

		emit Trade(_orderId, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, msg.sender, block.timestamp);
	}
}