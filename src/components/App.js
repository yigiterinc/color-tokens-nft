import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import Color from '../abis/Color.json'

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
  const [colors, setColors] = useState(null)
  const [inputColor, setInputColor] = useState(null)

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    await loadWeb3()
    await loadAccount()
    await loadContractAndColors()
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-ethereum browser detected. Try using Metamask!')
    }
  }

  const loadAccount = async () => {
    const web3 = window.web3
    // Returns the list of accounts that metamask is aware of
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
  }

  const loadContractAndColors = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId() // Get current network's id
    const networkData = Color.networks[networkId]
    if (networkData) {
      const abi = Color.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      setContract(contract)
      const totalSupply = await contract.methods.totalSupply().call()
      setTotalSupply(totalSupply)

      let colors = []
      for (let i = 0; i < totalSupply; i++) {
        let color = await contract.methods.colors(i).call()
        colors.push(color)
      }

      setColors(colors)
      console.log(colors)
    } else {
      window.alert('Smart contract not deployed to detected network')
    }
  }

  const handleFormSubmit = () => {
    mintToken(inputColor)
  }

  const mintToken = (color) => {
    // send a modifying transaction
    contract.methods
      .mint(color)
      .send({ from: account })
      .once('receipt', async () => {
        // once is a one time event listener, listening to receipt event
        setColors([...colors, color])
        const totalSupply = await contract.methods.totalSupply().call()
        setTotalSupply(totalSupply)
      })
  }

  return (
    colors && (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">{account}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => handleFormSubmit(event)}>
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="e.g. #FFFFFF"
                    onChange={(event) => setInputColor(event.target.value)}
                  />
                  <input
                    type="submit"
                    className="btn btn-block btn-primary"
                    value="MINT"
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {colors.map((color, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div></div>
                  <div style={getTokenStyles(color)}>{color}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  )
}

const getTokenStyles = (colorCode) => {
  return {
    height: '20vh',
    width: '20vh',
    borderRadius: '50%',
    display: 'inline-block',
    backgroundColor: colorCode,
  }
}

export default App
