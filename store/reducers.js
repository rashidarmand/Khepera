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
      return { ...state, loaded: true, contract: payload };
    case types.CANCELLED_ORDERS_LOADED:
      return { ...state, cancelledOrders: { loaded: true, data: payload } };
    case types.FILLED_ORDERS_LOADED:
      return { ...state, filledOrders: { loaded: true, data: payload } };
    case types.ALL_ORDERS_LOADED:
      return { ...state, allOrders: { loaded: true, data: payload } };
    case types.CANCELLING_ORDER:
      return { ...state, cancellingOrder: true };
    case types.ORDER_CANCELLED:
      return {
        ...state,
        cancellingOrder: false,
        cancelledOrders: {
          ...state.cancelledOrders,
          data: [...state.cancelledOrders.data, payload]
        }
      };
    case types.FILLING_ORDER:
      return { ...state, fillingOrder: true };
    case types.ORDER_FILLED:
      return {
        ...state,
        fillingOrder: false,
        filledOrders: {
          ...state.filledOrders,
          data: [...state.filledOrders.data, payload]
        }
      };
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
