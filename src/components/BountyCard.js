import React, { Component } from 'react';
import CreateSubmission from '../components/CreateSubmission';
import SubmissionsList from '../components/SubmissionsList';

export default class BountyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,

        }
    }

    render() {
        if (!this.props.bounty)
          return <div>loading...</div>
        let color;
        if (this.props.bounty.bountyState.toString() === "0")
        {
          color = "#c9ff9b"
        }
        else
        {
          color = "#fca49c"
        }
        return <div style={{
            width:"100%",
            margin:5,
            padding: 10,
            border: "1px solid grey",
            background: color
        }}>
        <div style={{width:"50%", display:"inline-block"}}><h3>
        {
            (this.state.visible) ?
            <input type="button" onClick={() => this.setState({visible: false})} value="-" />
            :
            <input type="button" onClick={() => this.setState({visible: true})} value="+" />

        }
        {this.props.bounty.description}</h3>
        By: {this.props.bounty.creator}</div>
        <div style={{float:"right"}}><h3>Amount: {this.props.bounty.amount.toString()} wei</h3></div>
        <div>
            {
                (this.state.visible) ?
                <div>{this.props.bounty.numSubmissions.toString()} Submissions - 
                    <CreateSubmission contract={this.props.contract} bountyId={this.props.id} />
                    <SubmissionsList contract={this.props.contract} bounty={this.props.bounty} submissions={this.props.submissions}/>
                </div> : null
            }
        </div>
        </div>
    }
}