# bounty-babe

Bounty Babe is a bounty dApp. First, a user can create a bounty for some work to be done for an amount of money. Other users can make submissions to the bounty, which can be accepted or rejected by the bounty creator. The user whose submission was accepted can then withdraw the amount they agreed on as payment for their work.

Bounty Babe includes the solidity contract, truffle javascript tests, and a react GUI for testing and using the contract via web3.js and metamask.

# Getting Started Locally

First, clone the project to your computer by running `git clone git@github.com:oohmygaud/bounty-babe.git` in a terminal window.
To install ganache-cli, run `npm install -g ganache-cli`. Next, install truffle by entering `npm install -g truffle`. Next enter `npm install -g truffle-hdwallet-provider`. Run `ganache-cli` in one terminal window. Migrate contracts to the system by opening another terminal window and enter `truffle migrate`. Then enter `truffle deploy`. To run the web interface, ensure prerequisites are installed with `npm install` and then just `npm start` -- note that you must have the Metamask browser extension installed to use the web interface.

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

# Built With

Truffle - development environment

Ganache - test network

Solidity - code language

Metamask - browser extension

React - javascript framework

# Author

Audrey Worsham
