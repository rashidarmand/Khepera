import { combineReducers } from 'redux';

import * as types from './types';

const web3 = (state = {}, { type, payload }) => {
  switch (type) {
    case types.WEB3_LOADED:
      return { ...state, connection: payload };
    case types.WEB3_ACCOUNT_LOADED:
      return { ...state, account: payload };
    case types.ETHER_BALANCE_LOADED:
      return { ...state, balance: payload };
    default:
      return state;
  }
};

const token = (state = {}, { type, payload }) => {
  switch (type) {
    case types.TOKEN_LOADED:
      return { ...state, loaded: true, contract: payload };
    case types.TOKEN_BALANCE_LOADED:
      return { ...state, balance: payload };
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
    case types.EXCHANGE_ETHER_BALANCE_LOADED:
      return { ...state, etherBalance: payload };
    case types.EXCHANGE_TOKEN_BALANCE_LOADED:
      return { ...state, tokenBalance: payload };
    case types.LOADING_BALANCES:
      return { ...state, loadingBalances: true };
    case types.BALANCES_LOADED:
      return { ...state, loadingBalances: false };
    case types.ETHER_DEPOSIT_AMOUNT_CHANGED:
      return { ...state, etherDepositAmount: payload };
    case types.ETHER_WITHDRAW_AMOUNT_CHANGED:
      return { ...state, etherWithdrawAmount: payload };
    case types.TOKEN_DEPOSIT_AMOUNT_CHANGED:
      return { ...state, tokenDepositAmount: payload };
    case types.TOKEN_WITHDRAW_AMOUNT_CHANGED:
      return { ...state, tokenWithdrawAmount: payload };
    case types.BUY_ORDER_AMOUNT_CHANGED:
      return { ...state, buyOrder: { ...state.buyOrder, amount: payload } };
    case types.BUY_ORDER_PRICE_CHANGED:
      return { ...state, buyOrder: { ...state.buyOrder, price: payload } };
    case types.CREATING_BUY_ORDER:
      return { ...state, buyOrder: { ...state.buyOrder, price: null, amount: null, creating: true } };
    case types.SELL_ORDER_AMOUNT_CHANGED:
      return { ...state, sellOrder: { ...state.sellOrder, amount: payload } };
    case types.SELL_ORDER_PRICE_CHANGED:
      return { ...state, sellOrder: { ...state.sellOrder, price: payload } };
    case types.CREATING_SELL_ORDER:
      return { ...state, sellOrder: { ...state.sellOrder, price: null, amount: null, creating: true } };
    case types.ORDER_CREATED:
      return {
        ...state,
        allOrders: { ...state.allOrders, data: [...state.allOrders.data, payload] },
        buyOrder: { ...state.buyOrder, creating: false },
        sellOrder: { ...state.sellOrder, creating: false }
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
