// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Token {
	using SafeMath for uint;

	string public constant name = "Khepera";
	string public constant symbol = "KHEP";
	uint256 public constant decimals = 18;
	uint256 public totalSupply;
	// Track Balances	
	mapping(address => uint256) public balanceOf;
	// Tracks the amount of tokens the exchange is allowed to spend on behalf of the sender
	mapping(address => mapping(address => uint256)) public allowance;

	// Events
	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);

	constructor() public {
		totalSupply = 1000000 * (10 ** decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	// Send Tokens
	function transfer(address _to, uint256 _value) public returns (bool success) {
		// sender has at least the amount of tokens they are trying to send
		require(balanceOf[msg.sender] >= _value);
		_transfer(msg.sender, _to, _value);
		return true;
	}

	function _transfer(address _from, address _to, uint256 _value) internal {
		require(_to != address(0)); // valid address

		balanceOf[_from] = balanceOf[_from].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);

		emit Transfer(_from, _to, _value);
	}

	// Approve Tokens
	function approve(address _spender, uint256 _value) public returns (bool success) {
		require(_spender != address(0)); // valid address
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	// Delegated Token Transfer
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		require(_value <= balanceOf[_from]);
		require(_value <= allowance[_from][msg.sender]);
		allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
		_transfer(_from, _to, _value);
		return true;
	}

}