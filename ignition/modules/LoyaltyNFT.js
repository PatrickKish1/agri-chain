const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFTModule", (m) => {
  const loyal = m.contract("LoyaltyNFT", []);

  return { loyal };
});
