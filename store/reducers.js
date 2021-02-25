import { combineReducers } from 'redux';

import * as types from './types';

const web3 = (state = {}, { type, payload }) => {
  switch (type) {
    case types.WEB3.LOADED:
      return { ...state, connection: payload };
    case types.WEB3.ACCOUNT_LOADED:
      return { ...state, account: payload };
    default:
      return state;
  }
};

const token = (state = {}, { type, payload }) => {
  switch (type) {
    case types.TOKEN_LOADED:
      return { ...state, loaded: true, contract: payload };
    default:
      return state;
  }
};

const exchange = (state = {}, { type, payload }) => {
  switch (type) {
    case types.EXCHANGE_LOADED:
      return { ...state, loaded: true, exchange: payload };
    default:
      return state;
  }
};

// COMBINED REDUCERS
const reducers = {
  web3,
  token,
  exchange
};

export default combineReducers(reducers);
