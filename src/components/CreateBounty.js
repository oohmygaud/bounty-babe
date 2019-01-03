import React, { Component } from 'react';

class CreateBounty extends Component {
    constructor(props) {
      super(props);
      this.state = {
          visible: false,
          description: '',
          amount: 0
      };
  
      this.handleChangeDescription = this.handleChangeDescription.bind(this);
      this.handleChangeAmount = this.handleChangeAmount.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeDescription(event) {
      this.setState({description: event.target.value});
    }
  
    handleChangeAmount(event) {
        this.setState({amount: event.target.value});
    }

    handleSubmit(event) {
      event.preventDefault();
      if (this.state.description.length === 0 || this.state.amount < 1)
        return alert("Invalid input")
      console.log('A bounty was submitted: ', this.state, window.web3.eth.accounts[0]);
      this.props.contract.deployed().then((instance) => {
        instance.createBounty(this.state.description,
        {value: this.state.amount, from: window.web3.eth.accounts[0]});
        this.setState({description: '', amount: 0, visible: false});
      })
    }
  
    render() {
      if(!this.state.visible)
        return <input type="button" onClick={() => this.setState({visible: true})} value="Create a Bounty" />
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Description:
            <input type="text" value={this.state.description} onChange={this.handleChangeDescription} />
          </label>
          <br />
          <label>
              Amount(wei):
          <input type="number" value={this.state.amount} onChange={this.handleChangeAmount} />
          </label>
          <br />

          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
export default CreateBounty