var BountyBuddy = artifacts.require("./BountyBuddy.sol");

contract('BountyBuddy', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]
  const charlie = accounts[3]
  const dave = accounts[4]
  const helen = accounts[5]
  const susan = accounts[6]
  

  it("...should let a user create a bounty.", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = web3.toWei(0.1, "ether")
    const description = "My description";

    const tx = await bountyBuddyInstance.createBounty(description, {from: alice, value: amount})
    if (tx.logs[0].event == "Open") {
      bountyId = tx.logs[0].args.bountyId.toString(10)
      eventEmitted = true
    }
    const bountyCount = await bountyBuddyInstance.getBountyCount.call()

    const result = await bountyBuddyInstance.fetchBounty.call(bountyId)

    assert.equal(result[0], bountyId, 'the bounty Id should match')
    assert.equal(result[1], alice, 'the address does not match the creator address')
    assert.equal(result[2].toString(10), amount, 'the amount of the last added bounty does not match the expected value')
    assert.equal(result[3], description, 'the desription added does not match the expected value')
    assert.equal(result[4].toString(10), 0, 'the number of submissions should be 0')
    assert.equal(result[5].toString(10), 0, 'the state of the bounty should be "Open"')

    assert.equal(bountyCount, 1, 'bounty count should be 1')
    assert.equal(bountyId, 0, 'bounty Id should be 0')
    assert.equal(eventEmitted, true, 'creating a bounty should emit an Open event')
  
  });

  it("...should let a user create a submission for review.", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = web3.toWei(0.1, "ether")
    const description = "My description"

    const bountyTx = await bountyBuddyInstance.createBounty(description, {from: alice, value: amount})
    if (bountyTx.logs[0].event == "Open") {
      bountyId = bountyTx.logs[0].args.bountyId.toString(10)
    }

    const submissionTx = await bountyBuddyInstance.createSubmission(bountyId, description, {from: bob})
    if (submissionTx.logs[0].event == "Submitted") {
      submissionId = submissionTx.logs[0].args.submissionId.toString(10)
      eventEmitted = true
    }

    const submissionCount = await bountyBuddyInstance.getSubmissionCount.call()

    const result = await bountyBuddyInstance.fetchSubmission.call(submissionId)

    assert.equal(result[0], bountyId, 'the bounty Id should match')
    assert.equal(result[1], submissionId, 'the submission Id should match')
    assert.equal(result[2], bob, 'the address does not match the submitter address')
    assert.equal(result[3], description, 'the description addded does not match the expected value')
    assert.equal(result[4].toString(10), 0, 'the state of the bounty should be "Submitted"')

    assert.equal(submissionCount, 1, 'submission count should be 1')
    assert.equal(submissionId, 0, 'submission Id should be 0')
    assert.equal(eventEmitted, true, 'creating a submission should emit a Submitted event')

  })

  it("...should let a user see a list of submissions for a bounty", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = 1;
    const description = "My description"

    const bounty1id = (
      await bountyBuddyInstance.createBounty(description, {from: alice, value: amount})
    ).logs[0].args.bountyId.toString(10)

    const bounty2id = (
      await bountyBuddyInstance.createBounty(description, {from: alice, value: amount})
    ).logs[0].args.bountyId.toString(10)

    const submission1id = (
      await bountyBuddyInstance.createSubmission(bounty1id, description, {from: bob})
    ).logs[0].args.submissionId.toString(10)

    const submission2id = (
      await bountyBuddyInstance.createSubmission(bounty2id, description, {from: bob})
    ).logs[0].args.submissionId.toString(10)

    const submission3id = (
      await bountyBuddyInstance.createSubmission(bounty1id, description, {from: bob})
    ).logs[0].args.submissionId.toString(10)

    assert.equal(await bountyBuddyInstance.getBountySubmissionCount.call(bounty1id), 2, 'bounty 1 submission count should equal 2')
    assert.equal(await bountyBuddyInstance.getBountySubmissionCount.call(bounty2id), 1, 'bounty 2 submission count should equal 1')
    assert.equal(await bountyBuddyInstance.getBountySubmissionIdByIndex.call(bounty1id, 0), submission1id, 'should equal submission1id')
    assert.equal(await bountyBuddyInstance.getBountySubmissionIdByIndex.call(bounty1id, 1), submission3id, 'should equal submission3id')
    assert.equal(await bountyBuddyInstance.getBountySubmissionIdByIndex.call(bounty2id, 0), submission2id, 'should equal submission2id')
    
  })

  it("...should let a user see how many bounties they have", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = 1;
    const description = "My description"

    const user1bounty1 = (
      await bountyBuddyInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    const user1bounty2 = (
      await bountyBuddyInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    const user2bounty1 = (
      await bountyBuddyInstance.createBounty(description, {from: dave, value: amount})
    ).logs[0].args.bountyId.toString(10)

    assert.equal(await bountyBuddyInstance.userNumBounties.call(charlie), 2, 'number of bounties for charlie is 2')
    assert.equal(await bountyBuddyInstance.userNumBounties.call(dave), 1, 'number of bounties for dave is 1')
    assert.equal(await bountyBuddyInstance.getUserBountyIdByIndex.call(charlie, 0), user1bounty1, 'user bounty id does not match expected value')
    assert.equal(await bountyBuddyInstance.getUserBountyIdByIndex.call(charlie, 1), user1bounty2, 'user bounty id does not match expected value')
    assert.equal(await bountyBuddyInstance.getUserBountyIdByIndex.call(dave, 0), user2bounty1, 'user bounty id does not match expected value')
    
  })

  it("...should let the bounty owner accept a submission", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = 1;
    const description = "My description"

    const bounty1 = (
      await bountyBuddyInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    const submission1 = (
      await bountyBuddyInstance.createSubmission(bounty1, description, {from: dave})
    ).logs[0].args.submissionId.toString(10)
    
    let reverted = false;
    try {
      const failTx = await bountyBuddyInstance.acceptSubmission(bounty1, submission1, {from: dave});
    } catch (e) {
      reverted = true;
    }
    assert.equal(reverted, true, "If Dave tries to accept his own submission, revert")
    
    const failBountyResult = await bountyBuddyInstance.fetchBounty.call(bounty1);
    const failSubmissionResult = await bountyBuddyInstance.fetchSubmission.call(submission1);

    assert.equal(failBountyResult[5].toString(10), 0, 'the state of the bounty should be "Open"')
    assert.equal(failSubmissionResult[4].toString(10), 0, 'the state of the submission should be "Submitted"')

    const acceptTx = await bountyBuddyInstance.acceptSubmission(bounty1, submission1, {from:charlie});

    assert.equal(acceptTx.logs[0].event, "Accepted", "Accepted event should be emitted");
    assert.equal(acceptTx.logs[1].event, "Closed", "Closed event should be emitted");

    const acceptedBountyResult = await bountyBuddyInstance.fetchBounty.call(bounty1);
    const acceptedSubmissionResult = await bountyBuddyInstance.fetchSubmission.call(submission1);

    assert.equal(acceptedBountyResult[5].toString(10), 1, 'the state of the bounty should be "Closed"')
    assert.equal(acceptedSubmissionResult[4].toString(10), 1, 'the state of the submission should be "Accepted"')

  })

  it("...should let the bounty owner reject a submission", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = 1;
    const description = "My description"

    const bounty1 = (
      await bountyBuddyInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    const submission1 = (
      await bountyBuddyInstance.createSubmission(bounty1, description, {from: dave})
    ).logs[0].args.submissionId.toString(10)
    
    let reverted = false
    try {
      const failTx = await bountyBuddyInstance.rejectSubmission(bounty1, submission1, {from: dave})
    } catch (e) {
      reverted = true
    }
    assert.equal(reverted, true, "If Dave tries to reject his own submission, revert")
    
    const failBountyResult = await bountyBuddyInstance.fetchBounty.call(bounty1)
    const failSubmissionResult = await bountyBuddyInstance.fetchSubmission.call(submission1)

    assert.equal(failBountyResult[5].toString(10), 0, 'the state of the bounty should be "Open"')
    assert.equal(failSubmissionResult[4].toString(10), 0, 'the state of the submission should be "Submitted"')

    const rejectTx = await bountyBuddyInstance.rejectSubmission(bounty1, submission1, {from: charlie})

    assert.equal(rejectTx.logs[0].event, "Rejected", "Rejected event should be emitted")

    const rejectedBountyResult = await bountyBuddyInstance.fetchBounty.call(bounty1);
    const rejectedSubmissionResult = await bountyBuddyInstance.fetchSubmission.call(submission1);

    assert.equal(rejectedSubmissionResult[4].toString(10), 2, 'the state of the submission should be "Rejected"')

  })

  it("...should pay the submitter the accepted bounty", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amountWei = 500000000000000000; // 0.5 ether
    const description = "My description"

    const bounty1 = (
      await bountyBuddyInstance.createBounty(description, {from: helen, value: amountWei})
    ).logs[0].args.bountyId.toString(10)

    const submission1 = (
      await bountyBuddyInstance.createSubmission(bounty1, description, {from: susan})
    ).logs[0].args.submissionId.toString(10)
    
    const acceptTx = await bountyBuddyInstance.acceptSubmission(bounty1, submission1, {from: helen})
    
    const oldBalanceWei = (await web3.eth.getBalance(susan)).toNumber();

    const withdrawTx = await bountyBuddyInstance.withdrawBountyAmount(submission1, {from: susan})

    assert.equal(withdrawTx.logs[0].event, "Paid", "Paid event should be emitted")

    const gasPrice = (await web3.eth.getTransaction(withdrawTx.tx)).gasPrice;
    const gasUsed = withdrawTx.receipt.gasUsed;
    const gasTotal = gasPrice.mul(gasUsed);
    const newBalanceWei = (await web3.eth.getBalance(susan)).toNumber();
    const expectedWei = oldBalanceWei + amountWei - gasTotal;

    assert.equal(newBalanceWei, expectedWei, "susan should have been paid");
    
    
  })

});
