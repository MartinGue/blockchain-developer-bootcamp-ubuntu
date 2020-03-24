pragma solidity ^0.5.0;
import './Token.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// Deposit & Withdraw funds
// Manage orders
// Handle Trades charge fees

//TODO

// Set the fee and the fee-account upon depoyment
//[ ] Deposit Ether
//[ ] Withdraw Ether
//[ ] Deposit Tokens
//[ ] Withdraw Tokens
//[ ] Check Balaqnces
//[ ] Make order
//[ ] Cancel Order
//[ ] Fill order
//[ ] Charge fees


contract Exchange {
	using SafeMath for uint;

	address public feeAccount; //the account that recei9ves the exchange fees
	uint256 public feePercent;
	//the ether-address is a blank address and is stored in the mapping below
	address constant ETHER = address(0);
	//keep track of ether inside the tokens mapping to save blockcahin-space
	mapping(address => mapping(address => uint256)) public tokens;

	event Deposit(address token, address user, uint256 amount, uint256 balance);

	constructor (address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}
//reverts when ether is send directly to the exchange
	function () external {
		revert();
	}

	function depositEther() payable public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);		
	}	

	function depositToken(address _token, uint _amount) public {
		//don't allow ether deposits
		require(_token != ETHER);
		//Which Token (address _token)
		//How much (uint _amount)
		//send accessed  from the import tokens to this contract:address(this)
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		//Manage deposit
		//Emit event
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

	}
}



