import { tokens, EVM_REVERT } from './helpers' //this works tru truffle config babel imports

const Token = artifacts.require('./Token')

require('chai')
	.use(require('chai-as-promised'))
	.should()



contract('Token', ([deployer, receiver]) => {
	const name = 'MGToken'
	const symbol = 'MGT'
	const decimals = '18'
	const totalSupply = tokens(1000000).toString()
	let token

	beforeEach(async () => {
		//Fetch token from blockchain
		token = await Token.new()
	})

	describe('deployment', () =>{
		it('vergelijkt de naam', async () =>{ 			
			// Read token name here
			const result = await token.name()
			// The tokenname is "Mijn Naam"
			result.should.equal(name)
		})

		it('vergelijkt het symbol', async () => {
			const result = await token.symbol()
			result.should.equal(symbol)
		})

		it('controleert the decimals', async () => {
			const result = await token.decimals()
			result.toString().should.equal(decimals)
		})

		it('volgt total supply', async () => {
			const result = await token.totalSupply()
			result.toString().should.equal(totalSupply.toString())
		})
		
		it('wijst total supply toe aan de deployer van het MGT-token', async () => {
			const result = await token.balanceOf(deployer)
			result.toString().should.equal(totalSupply.toString())
		})
	

	

		it('token balans voor de transactie', async() => {
			let balanceOf			
			// Before Transfer			
			balanceOf =await token.balanceOf(deployer)
			console.log("deployer balans voor transfer:", web3.utils.fromWei(balanceOf.toString(),'ether'),"MGT")
			balanceOf = await token.balanceOf(receiver)
			console.log("receiver balans voor transfer", web3.utils.fromWei(balanceOf.toString(),'ether'),"MGT")
			//Transfer 

	describe('Sending 100 MGT-tokens from deployer to receiver', async () => {
		let result
		let amount

	 describe('success', async () => {
		beforeEach(async () => {
			amount = tokens(100)
			result = await token.transfer(receiver, amount, { from: deployer } )
		})			
			//After transfer
			it('stuurt honderd tokens ', async() => {
			let balanceOf		
			balanceOf = await token.balanceOf(deployer)
			balanceOf.toString().should.equal(tokens(999900).toString())
			console.log("deployer balans na transfer", web3.utils.fromWei(balanceOf.toString(),'ether'),"MGT")
			balanceOf = await token.balanceOf(receiver)
			balanceOf.toString().should.equal(tokens(100).toString())
			console.log("receiver balans na transfer", web3.utils.fromWei(balanceOf.toString(),'ether'),"MGT")


		})
			it('emits een transfer event', async () => {
			const log = result.logs[0]
			log.event.should.eq('Transfer')
			const event = log.args
			event.from.toString().should.equal(deployer,console.log('afzender is correct'))
			event.to.toString().should.equal(receiver, console.log('ontvanger is correct'))
			event.value.toString().should.equal(amount.toString(), console.log('waarde is correct'))
	  	})
	  })


  describe('faillure', async () => {
		
		it('weigert ongeldig bedrag', async () => {
			let invalidAmount
			invalidAmount = tokens(100000000000)//greater than total supply
			await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)

			invalidAmount = tokens(10000000000)
			await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT)
		})

		it('weigert ongelige ontvangers', async () => {
			await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
		})

		})	
		})
	})
	})	

	})

 