pragma solidity ^0.4.17;

/** @title Bounty Babe */
/** @author Audrey Worsham */
contract BountyBabe {

    uint bountyCount;
    uint submissionCount;
    address admin;

    mapping(uint => Bounty) public bounties;
    mapping(uint => Submission) public submissions;
    mapping(uint => mapping(uint => uint)) public bounties_submissions;
    mapping(address => uint[]) public users_bounties;

    // The state of a bounty
    enum BountyState { 
        Open, // The bounty is open and accepting submissions 
        Closed // The bounty has been closed and is no longer accepting submissions
    }
    // The state of a submission
    enum SubmissionState {
        Submitted, // A submission is made for a bounty
        Accepted, // A submission is accepted for a bounty
        Rejected, // A submission is rejected for a bounty
        Paid // The submitter receives paymant for their work
    }

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

    // Events that will be emitted on changes
    event Open(uint indexed bountyId); // Fired upon creation of a bounty
    event Closed(uint indexed bountyId); // Fired when a bounty is no longer taking submissions
    event Submitted(uint indexed bountyId, uint indexed submissionId); // Fired when a submission has been made
    event Accepted(uint indexed bountyId, uint indexed submissionId); // Fired when a submission has been accepted for a bounty
    event Rejected(uint indexed bountyId, uint indexed submissionId); // Fired when a submission has been rejected for a bounty
    event Paid(uint indexed bountyId, uint indexed submissionId); // Fired when the submitter receives payment

    constructor() public {
        admin = msg.sender;
        bountyCount = 0;
        submissionCount = 0;
    }
    // Making sure the bounty is open using the bounty Id
    modifier bountyMustBeOpen(uint bountyId) {
        require(bounties[bountyId].bountyState == BountyState.Open, "Bounty must be open");
        _;
    }

    // Making sure the submission is made using the submission Id
    modifier mustBeSubmitted(uint submissionId) {
        require(submissions[submissionId].submissionState == SubmissionState.Submitted, "Submission must be made");
        _;
    }

    // Making sure the msg.sender of the bounty is the owner
    modifier onlyBountyOwner(uint bountyId) {
        require(bounties[bountyId].creator == msg.sender, "The owner of the bounty is msg.sender");
        _;
    }

    // Making sure the submission is accepted for a bounty
    modifier mustBeAccepted(uint submissionId) {
        require(submissions[submissionId].submissionState == SubmissionState.Accepted, "Submission must be in Accepted state");
        _;
    }
  
    /** @dev Creates a bounty
      * @param description Description of the bounty being created
      * @return The Id of the bounty created
      */
    function createBounty(string description) public payable returns(uint) {
        uint bountyId = bountyCount;
        emit Open(bountyId);
        bounties[bountyId] = Bounty({
            bountyId: bountyId,
            creator: msg.sender,
            amount: msg.value,
            description: description,
            numSubmissions: 0,
            bountyState: BountyState.Open
        });
        bountyCount = bountyCount + 1;
        users_bounties[msg.sender].push(bountyId);
        return bountyId;
    }

    /** @dev Creates a submission to a specific bounty
      * @param bountyId The Id of the bounty the submission is for
      * @param description Description of the submission being created
      * @return The Id of the submission created
      */
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

    /** @dev Gets the number of bounties submitted
      * @return The number of bounties submitted
      */
    function getBountyCount() public view returns(uint) {
        return bountyCount;
    }

    /** @dev Gets the total number of submissions
      * @return The total number of submissions
      */
    function getSubmissionCount() public view returns(uint) {
        return submissionCount;
    }

    /** @dev Gets the number of submissions for a bounty
      * @param bountyId The Id of the bounty
      * @return The total number of submissions for that bounty
      */
    function getBountySubmissionCount(uint bountyId) public view returns(uint) {
        return bounties[bountyId].numSubmissions;
    }

    /** @dev Gets the Id of a submission by the index in bounties_submissions array
      * @param bountyId The Id of the bounty
      * @param index The index in the bounties_submissions array
      * @return The bounty's submission id
      */
    function getBountySubmissionIdByIndex(uint bountyId, uint index) public view returns(uint) {
        require(bountyId < bountyCount, "The bounty Id must be less than the bounty count");
        require(index < bounties[bountyId].numSubmissions, "The index must be less than the number of submissions for the bounty");
        return bounties_submissions[bountyId][index];
    }

    /** @dev Gets the user's bounty Id by the user's address and index number
      * @param who The user
      * @param index The index in the users_bounties array
      * @return The user's bounty Id
      */
    function getUserBountyIdByIndex(address who, uint index) public view returns(uint) {
        require(index < users_bounties[who].length, "The index must be less than the number of bounties for the user");
        return users_bounties[who][index];
    }

    /** @dev Retrieves a bounty using a bounty Id
      * @param _bountyId The Id of the bounty
      * @return All aspects of a bounty
      */
    function fetchBounty(
        uint _bountyId
    ) 
        public view 
        returns (
            uint bountyId,
            address creator,
            uint amount,
            string description,
            uint numSubmissions,
            uint bountyState
        )
    {
        bountyId = bounties[_bountyId].bountyId;
        creator = bounties[_bountyId].creator;
        amount = bounties[_bountyId].amount;
        description = bounties[_bountyId].description;
        numSubmissions = bounties[_bountyId].numSubmissions;
        bountyState = uint(bounties[_bountyId].bountyState);
        return (bountyId, creator, amount, description, numSubmissions, bountyState);

    }

    /** @dev Retrieves a submission using a submission Id
      * @param _submissionId The Id of the bounty
      * @return All aspects of a submission
      */
    function fetchSubmission(
        uint _submissionId
    )
        public view
        returns (
            uint bountyId,
            uint submissionId,
            address submitter,
            string description,
            uint submissionState
        ) 
    {
        bountyId = submissions[_submissionId].bountyId;
        submissionId = submissions[_submissionId].submissionId;
        submitter = submissions[_submissionId].submitter;
        description = submissions[_submissionId].description;
        submissionState = uint(submissions[_submissionId].submissionState);
        return (bountyId, submissionId, submitter, description, submissionState);
    }

    /** @dev Gets the number of bounties a user has submitted
      * @param _who The address of the user
      * @return The number of bounties for the user
      */
    function userNumBounties(address _who) public view returns(uint) {
        return users_bounties[_who].length;
    }

    /** @dev Accepts a submission for a bounty
      * @param bountyId The Id of the bounty
      * @param submissionId The Id of the submission
      * @return True if the submission is accepted
      */
    function acceptSubmission(uint bountyId, uint submissionId)
        public 
        mustBeSubmitted(submissionId)
        onlyBountyOwner(bountyId)
        bountyMustBeOpen(bountyId)
        returns (bool) 
    {
        submissions[submissionId].submissionState = SubmissionState.Accepted;
        bounties[bountyId].bountyState = BountyState.Closed;
        emit Accepted(bountyId, submissionId);
        emit Closed(bountyId);
        return true;
    }

    /** @dev Rejects a submission for a bounty
      * @param bountyId The Id of the bounty
      * @param submissionId The Id of the submission
      * @return True if the submission is rejected
      */
    function rejectSubmission(uint bountyId, uint submissionId)
        public 
        mustBeSubmitted(submissionId)
        onlyBountyOwner(bountyId)
        bountyMustBeOpen(bountyId)
        returns (bool)
    {
        submissions[submissionId].submissionState = SubmissionState.Rejected;
        emit Rejected(bountyId, submissionId);
        return true;
    }

    /** @dev Submitter receives payment for bounty
      * @param submissionId The Id of the submission
      * @return True if the submitter is paid
      */
    function withdrawBountyAmount(uint submissionId) public mustBeAccepted(submissionId) returns(bool) {
        require(msg.sender == submissions[submissionId].submitter, "The msg.sender must be the submitter");
        uint bountyId = submissions[submissionId].bountyId;
        submissions[submissionId].submitter.transfer(bounties[bountyId].amount);
        submissions[submissionId].submissionState = SubmissionState.Paid;
        emit Paid(bountyId, submissionId);
        return true;
    }

}
