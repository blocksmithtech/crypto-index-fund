var FundManager = artifacts.require("./FundManager.sol");

module.exports = function(deployer) {
  deployer.deploy(FundManager);
};
