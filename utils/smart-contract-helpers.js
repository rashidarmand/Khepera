const Web3 = require('web3');

export const tokens = (numberOfTokens) => {
  const { BN, toWei } = Web3.utils;
  return new BN(toWei(numberOfTokens.toString(), 'ether')).toString();
};

export const EVM_REVERT = 'VM Exception while processing transaction: revert';
