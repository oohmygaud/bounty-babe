import React, { Component } from 'react';
import BountyCard from './BountyCard';

class BountiesList extends Component {
    
    render() {
        return (
            <div>
                {
                    this.props.ids.map((id) => (
                    <BountyCard key={id} id={id} contract={this.props.contract} bounty={this.props.bounties[id]}/>
                    ))}
            </div>
        )
    }
}

export default BountiesList