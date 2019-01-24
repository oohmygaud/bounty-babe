import React, { Component } from 'react'
import { Link } from 'react-router'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hasWeb3 : false,
      account : null
    }

  }

  componentWillMount() {
    this.loadAccounts()
    setTimeout(() => this.loadAccounts(), 500)
    setInterval(() => this.loadAccounts(), 1000)
  }

  loadAccounts() {
    if(window.web3.eth.accounts[0] !== this.state.account)
      this.setState({
        hasWeb3: true,
        account: window.web3.eth.accounts[0]
      })
  }

  render() {
    if(!this.state.hasWeb3)
      return <div><h3 style={{color: 'red'}}>Not connected...</h3></div>
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">BountyBabe By Audrey</Link>
          <ul className="pure-menu-list navbar-right">
          <span>
        <li className="pure-menu-item" style={{fontSize: "70%", color: "white"}}>
          Your Address: {window.web3.eth.accounts[0] || "Please log in to metamask"}
        </li>
      </span>
          </ul>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

export default App
