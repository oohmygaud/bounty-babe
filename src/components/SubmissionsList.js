import React, { Component } from 'react';
import SubmissionCard from './SubmissionCard';

class SubmissionsList extends Component {
    
    render() {
        return (
            <div>
                {
                    this.props.bounty.submissionIds.map((id) => <SubmissionCard 
                            key={id} id={id} 
                            contract={this.props.contract}
                            bounty={this.props.bounty} 
                            submission={this.props.submissions[id.toNumber()]}
                        />
                    )
                }
            </div>
        )
    }
}

export default SubmissionsList