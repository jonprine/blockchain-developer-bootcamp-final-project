const Concert = artifacts.require("Concert");

module.exports = function(deployer) {
    deployer.deploy(Concert);
}