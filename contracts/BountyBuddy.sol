pragma solidity ^0.4.17;

contract BountyBuddy {

    uint bountyCount;
    uint submissionCount;
    address admin;

    mapping(uint => Bounty) public bounties;
    mapping(uint => Submission) public submissions;
    mapping(uint => mapping(uint => uint)) public bounties_submissions;
    mapping(address => uint[]) public users_bounties;

    enum BountyState { Open, Closed }
    enum SubmissionState { Submitted, Accepted, Rejected, Paid }

    struct Bounty {
        uint bountyId;
        address creator;
        uint amount;
        string description;
        uint numSubmissions;
        BountyState bountyState;
    }

    struct Submission {
        uint bountyId;
        uint submissionId;
        address submitter;
        string description;
        SubmissionState submissionState;

    }

    event Open(uint indexed bountyId);
    event Closed(uint indexed bountyId);
    event Submitted(uint indexed bountyId, uint indexed submissionId);
    event Accepted(uint indexed bountyId, uint indexed submissionId);
    event Rejected(uint indexed bountyId, uint indexed submissionId);
    event Paid(uint indexed bountyId, uint indexed submissionId);

    constructor() public {
        admin = msg.sender;
        bountyCount = 0;
        submissionCount = 0;
    }

    modifier bountyMustBeOpen(uint bountyId) {
        require(bounties[bountyId].bountyState == BountyState.Open);
        _;
    }

    modifier mustBeSubmitted(uint submissionId) {
        require(submissions[submissionId].submissionState == SubmissionState.Submitted);
        _;
    }

    modifier mustBeOpen(uint bountyId) {
        require(bounties[bountyId].bountyState == BountyState.Open);
        _;
    }

    modifier onlyBountyOwner(uint bountyId) {
        require(bounties[bountyId].creator == msg.sender);
        _;
    }

    modifier mustBeAccepted(uint submissionId) {
      require(submissions[submissionId].submissionState == SubmissionState.Accepted);
      _;
    }
  

    function createBounty(string description, uint amount) public returns(uint) {
        uint bountyId = bountyCount;
        emit Open(bountyId);
        bounties[bountyId] = Bounty({
            bountyId: bountyId,
            creator: msg.sender,
            amount: amount,
            description: description,
            numSubmissions: 0,
            bountyState: BountyState.Open
        });
        bountyCount = bountyCount + 1;
        users_bounties[msg.sender].push(bountyId);
        return bountyId;
    }

    function createSubmission(uint bountyId, string description) public bountyMustBeOpen(bountyId) returns(uint) {
        uint submissionId = submissionCount;
        uint submissionIndex = bounties[bountyId].numSubmissions;
        
        emit Submitted(bountyId, submissionId);

        submissions[submissionId] = Submission({
            bountyId: bountyId,
            submissionId: submissionId,
            submitter: msg.sender,
            description: description,
            submissionState: SubmissionState.Submitted
        });
        
        bounties_submissions[bountyId][submissionIndex] = submissionId;
        submissionCount = submissionCount + 1;
        bounties[bountyId].numSubmissions = bounties[bountyId].numSubmissions + 1;
        return submissionId;
    }

    function getBountyCount() public view returns(uint) {
        return bountyCount;
    }

    function getSubmissionCount() public view returns(uint) {
        return submissionCount;
    }

    function getBountySubmissionCount(uint bountyId) public view returns(uint) {
        return bounties[bountyId].numSubmissions;
    }

    function getBountySubmissionIdByIndex(uint bountyId, uint index) public view returns(uint) {
        require(bountyId < bountyCount);
        require(index < bounties[bountyId].numSubmissions);
        return bounties_submissions[bountyId][index];
    }

    function getUserBountyIdByIndex(address who, uint index) public view returns(uint) {
        require(index < users_bounties[who].length);
        return users_bounties[who][index];
    }

    function fetchBounty(uint _bountyId) public view returns(uint bountyId, address creator, uint amount, string description, uint numSubmissions, uint bountyState) {
        bountyId = bounties[_bountyId].bountyId;
        creator = bounties[_bountyId].creator;
        amount = bounties[_bountyId].amount;
        description = bounties[_bountyId].description;
        numSubmissions = bounties[_bountyId].numSubmissions;
        bountyState = uint(bounties[_bountyId].bountyState);
        return (bountyId, creator, amount, description, numSubmissions, bountyState);

    }

    function fetchSubmission(uint _submissionId) public view returns(uint bountyId, uint submissionId, address submitter, string description, uint submissionState) {
        bountyId = submissions[_submissionId].bountyId;
        submissionId = submissions[_submissionId].submissionId;
        submitter = submissions[_submissionId].submitter;
        description = submissions[_submissionId].description;
        submissionState = uint(submissions[_submissionId].submissionState);
        return (bountyId, submissionId, submitter, description, submissionState);
    }

    function userNumBounties(address _who) public view returns(uint) {
        return users_bounties[_who].length;
    }

    function acceptSubmission(uint bountyId, uint submissionId) public mustBeSubmitted(submissionId) onlyBountyOwner(bountyId) mustBeOpen(bountyId) returns(bool) {
        submissions[submissionId].submissionState = SubmissionState.Accepted;
        bounties[bountyId].bountyState = BountyState.Closed;
        emit Accepted(bountyId, submissionId);
        emit Closed(bountyId);
        return true;
    }

    function rejectSubmission(uint bountyId, uint submissionId) public mustBeSubmitted(submissionId) onlyBountyOwner(bountyId) mustBeOpen(bountyId) returns(bool) {
        submissions[submissionId].submissionState = SubmissionState.Rejected;
        emit Rejected(bountyId, submissionId);
        return true;
    }

    function payBounty(uint bountyId, uint submissionId, uint amount)
  

}
