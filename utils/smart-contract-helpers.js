const Web3 = require('web3');

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const EVM_REVERT = 'VM Exception while processing transaction: revert';

export const ether = (numberOfTokens) => {
  const { BN, toWei } = Web3.utils;
  return new BN(toWei(numberOfTokens.toString(), 'ether')).toString();
};

// Same as ether
export const tokens = (n) => ether(n);

const createEventParamAssertion = (args) => (eventEmitterTestCriteria) => {
  const { name, value, type, msg } = eventEmitterTestCriteria;
  const message = msg || `${name} is correct.`;
  if (!type || type !== 'number') {
    args[name].should.equal(value, message);
  } else {
    args[name].toString().should.equal(value, message);
  }
};

// TODO: convert to typescript to use interfaces
/**
 * interface EventParams = {
 * 	name: string
 * 	value: any
 * 	type?: address(string) | number // Default is string
 * 	msg?: string
 * }
 *
 * @param {
 * 		result: any
 * 		eventName: string
 * 		eventParams: EventParams[]
 * } eventTestParams
 */
// * WIP - weird issue with result being undefined
export const testForEvent = (eventTestParams) => {
  const { result, eventName, eventParams } = eventTestParams;
  console.log('result:: ', eventName);
  const log = result.logs[0];
  const { event, args } = log;
  event.should.equal(eventName);
  eventParams.forEach(createEventParamAssertion(args));
};
