import { buildGraphData, decorateOrders, formatBalance, ORDER_DECORATION_TYPE } from '@utils/order-decorator-helpers';
import { get, groupBy, reject } from 'lodash';
import { createSelector } from 'reselect';

export const web3Selector = (state) => get(state, 'web3.connection');

export const accountSelector = (state) => get(state, 'web3.account');

const tokenLoaded = (state) => get(state, 'token.loaded', false);
export const tokenSelector = (state) => get(state, 'token.contract');

const exchangeLoaded = (state) => get(state, 'exchange.loaded', false);
export const exchangeSelector = (state) => get(state, 'exchange.contract');

export const contractsLoadedSelector = createSelector(tokenLoaded, exchangeLoaded, (tl, el) => tl && el);
// Cancelled Orders
export const cancelledOrdersLoadedSelector = (state) => get(state, 'exchange.cancelledOrders.loaded', false);
export const cancelledOrdersSelector = (state) => get(state, 'exchange.cancelledOrders.data', []);
// Filled Orders
const filledOrders = (state) => get(state, 'exchange.filledOrders.data', []);
export const filledOrdersLoadedSelector = (state) => get(state, 'exchange.filledOrders.loaded', false);
export const filledOrdersSelector = createSelector(filledOrders, (orders) => {
  const decoratedOrders = decorateOrders(orders, ORDER_DECORATION_TYPE.FILLED);
  // Sort orders by date descending for display
  return decoratedOrders.sort((a, b) => b.timestamp - a.timestamp);
});
// All Orders
export const allOrdersLoadedSelector = (state) => get(state, 'exchange.allOrders.loaded', false);
export const allOrdersSelector = (state) => get(state, 'exchange.allOrders.data', []);
// Order Book
const openOrders = (state) => {
  const all = allOrdersSelector(state);
  const filled = filledOrders(state);
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
  const decoratedOrders = decorateOrders(orders, ORDER_DECORATION_TYPE.ORDER_BOOK);
  return groupBy(decoratedOrders, 'orderType');
});
// Current User Filled Orders (My Transactions)
export const currentUserFilledOrdersLoadedSelector = filledOrdersLoadedSelector;
export const currentUserFilledOrdersSelector = createSelector(
  accountSelector,
  filledOrdersSelector,
  (account, orders) => {
    // Find current user orders
    orders = orders.filter((order) => order.user === account || order.userFill === account);
    return decorateOrders(orders, ORDER_DECORATION_TYPE.USER_FILLED, account);
  }
);
// Current User Open Orders (My Transactions)
export const currentUserOpenOrdersLoadedSelector = orderBookLoadedSelector;
export const currentUserOpenOrdersSelector = createSelector(accountSelector, openOrders, (account, orders) => {
  orders = orders.filter((o) => o.user === account); // Filter orders created by current user
  orders = decorateOrders(orders, ORDER_DECORATION_TYPE.USER_OPEN);
  return orders.sort((a, b) => b.timestamp - a.timestamp);
});
// Price Chart
export const priceChartLoadedSelector = filledOrdersLoadedSelector;
export const priceChartSelector = createSelector(filledOrders, (orders) => {
  orders = decorateOrders(orders);
  // Get last two orders for final price & price change
  const [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length);
  // get last order price
  const lastPrice = get(lastOrder, 'tokenPrice', 0);
  // get second last order price
  const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0);
  return {
    lastPrice,
    lastPriceChange: lastPrice >= secondLastPrice ? '+' : '-',
    series: [
      {
        data: buildGraphData(orders)
      }
    ]
  };
});
// Order cancelling
export const cancellingOrderSelector = (state) => get(state, 'exchange.cancellingOrder', false);
// Order filling
export const fillingOrderSelector = (state) => get(state, 'exchange.fillingOrder', false);
// Balances
export const loadingBalancesSelector = (state) => get(state, 'exchange.loadingBalances', true);
export const etherBalanceSelector = createSelector((state) => get(state, 'web3.balance', 0), formatBalance);
export const tokenBalanceSelector = createSelector((state) => get(state, 'token.balance', 0), formatBalance);
export const exchangeEtherBalanceSelector = createSelector(
  (state) => get(state, 'exchange.etherBalance', 0),
  formatBalance
);
export const exchangeTokenBalanceSelector = createSelector(
  (state) => get(state, 'exchange.tokenBalance', 0),
  formatBalance
);
// Deposits
export const etherDepositAmountSelector = (state) => get(state, 'exchange.etherDepositAmount', null);
export const tokenDepositAmountSelector = (state) => get(state, 'exchange.tokenDepositAmount', null);
// Withdrawals
export const etherWithdrawAmountSelector = (state) => get(state, 'exchange.etherWithdrawAmount', null);
export const tokenWithdrawAmountSelector = (state) => get(state, 'exchange.tokenWithdrawAmount', null);
