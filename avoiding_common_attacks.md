# Avoiding common attacks

# Withdrawal Pattern

Using the withdrawl design pattern has helped me avoid some major threats. By separating the contract accounting logic and the transfer logic, attackers are unable to use reentrancy and denial of service attacks.

# Timestamp Dependence

My contract may be succeptable to front running because someone could copy another person's submission and submit it at the same time. Since it is up to the bounty creator to choose which bounty to accept, this is deemed an acceptable risk.

A more advanced bounty dApp could be created using a reveal pattern, but the user experience would suffer.

# Integer Overflow and Underflow

The only places where integer math is done is incrementing bountyCount by 1, incrementing submissionCount by 1, and incrementing the numSubmissions. These values all grow slowly, and I would not overflow any of these counters even if 100 trillion bounties / submissions were created every second for the next 100 trillion years. I also never subtract so underflow cannot happen.

# Force sending ether

My contract does not use logic that depends on the contract balance, therefore is not susceptible to attacks that rely on force sending ether.