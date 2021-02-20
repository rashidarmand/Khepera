// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Token.sol";


/**
	TODO:
	[X] Set the Fee Account
	[X] Deposit Ether
	[X] Withdraw Ether
	[X] Deposit Tokens
	[X] Withdraw Tokens
	[X] Check Balances
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
	event Withdraw(address token, address user, uint amount, uint balance);

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

	function withdrawEther(uint _amount) public {
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
}