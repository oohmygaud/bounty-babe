var BountyBuddy = artifacts.require("./BountyBuddy.sol");

contract('BountyBuddy', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]
  

  it("...should let a user create a bounty.", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = web3.toWei(0.1, "ether")
    const description = "My description"

    const tx = await bountyBuddyInstance.createBounty(description, amount, {from: alice})
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
    assert.equal(result[4].toString(10), 0, 'the state of the bounty should be "Open"')

    assert.equal(bountyCount, 1, 'bounty count should be 1')
    assert.equal(bountyId, 0, 'bounty Id should be 0')
    assert.equal(eventEmitted, true, 'creating a bounty should emit an Open event')
  });

  it("...should let a user make a submission for review.", async() => {
    const bountyBuddyInstance = await BountyBuddy.deployed()

    const amount = web3.toWei(0.1, "ether")
    const description = "My description"

    const bountyTx = await bountyBuddyInstance.createBounty(description, amount, {from: alice})
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

});
