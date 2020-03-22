pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Token {
	using SafeMath for uint;
	string public name = "MGToken";
	string public symbol = "MGT";
	uint256 public decimals =	18;
	uint256 public totalSupply;
	// track balances
	mapping(address => uint256) public balanceOf;
	//1.st Adr is the person who is goning to approve the token (deployer) 
	//hierin zit een andere mapping
	//allowance is the amount of tokens the exchange is allowed to spend
	//mapping(address=> uint256) zijn alle plaatsen waar de deployer tokens heeft in dit gevasl maar 1
	// 1 exchange en het bedrag wat ze mogen uitgeven.	
	mapping(address => mapping(address=> uint256)) public allowance;
	//send tokens
//Events are indexed to help find the events only pertained to us so we could filter this from to how many
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
		constructor() public {
		totalSupply = 1000000 * (10**decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value);
		_transfer(msg.sender, _to, _value);
		return true;
		
	}

	function _transfer(address _from, address _to, uint256 _value) internal {
		require(_to != address(0));
		balanceOf[_from] = balanceOf[_from].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(_from, _to, _value);		
	}

	//Approve tokens
function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
	//Transfer from
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		require(_value <= balanceOf[_from]);
		require(_value <= allowance[_from][msg.sender]);
		allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
		_transfer(_from, _to, _value);
		return true;
	}

}

