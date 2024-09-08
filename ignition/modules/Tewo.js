const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TewoModule", (m) => {
  const tewo = m.contract("Tewo", [
    "0xA1a9E8c73Ecf86AE7F4858D5Cb72E689cDc9eb3e",
  ]);

  return { tewo };
});
