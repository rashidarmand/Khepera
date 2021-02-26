import { decorateOrders, ORDER_TYPES } from '@utils/order-decorator-helpers';
import { get, groupBy, reject } from 'lodash';
import { createSelector } from 'reselect';

export const accountSelector = (state) => get(state, 'web3.account');

const tokenLoaded = (state) => get(state, 'token.loaded', false);
const exchangeLoaded = (state) => get(state, 'exchange.loaded', false);

export const contractsLoadedSelector = createSelector(tokenLoaded, exchangeLoaded, (tl, el) => tl && el);

export const exchangeSelector = (state) => get(state, 'exchange.contract');
// CancelledOrders
export const cancelledOrdersLoadedSelector = (state) => get(state, 'exchange.cancelledOrders.loaded', false);
export const cancelledOrdersSelector = (state) => get(state, 'exchange.cancelledOrders.data', []);
// Filled Orders
export const filledOrdersLoadedSelector = (state) => get(state, 'exchange.filledOrders.loaded', false);
export const filledOrdersSelector = createSelector(
  (state) => get(state, 'exchange.filledOrders.data', []),
  (orders) => {
    const decoratedOrders = decorateOrders(orders, ORDER_TYPES.FILLED);
    // Sort orders by date descending for display
    return decoratedOrders.sort((a, b) => b.timestamp - a.timestamp);
  }
);
// All Orders
export const allOrdersLoadedSelector = (state) => get(state, 'exchange.allOrders.loaded', false);
export const allOrdersSelector = (state) => get(state, 'exchange.allOrders.data', []);
// Order Book
const openOrders = (state) => {
  const all = allOrdersSelector(state);
  const filled = filledOrdersSelector(state);
  const cancelled = cancelledOrdersSelector(state);

  const open = reject(all, (order) => {
    const orderFilled = filled.some((o) => o.id === order.id);
    const orderCancelled = cancelled.some((o) => o.id === order.id);
    return orderFilled || orderCancelled;
  });

  return open;
};
export const orderBookLoadedSelector = (state) =>
  cancelledOrdersLoadedSelector(state) && filledOrdersLoadedSelector(state) && allOrdersLoadedSelector(state);
// Create the order book
export const orderBookSelector = createSelector(openOrders, (orders) => {
  const decoratedOrders = decorateOrders(orders, ORDER_TYPES.ORDER_BOOK);
  return groupBy(decoratedOrders, 'orderType');
});
