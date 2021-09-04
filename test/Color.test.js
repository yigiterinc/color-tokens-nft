const { assert } = require('chai')

const Color = artifacts.require('./Color.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Color', (accounts) => {
  describe('deployment', async () => {
    let contract

    before(async () => {
      contract = await Color.deployed()
    })

    it('deploys successfully', async () => {
      const address = contract.address
      assert.isOk(address)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Color')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'COLOR')
    })

    it('creates a new token', async () => {
      let totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, 0)
      const result = await contract.mint('#4211EE')
      totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(
        event.from,
        '0x0000000000000000000000000000000000000000',
        'from is correct',
      )
      assert.equal(event.to, accounts[0], 'to is correct')
    })

    it('does not mint the same token twice', async () => {
      await contract.mint('#4211EE')
      await contract.mint('#4211EE').should.be.rejected
    })
  })
})
