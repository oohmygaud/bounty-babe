# bounty-babe

Bounty Babe is a bounty dApp. First, a user can create a bounty for some work to be done for an amount of money. Other users can make submissions to the bounty, which can be accepted or rejected by the bounty creator. The user whose submission was accepted can then withdraw the amount they agreed on as payment for their work.

Bounty Babe includes the solidity contract, a library contract, truffle javascript tests, and a react GUI for testing and using the contract via web3.js and metamask.

The contract code is verified on etherscan on the rinkeby testnet at this address `0x66d47A99c743C6f1B07Af3Bb2226ca442C99010b` .

Link to demo version: https://oohmygaud.github.io/bounty-babe

# Getting Started Locally

First, clone the project to your computer by running `git clone git@github.com:oohmygaud/bounty-babe.git` in a terminal window. Ensure prerequisites are installed with `npm install`. Run `ganache-cli` in a terminal window. Migrate contracts to the system by opening another terminal window and enter `truffle migrate`. To deploy to the local network, enter  `truffle deploy`. To deploy to the rinkeby network, enter `truffle deploy --network=rinkeby`. To run the web interface, `npm start` -- note that you must have the Metamask browser extension installed to use the web interface.

# Running the tests

`truffle test`

Test 1 makes sure a user can create a bounty.

Test 2 makes sure a user can create a submission for a bounty.

Test 3 makes sure the user can retrieve the number of submissions for each bounty.

Test 4 makes sure you can retrieve the number of bounties for each user.

Test 5 makes sure the owner of a bounty can accept a submission.

Test 6 makes sure the owner of a bounty can reject a submission.

Test 7 makes sure the submitter can withdraw payment once their work is accepted.

# Deployment

`truffle deploy` -- deploys contracts to local ganache network

`truffle deploy --network=rinkeby` -- to deploy the contracts to rinkeby

The project is deployed using IPFS at `https://gateway.ipfs.io/ipns/QmZvZ7Tm6bAm4nEDxYumhE1EoZFgrRx7ew8u2V5uCHqqgA`.

Because IPFS caches content close to where it is used the most, it may be slow to load from the `gateway.ipfs.io` site -- you can run a local IPFS node and execute

`ipfs get /ipns/QmZvZ7Tm6bAm4nEDxYumhE1EoZFgrRx7ew8u2V5uCHqqgA`

followed by

`ipfs add ./docs`

to cache the page locally and then view it at

http://localhost:8080/ipns/QmZvZ7Tm6bAm4nEDxYumhE1EoZFgrRx7ew8u2V5uCHqqgA/.

# Built With

Truffle - development environment

Ganache - test network

Solidity - code language

Metamask - browser extension

React - javascript framework

# Author

Audrey Worsham
