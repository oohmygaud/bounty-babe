import React, { Component } from 'react';

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
        {this.props.bounty.description}</h3></div>
        <div style={{float:"right"}}><h3>Amount: {this.props.bounty.amount.toString()} wei</h3></div>
        <div>
            {
                (this.state.visible) ?
                <div>Submissions List
                    
                </div> : null
            }
        </div>
        </div>
    }
}