var DiagnosePatient = artifacts.require("./DiagnosePatient.sol");    // require the DiagnosePatient contract
module.exports = function(deployer) {
  deployer.deploy(DiagnosePatient);   // change the deploy function if your constructor
                                      // contains using ether
};