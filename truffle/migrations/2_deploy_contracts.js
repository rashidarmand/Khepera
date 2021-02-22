/* eslint-disable no-undef */
const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts(); // web3 injected by truffle suite
  const [feeAccount] = accounts;
  const feePercent = 1;

  await deployer.deploy(Token);
  await deployer.deploy(Exchange, feeAccount, feePercent);
};
