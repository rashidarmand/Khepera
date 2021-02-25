import * as types from './types';

// WEB 3
export const web3Loaded = (connection) => ({ type: types.WEB3.LOADED, payload: connection });
export const web3AccountLoaded = (account) => ({ type: types.WEB3.ACCOUNT_LOADED, payload: account });
// TOKEN
export const tokenLoaded = (contract) => ({ type: types.TOKEN_LOADED, payload: contract });
// EXCHANGE
export const exchangeLoaded = (exchange) => ({ type: types.EXCHANGE_LOADED, payload: exchange });
