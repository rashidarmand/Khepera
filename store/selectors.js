import { decorateOrders, ORDER_TYPES } from '@utils/order-decorator-helpers';
import { get } from 'lodash';
import { createSelector } from 'reselect';

export const accountSelector = (state) => get(state, 'web3.account');

const tokenLoaded = (state) => get(state, 'token.loaded', false);
const exchangeLoaded = (state) => get(state, 'exchange.loaded', false);

export const contractsLoadedSelector = createSelector(tokenLoaded, exchangeLoaded, (tl, el) => tl && el);

export const exchangeSelector = (state) => get(state, 'exchange.contract');

export const cancelledOrdersLoadedSelector = (state) => get(state, 'exchange.cancelledOrders.loaded', false);
export const cancelledOrdersSelector = (state) => get(state, 'exchange.cancelledOrders.data', []);

export const filledOrdersLoadedSelector = (state) => get(state, 'exchange.filledOrders.loaded', false);
export const filledOrdersSelector = createSelector(
  (state) => get(state, 'exchange.filledOrders.data', []),
  (orders) => decorateOrders(orders, ORDER_TYPES.FILLED)
);

export const allOrdersLoadedSelector = (state) => get(state, 'exchange.allOrders.loaded', false);
export const allOrdersSelector = (state) => get(state, 'exchange.allOrders.data', []);
