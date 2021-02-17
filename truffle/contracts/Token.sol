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

	// Events
	event Transfer(address indexed from, address indexed to, uint256 value);

	constructor() public {
		totalSupply = 1000000 * (10 ** decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	// Send Tokens
	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(_to != address(0));
		require(balanceOf[msg.sender] >= _value);

		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);

		emit Transfer(msg.sender, _to, _value);

		return true;
	}

}