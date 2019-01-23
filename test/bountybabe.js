var BountyBabe = artifacts.require("./BountyBabe.sol");

contract('BountyBabe', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]
  const charlie = accounts[3]
  const dave = accounts[4]
  const helen = accounts[5]
  const susan = accounts[6]
  
  // Let's test that a bounty can be created under normal conditions
  it("...should let a user create a bounty.", async() => {
    const bountyBabeInstance = await BountyBabe.deployed()

    const amount = 1
    const description = "My description";

    // Create a bounty with simple parameters
    const tx = await bountyBabeInstance.createBounty(description, {from: alice, value: amount})
    
    // Capture the event emitted
    if (tx.logs[0].event == "Open") {
      bountyId = tx.logs[0].args.bountyId.toString(10)
      eventEmitted = true
    }

    // Retrieve the bounty by the latest bountyCount (which is the ID)
    const bountyCount = await bountyBabeInstance.getBountyCount.call()
    const result = await bountyBabeInstance.fetchBounty.call(bountyId)

    // Make sure all the properties are what we expected
    assert.equal(result[0], bountyId, 'the bounty Id should match')
    assert.equal(result[1], alice, 'the address does not match the creator address')
    assert.equal(result[2].toString(10), amount, 'the amount of the last added bounty does not match the expected value')
    assert.equal(result[3], description, 'the desription added does not match the expected value')
    assert.equal(result[4].toString(10), 0, 'the number of submissions should be 0')
    assert.equal(result[5].toString(10), 0, 'the state of the bounty should be "Open"')

    // Sanity check on count, ID, and that the event was emitted
    assert.equal(bountyCount, 1, 'bounty count should be 1')
    assert.equal(bountyId, 0, 'bounty Id should be 0')
    assert.equal(eventEmitted, true, 'creating a bounty should emit an Open event')
  
  });

  // Let's test that the user can create a submission for a bounty under normal conditions
  it("...should let a user create a submission for review.", async() => {
    const bountyBabeInstance = await BountyBabe.deployed()

    const amount = 1
    const description = "My description"

    // Create a bounty with simple parameters
    const bountyTx = await bountyBabeInstance.createBounty(description, {from: alice, value: amount})

    if (bountyTx.logs[0].event == "Open") {
      bountyId = bountyTx.logs[0].args.bountyId.toString(10)
    }

    // Create a submission for the bounty with simple parameters
    const submissionTx = await bountyBabeInstance.createSubmission(bountyId, description, {from: bob})

    // Capture the event emitted
    if (submissionTx.logs[0].event == "Submitted") {
      submissionId = submissionTx.logs[0].args.submissionId.toString(10)
      eventEmitted = true
    }

    // Retrieve the submission by the latest submissionCount (which is the ID)
    const submissionCount = await bountyBabeInstance.getSubmissionCount.call()
    const result = await bountyBabeInstance.fetchSubmission.call(submissionId)

    // Make sure all the properties are what we expected
    assert.equal(result[0], bountyId, 'the bounty Id should match')
    assert.equal(result[1], submissionId, 'the submission Id should match')
    assert.equal(result[2], bob, 'the address does not match the submitter address')
    assert.equal(result[3], description, 'the description addded does not match the expected value')
    assert.equal(result[4].toString(10), 0, 'the state of the bounty should be "Submitted"')

    // Sanity check on count, ID, and that the event was emitted
    assert.equal(submissionCount, 1, 'submission count should be 1')
    assert.equal(submissionId, 0, 'submission Id should be 0')
    assert.equal(eventEmitted, true, 'creating a submission should emit a Submitted event')

  })

  // Let's test that the user can retrieve the number of submissions for each bounty, and each submission by its index
  it("...should let a user see a list of submissions for a bounty", async() => {
    const bountyBabeInstance = await BountyBabe.deployed()

    const amount = 1;
    const description = "My description"

    // Create a first bounty with simple parameters
    const bounty1id = (
      await bountyBabeInstance.createBounty(description, {from: alice, value: amount})
    ).logs[0].args.bountyId.toString(10)

    // Create a second bounty with simple parameters
    const bounty2id = (
      await bountyBabeInstance.createBounty(description, {from: alice, value: amount})
    ).logs[0].args.bountyId.toString(10)

    // Create a first submission to the first bounty with simple parameters
    const submission1id = (
      await bountyBabeInstance.createSubmission(bounty1id, description, {from: bob})
    ).logs[0].args.submissionId.toString(10)

    // Create a  first submission to the second bounty with simple parameters
    const submission2id = (
      await bountyBabeInstance.createSubmission(bounty2id, description, {from: bob})
    ).logs[0].args.submissionId.toString(10)

    // Create a second submission to the first bounty with simple parameters
    const submission3id = (
      await bountyBabeInstance.createSubmission(bounty1id, description, {from: bob})
    ).logs[0].args.submissionId.toString(10)

    // Make sure the number of submissions for each bounty is correct
    assert.equal(await bountyBabeInstance.getBountySubmissionCount.call(bounty1id), 2, 'bounty 1 submission count should equal 2')
    assert.equal(await bountyBabeInstance.getBountySubmissionCount.call(bounty2id), 1, 'bounty 2 submission count should equal 1')

    // Make sure you can retrieve the right submissions for each bounty, and nothing is out of order
    assert.equal(await bountyBabeInstance.getBountySubmissionIdByIndex.call(bounty1id, 0), submission1id, 'should equal submission1id')
    assert.equal(await bountyBabeInstance.getBountySubmissionIdByIndex.call(bounty1id, 1), submission3id, 'should equal submission3id')
    assert.equal(await bountyBabeInstance.getBountySubmissionIdByIndex.call(bounty2id, 0), submission2id, 'should equal submission2id')
    
  })

  // Let's test that you can retrieve the number of bounties for each user
  it("...should let a user see how many bounties they have", async() => {
    const bountyBabeInstance = await BountyBabe.deployed()

    const amount = 1;
    const description = "My description"

    // Create the first bounty for user 1 with simple parameters
    const user1bounty1 = (
      await bountyBabeInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    // Create the second bounty for user 1 with simple parameters
    const user1bounty2 = (
      await bountyBabeInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    // Create the first bounty for user 2 with simple parameters
    const user2bounty1 = (
      await bountyBabeInstance.createBounty(description, {from: dave, value: amount})
    ).logs[0].args.bountyId.toString(10)

    // Make sure the number of bounties for each user is correct
    assert.equal(await bountyBabeInstance.userNumBounties.call(charlie), 2, 'number of bounties for charlie is 2')
    assert.equal(await bountyBabeInstance.userNumBounties.call(dave), 1, 'number of bounties for dave is 1')

    // Make sure we retrieve the right bounties at the right indexes; ensure nothing is out of order
    // and make sure Charlie gets Charlie's bounties and Dave gets Dave's bounties and nothing was messed up
    assert.equal(await bountyBabeInstance.getUserBountyIdByIndex.call(charlie, 0), user1bounty1, 'user bounty id does not match expected value')
    assert.equal(await bountyBabeInstance.getUserBountyIdByIndex.call(charlie, 1), user1bounty2, 'user bounty id does not match expected value')
    assert.equal(await bountyBabeInstance.getUserBountyIdByIndex.call(dave, 0), user2bounty1, 'user bounty id does not match expected value')
    
  })

  // Let's test that the owner of a bounty can accept a submission
  it("...should let the bounty owner accept a submission", async() => {
    const bountyBabeInstance = await BountyBabe.deployed()

    const amount = 1;
    const description = "My description"

    // Create a bounty with simple parameters
    const bounty1 = (
      await bountyBabeInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    // Create a submission with simple parameters
    const submission1 = (
      await bountyBabeInstance.createSubmission(bounty1, description, {from: dave})
    ).logs[0].args.submissionId.toString(10)
    
    // Make sure that the owner of the submission cannot accept his own submission
    let reverted = false;
    try {
      const failTx = await bountyBabeInstance.acceptSubmission(bounty1, submission1, {from: dave});
    } catch (e) {
      reverted = true;
    }
    assert.equal(reverted, true, "If Dave tries to accept his own submission, revert")
    
    // Lookup the bounty and the submission, to ensure their state has not changed
    const failBountyResult = await bountyBabeInstance.fetchBounty.call(bounty1);
    const failSubmissionResult = await bountyBabeInstance.fetchSubmission.call(submission1);

    assert.equal(failBountyResult[5].toString(10), 0, 'the state of the bounty should be "Open"')
    assert.equal(failSubmissionResult[4].toString(10), 0, 'the state of the submission should be "Submitted"')

    // Accept a submission using a bounty Id
    const acceptTx = await bountyBabeInstance.acceptSubmission(bounty1, submission1, {from:charlie});
 
    // Make sure the correct events have been emitted
    assert.equal(acceptTx.logs[0].event, "Accepted", "Accepted event should be emitted");
    assert.equal(acceptTx.logs[1].event, "Closed", "Closed event should be emitted");

    // Lookup the bounty and the submission, to ensure their state has changed
    const acceptedBountyResult = await bountyBabeInstance.fetchBounty.call(bounty1);
    const acceptedSubmissionResult = await bountyBabeInstance.fetchSubmission.call(submission1);

    assert.equal(acceptedBountyResult[5].toString(10), 1, 'the state of the bounty should be "Closed"')
    assert.equal(acceptedSubmissionResult[4].toString(10), 1, 'the state of the submission should be "Accepted"')

  })

  // Let's test that the owner of a bounty can reject a submission made for their bounty
  it("...should let the bounty owner reject a submission", async() => {
    const bountyBabeInstance = await BountyBabe.deployed()

    const amount = 1;
    const description = "My description"

    // Create a bounty using simple parameters
    const bounty1 = (
      await bountyBabeInstance.createBounty(description, {from: charlie, value: amount})
    ).logs[0].args.bountyId.toString(10)

    // Create a submission using simple parameters
    const submission1 = (
      await bountyBabeInstance.createSubmission(bounty1, description, {from: dave})
    ).logs[0].args.submissionId.toString(10)
    
    // Make sure that the submitter cannot reject his own submission
    let reverted = false
    try {
      const failTx = await bountyBabeInstance.rejectSubmission(bounty1, submission1, {from: dave})
    } catch (e) {
      reverted = true
    }
    assert.equal(reverted, true, "If Dave tries to reject his own submission, revert")
    
    // Lookup the bounty and the submission, to ensure their state has not changed
    const failBountyResult = await bountyBabeInstance.fetchBounty.call(bounty1)
    const failSubmissionResult = await bountyBabeInstance.fetchSubmission.call(submission1)

    assert.equal(failBountyResult[5].toString(10), 0, 'the state of the bounty should be "Open"')
    assert.equal(failSubmissionResult[4].toString(10), 0, 'the state of the submission should be "Submitted"')

    // Reject a submission using a bounty Id and a submission Id
    const rejectTx = await bountyBabeInstance.rejectSubmission(bounty1, submission1, {from: charlie})

    // Make sure the correct event has been emitted
    assert.equal(rejectTx.logs[0].event, "Rejected", "Rejected event should be emitted")

    // Lookup the bounty and the submission, to ensure their state has changed
    const rejectedBountyResult = await bountyBabeInstance.fetchBounty.call(bounty1);
    const rejectedSubmissionResult = await bountyBabeInstance.fetchSubmission.call(submission1);

    assert.equal(rejectedSubmissionResult[4].toString(10), 2, 'the state of the submission should be "Rejected"')

  })

  // Let's test that once the submission has been accepted for a bounty, the submitter receives their payment
  it("...should pay the submitter the accepted bounty", async() => {
    const bountyBabeInstance = await BountyBabe.deployed()

    const amountWei = 500000000000000000; // 0.5 ether
    const description = "My description"

    // Create a bounty with normal parameters
    const bounty1 = (
      await bountyBabeInstance.createBounty(description, {from: helen, value: amountWei})
    ).logs[0].args.bountyId.toString(10)

    // Create a submission with normal parameters
    const submission1 = (
      await bountyBabeInstance.createSubmission(bounty1, description, {from: susan})
    ).logs[0].args.submissionId.toString(10)
    
    // Accept the submission for the bounty using the bounty Id and submission Id
    const acceptTx = await bountyBabeInstance.acceptSubmission(bounty1, submission1, {from: helen})

    // Withdraw the bounty amount using the submission Id
    const withdrawTx = await bountyBabeInstance.withdrawBountyAmount(submission1, {from: susan})

    // Make sure the correct event has been emitted
    assert.equal(withdrawTx.logs[0].event, "Paid", "Paid event should be emitted")
    
    
  })

});
