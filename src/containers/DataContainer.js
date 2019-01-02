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
            var openEvent = instance.Open();

            openEvent.watch((error, result) => {
                console.log("Open event", error, result);
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
        })

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
            <BountiesList contract={this.BountyBuddy} ids={this.getBountyIdsList()} bounties={this.state.bounties}/>
         </div>
    }
}

export default DataContainer
