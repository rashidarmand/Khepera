// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Token.sol";


/**
	TODO:
	[X] Set the Fee Account
	[X] Deposit Ether
	[ ] Withdraw Ether
	[X] Deposit Tokens
	[ ] Withdraw Tokens
	[ ] Check Balances
	[ ] Make Order
	[ ] Cancel Order
	[ ] Fill Order
	[ ] Charge Fees
*/

contract Exchange {
	using SafeMath for uint;

	// Variables
	address public feeAccount; // The account that receives exchange fees
	uint256 public feePercent; // The fee percentage
	address constant ETHER = address(0); // store Ether in tokens mapping with blank address
	mapping(address => mapping(address => uint256)) public tokens; // Tracks token & ether balances on the exchange

	// Events
	event Deposit(address token, address user, uint256 amount, uint256 balance);

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

	function depositToken(address _token, uint256 _amount) public {
		// Don't allow Ether Deposits
		require(_token != ETHER);
		// Exchange must be approved & transferFrom must execute
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		// Manage deposit - update balance
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		// Emit an event
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}
}