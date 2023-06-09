var HousesCollection = artifacts.require("./HousesCollection.sol");

module.exports = function (deployer) {
  deployer.deploy(HousesCollection);
};
