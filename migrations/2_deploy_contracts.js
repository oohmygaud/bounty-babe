var BountyBuddy = artifacts.require("./BountyBuddy.sol");

module.exports = function(deployer) {
  deployer.deploy(BountyBuddy);
};
