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
    })
  })
})
