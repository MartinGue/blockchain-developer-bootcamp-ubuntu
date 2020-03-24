import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from './helpers' //this works tru truffle config babel imports

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
	//declare variables
	let token
	let exchange
	let feePercent = 10

	beforeEach(async () => {
		//Fetch Token  from blockchain put them in a local variable
		token = await Token.new()
		// send some tokens to user1
		token.transfer(user1, tokens(100), { from: deployer })

		// Fetch Exchange and put them in a local variable called exchange
		exchange = await Exchange.new(feeAccount, feePercent)
	})

	describe('deployment', () => {
	 it('tracks the fee account', async () => {
	 	const result = await exchange.feeAccount()
	 	result.should.equal(feeAccount)
	 })
	 it('tracks the fee percent', async () => {
	 	const result = await exchange.feePercent()
	 	result.toString().should.equal(feePercent.toString())
	 })
    })
// reverts when ether is send to the exchange
    describe('fallback', () => {
    	it('reverts when Ether is sent', async () => {
    		await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_REVERT)
    	})
    })

	describe('depositing Ether', async () => {
		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({ from : user1, value: amount})
		})

		it('tracks the Ether deposit', async () => {
			const balance = await exchange.tokens(ETHER_ADDRESS, user1)
			balance.toString().should.equal(amount.toString())
		})
			it('emits a Deposit event', async () => {
	        const log = result.logs[0]
	        log.event.should.eq('Deposit')
	        const event = log.args
	        event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
	        event.user.should.equal(user1, 'user address is correct')
	        event.amount.toString().should.equal(amount.toString(), 'amount is correct')        
	        event.balance.toString().should.equal(amount.toString(), 'balance is correct')
      })
	})


//we need to approve the tokens before transfer
   	describe('depositing Tokens', () => {
   		let result
   		let amount


   		beforeEach(async () => {
   			amount = tokens(10)
   			await token.approve(exchange.address, amount, { from: user1 })
   			result = await exchange.depositToken(token.address, amount, { from: user1 })
   		})
   	 describe('succes', () => {
	 	it('tracks the token deposit', async () => {
	 		//checks the exchange token balance
	 		let balance
	 		balance = await token.balanceOf(exchange.address)
	 		balance.toString().should.equal(amount.toString())
	 		// check tokens on exchange
	 		balance = await exchange.tokens(token.address, user1)
	 		balance.toString().should.equal(amount.toString()) 
	 	})

	 	it('emits a Deposit event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Deposit')
        const event = log.args
        event.token.should.equal(token.address, 'token address is correct')
        event.user.should.equal(user1, 'user address is correct')
        event.amount.toString().should.equal(amount.toString(), 'amount is correct')        
        event.balance.toString().should.equal(amount.toString(), 'balance is correct')
      })
    })	


	 
	 describe('failure', () => {
	 	it('rejects Ether deposits', async() => {
	 		//TO DO fill me in ...
	 		await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
	 	})

	 	it('fails when no tokens are appoved', async () => {
	 		//Doin't approve any tokens before depositing
	 		await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be .rejectedWith(EVM_REVERT)
	 	})

	 })
 })
})	
 