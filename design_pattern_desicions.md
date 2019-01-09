# Design Patterns

In in the Bounty Babe dApp, I have implemented several design patterns for behavioral and security purposes.

# Pull over push payments

The withdrawal pattern, or pull over push payments, comes in handy for this kind of application. When the user creates a bounty, he transfers an amount to the contract. Once a submission is accepted, the submitter can then go and withdraw his earnings. This helps to protect against re-entrancy and denial of service attacks.

# Circuit breaker

I have used a circuit breaker in my contract. In case a bug is detected during certain function calls, the emergency stop is enabled and the function will be disabled. If there is any problem with the contract, the creator of a bounty can still withdraw his bounty amounts.

# Fail early and fail loud

In all relevant functions, I check that the required conditions are met before proceeding with the function actions. If they are not, an error message is thrown. This "fail early and fail loud" pattern reduces unnecessary code execution.

# Restricting access

I want my dApp to available to everyone for use, however I do not want everyone to be able to manipulate the contract's state. By retricting access to the admin, no one can come and stop the contract. I also verify that only the submitter can withdraw from an accepted bounty and only the creator can accept or reject a submission.

# State machine

Each bounty and submission object implement the state machine pattern. A submission can only be made if a bounty is still open. Once a submission is accepted, the bounty is closed to submissions.

