import React, { Component } from 'react';
import TruffleContract from 'truffle-contract';
import BountyBuddyArtifact from '../../build/contracts/BountyBuddy.json';
import CreateBounty from '../components/CreateBounty';
import BountiesList from '../components/BountiesList';

class DataContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bounties: {},
            submissions: {},
            loading: false,
            loaded: false,
            numBounties: -1
	    
	};
    }

    componentWillMount() {
	    this.getContractInstance();
    }

    getContractInstance() {
        this.BountyBuddy = TruffleContract(BountyBuddyArtifact);
        this.BountyBuddy.setProvider(window.web3.currentProvider);
        this.getBountiesAndSubmissions();

        this.BountyBuddy.deployed().then(instance => {

            instance.Open().watch((error, result) => {
                console.log("Open event", error, result);
                this.getBountiesAndSubmissions();
            })
            instance.Submitted().watch((error, result) => {
                console.log("Submitted event", error, result);
                this.getBountiesAndSubmissions();
            })
            instance.Accepted().watch((error, result) => {
                console.log("Accepted event", error, result);
                this.getBountiesAndSubmissions();
            })
            instance.Rejected().watch((error, result) => {
                console.log("Rejected event", error, result);
                this.getBountiesAndSubmissions();
            })
            instance.Paid().watch((error, result) => {
                console.log("Paid event", error, result);
                this.getBountiesAndSubmissions();
            })
        })
    }
    
    getBountiesAndSubmissions() {
        this.setState({loading: true});
        this.BountyBuddy.deployed().then(function(instance) {
            return instance.getBountyCount.call();
        }).then(result => {
            this.setState({loading: false, loaded: true, numBounties: result.toNumber()})
        });
    }

    getBountyIdsList() {
        return [...Array(this.state.numBounties).keys()];
    }

    fetchBounty(id) {
        this.BountyBuddy.deployed().then(instance => {
            return instance.fetchBounty(id)
        }).then(result => {
            let newState = Object.assign({}, this.state)
            let bounty = {
                bountyId: result[0],
                creator: result[1],
                amount: result[2],
                description: result[3],
                numSubmissions: result[4],
                bountyState: result[5]
            }
            newState.bounties[id] = bounty
            this.setState(newState)
            this.fetchAllSubmissionsForBounty(bounty)
        })

    }

    fetchSubmission(id) {
        this.BountyBuddy.deployed().then(instance => {
            return instance.fetchSubmission(id)
        }).then(result => {
            let newState = Object.assign({}, this.state)
            let submission = {
                bountyId: result[0],
                submissionId: result[1],
                submitter: result[2],
                description: result[3],
                submissionState: result[4]
            }
            newState.submissions[id] = submission
            this.setState(newState)
        })
    }

    fetchAllSubmissionsForBounty(bounty) {
        let index;
        bounty.submissionIds = [];
        for (index = 0; index < bounty.numSubmissions; index++) {
            let fetchIndex = index;
          this.BountyBuddy.deployed().then(instance => {
            return instance.getBountySubmissionIdByIndex(bounty.bountyId.toNumber(), fetchIndex)
          }).then(submissionId => {
            this.fetchSubmission(submissionId)
            bounty.submissionIds.push(submissionId)
            let newState = Object.assign({}, this.state)
            newState.bounties[bounty.bountyId] = bounty
            this.setState(newState)
          })
        }
    }

    getBountyList() {
        this.getBountyIdsList().map(id => {
            if(!this.state.bounties[id])
                return this.fetchBounty(id)
            return null
        })
    }

    render() {
        if (this.state.loading || !this.state.loaded)
            return <div>loading...</div>
        this.getBountyList();
        return <div> loaded! {this.state.numBounties} Bounties
            <CreateBounty contract={this.BountyBuddy} />
            <BountiesList contract={this.BountyBuddy} ids={this.getBountyIdsList()} bounties={this.state.bounties} submissions={this.state.submissions}/>
         </div>
    }
}

export default DataContainer
