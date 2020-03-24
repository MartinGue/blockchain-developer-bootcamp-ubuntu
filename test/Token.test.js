import { tokens, EVM_REVERT } from './helpers' //this works tru truffle config babel imports

const Token = artifacts.require('./Token')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', ([deployer, receiver, exchange]) => {
	const name = 'MGToken'
	const symbol = 'MGT'
	const decimals = '18'
	const totalSupply = tokens(1000000).toString()
	let token

	beforeEach(async () => {
		//Fetch token from blockchain
		token = await Token.new()
	})

	describe('deployment', () => {
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
	})

	describe('Sending 100 MGTokens from deployer to receiver', async () => {
		let result
		let amount

		beforeEach(async () => {
			amount = tokens(100)
			await token.approve(exchange, amount, { from: deployer })
		})

	describe('success', async () => {
	  beforeEach(async () => {
		amount = tokens(100)
		result = await token.transferFrom(deployer, receiver, amount, { from: exchange } )
		})			
		//After transfer
	   it('stuurt honderd MGTokens ', async() => {
		 let balanceOf		
		 balanceOf = await token.balanceOf(deployer)
		 balanceOf.toString().should.equal(tokens(999900).toString())
		 console.log("deployer balans na transfer", web3.utils.fromWei(balanceOf.toString(),'ether'),"MGT")
		 balanceOf = await token.balanceOf(receiver)
		 balanceOf.toString().should.equal(tokens(100).toString())
		 console.log("receiver balans na transfer", web3.utils.fromWei(balanceOf.toString(),'ether'),"MGT")
       })

       it ('resets de allowance voor delegated tokens die de exchange mag uitgeven', async () => {
			//For the deployer what is the provisioned amount allowed to this exchange
			const allowance = await token.allowance(deployer, exchange)
			//this amount will be converted to string
			allowance.toString().should.equal('0')
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

		it('weigert ongeldige ontvangers', async () => {
			await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
		})
	})	
  })
})
	describe('Tokens Goedkeuren',() => {
		let result
		let amount

		beforeEach(async () => {
			amount = tokens(100)
			result = await token.approve(exchange, amount, { from: deployer })
		})

	describe('success', () => {
		it ('wijst een allowance for delegated tokens toe die de exchange mag uitgeven', async () => {
			//For the deployer what is the provisioned amount allowed to this exchange
			const allowance = await token.allowance(deployer, exchange)
			//this amount will be converted to string
			allowance.toString().should.equal(amount.toString())
		})

		it('emits een Approval event', async () => {
			const log = result.logs[0]
			log.event.should.eq('Approval')
			const event = log.args
			event.owner.toString().should.equal(deployer, console.log('token-owner is correct'))
			event.spender.should.equal(exchange, console.log('de exchange is correct'))
			event.value.toString().should.equal(amount.toString(), console.log('de waarde is correct'))
		})
	})

	describe('faillure', async () => {	
	 it('rejects invalid spenders' , async () => {
		 await token.approve(0x0, amount, { from: deployer }).should.be.rejected
	})


	 describe('delegated token transfers', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = tokens(100)
      await token.approve(exchange, amount, { from: deployer })
    })

    describe('success', async () => {
      beforeEach(async () => {
        result = await token.transferFrom(deployer, receiver, amount, { from: exchange })
      })

      it('transfers token balances', async () => {
        let balanceOf
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        balanceOf = await token.balanceOf(receiver)
        balanceOf.toString().should.equal(tokens(100).toString())
      })

      it('resets the allowance', async () => {
        const allowance = await token.allowance(deployer, exchange)
        allowance.toString().should.equal('0')
      })

      it('emits a Transfer event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Transfer')
        const event = log.args
        event.from.toString().should.equal(deployer, 'from is correct')
        event.to.should.equal(receiver, 'to is correct')
        event.value.toString().should.equal(amount.toString(), 'value is correct')
      })
    })	
     describe('failure', async () => {
	  it('weigert ongeldig bedrag', async () => {
		
		const invalidAmount = tokens(100000000000)//greater than total supply
		await token.transfer(deployer, receiver, invalidAmount, { from: exchange }).should.be.rejected


		it('weigert ongeldige ontvangers', async () => {
			await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected
		  })
   	   })		
     })
   }) 
  })
 })
})

 