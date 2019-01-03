import React, { Component } from 'react';

class CreateSubmission extends Component {
    constructor(props) {
      super(props);
      this.state = {
          visible: false,
          description: '',
          
      };
  
      this.handleChangeDescription = this.handleChangeDescription.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeDescription(event) {
      this.setState({description: event.target.value});
    }

    handleSubmit(event) {
      event.preventDefault();
      if (this.state.description.length === 0)
        return alert("Invalid input")
      console.log('A submission has been made: ', this.state, window.web3.eth.accounts[0]);
      this.props.contract.deployed().then((instance) => {
        instance.createSubmission(this.props.bountyId, this.state.description,
        {from: window.web3.eth.accounts[0]});
        this.setState({description: '', visible: false});
      })
    }
  
    render() {
      if(!this.state.visible)
        return <input type="button" onClick={() => this.setState({visible: true})} value="Create a Submission" />
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Description:
            <input type="text" value={this.state.description} onChange={this.handleChangeDescription} />
          </label>
          <br />

          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
export default CreateSubmission