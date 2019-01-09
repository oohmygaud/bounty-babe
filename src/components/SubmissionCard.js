import React, { Component } from 'react';

export default class SubmissionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    };

    acceptSubmission() {
        this.props.contract.deployed().then((instance) => {
            instance.acceptSubmission(this.props.bounty.bountyId, this.props.submission.submissionId,
            {from: window.web3.eth.accounts[0]});
          })
    };

    rejectSubmission() {
        this.props.contract.deployed().then((instance) => {
            instance.rejectSubmission(this.props.bounty.bountyId, this.props.submission.submissionId,
            {from: window.web3.eth.accounts[0]});
          })
    };

    withdrawPayout() {
        this.props.contract.deployed().then((instance) => {
            instance.withdrawBountyAmount(this.props.submission.submissionId, {from: window.web3.eth.accounts[0]});
        })
    };

    render() {
        if (!this.props.submission)
          return <div>loading...</div>

        let color = "#d6e4f9";

        if (this.props.submission.submissionState.toString() === "1")
        {
          color = "#c9ff9b"
        };

        if (this.props.submission.submissionState.toString() === "2")
        {
          color = "#fca49c"
        };

        if (this.props.submission.submissionState.toString() === "3")
        {
          color = "#3b993a"
        };

        let showControls = (this.props.bounty.bountyState.toNumber() === 0
            && this.props.submission.submissionState.toNumber() === 0
            && window.web3.eth.accounts[0] === this.props.bounty.creator);

        let showPayout = (this.props.submission.submissionState.toNumber() === 1
            && window.web3.eth.accounts[0] === this.props.submission.submitter);

        return (
          <div style={{
            width:"90%",
            margin:5,
            padding: 10,
            border: "1px solid grey",
            background: color
          }}>

        {this.props.submission.description}
        <br />
        By: {this.props.submission.submitter}

        {showControls ? <div>
          <input type="button" onClick={() => this.acceptSubmission()} value="Accept" />
          <input type="button" onClick={() => this.rejectSubmission()} value="Reject" />
        </div> : null}

        {showPayout ? <div>
          <input type="button" onClick={() => this.withdrawPayout()} value="Withdraw" />
        </div> : null}
         
        </div>
        )
    }
}
