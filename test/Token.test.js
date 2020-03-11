const Token = artifacts.require('./Token')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', (accounts) => {
	const name = 'MGToken'
	const symbol = 'MGT'
	const totalSupply = "1000000000000000000000000"
	const decimals = '18'
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

		it('tracks the symbol', async () => {
			const result = await token.symbol()
			result.should.equal(symbol)
		})

		it('tracks the decimals', async () => {
			const result = await token.decimals()
			result.toString().should.equal(decimals)
		})

		it('tracks the total supply', async () => {
			const result = await token.totalSupply()
			result.toString().should.equal(totalSupply)

		})
	})
})