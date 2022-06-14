var IpfsUpload = artifacts.require("./IpfsUpload.sol");

module.exports = function(deployer) {
  deployer.deploy(IpfsUpload);
};
