/* eslint-disable no-undef */
export const colorLog = (message, ...optionalParams) => {
  if (!optionalParams) {
    console.log(`%c ${message}`, 'background: #222; color: #F6E05E');
  } else {
    console.log(`%c ${message}`, 'background: #222; color: #F6E05E', ...optionalParams);
  }
};

export const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DECIMALS = 10 ** 18;

// Different from smart-contract-helper ether function because it trims traling zeroes for display in UI
export const ether = (wei) => wei / DECIMALS;

export const tokens = ether;
