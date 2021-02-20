const Web3 = require('web3');

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const EVM_REVERT = 'VM Exception while processing transaction: revert';

export const ether = (numberOfTokens) => {
  const { BN, toWei } = Web3.utils;
  return new BN(toWei(numberOfTokens.toString(), 'ether')).toString();
};

// Same as ether
export const tokens = (n) => ether(n);
