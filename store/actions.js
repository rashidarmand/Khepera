import * as types from './types';

// WEB 3
export const web3Loaded = (connection) => ({ type: types.WEB3_LOADED, payload: connection });
export const web3AccountLoaded = (account) => ({ type: types.WEB3_ACCOUNT_LOADED, payload: account });
// TOKEN
export const tokenLoaded = (contract) => ({ type: types.TOKEN_LOADED, payload: contract });
// EXCHANGE
export const exchangeLoaded = (exchange) => ({ type: types.EXCHANGE_LOADED, payload: exchange });
export const cancelledOrdersLoaded = (cancelledOrders) => ({
  type: types.CANCELLED_ORDERS_LOADED,
  payload: cancelledOrders
});
export const filledOrdersLoaded = (filledOrders) => ({
  type: types.FILLED_ORDERS_LOADED,
  payload: filledOrders
});
export const allOrdersLoaded = (allOrders) => ({
  type: types.ALL_ORDERS_LOADED,
  payload: allOrders
});
// Cancel Order
export const cancellingOrder = () => ({
  type: types.CANCELLING_ORDER
});
export const orderCancelled = (order) => ({
  type: types.ORDER_CANCELLED,
  payload: order
});
// Fill Order
export const fillingOrder = () => ({
  type: types.FILLING_ORDER
});
export const orderFilled = (order) => ({
  type: types.ORDER_FILLED,
  payload: order
});
// Loading Balances
export const etherBalanceLoaded = (balance) => ({
  type: types.ETHER_BALANCE_LOADED,
  payload: balance
});
export const tokenBalanceLoaded = (balance) => ({
  type: types.TOKEN_BALANCE_LOADED,
  payload: balance
});
export const exchangeEtherBalanceLoaded = (balance) => ({
  type: types.EXCHANGE_ETHER_BALANCE_LOADED,
  payload: balance
});
export const exchangeTokenBalanceLoaded = (balance) => ({
  type: types.EXCHANGE_TOKEN_BALANCE_LOADED,
  payload: balance
});
export const balancesLoaded = () => ({
  type: types.BALANCES_LOADED
});
export const loadingBalances = () => ({
  type: types.LOADING_BALANCES
});
// Deposits
export const etherDepositAmountChanged = (amount) => ({
  type: types.ETHER_DEPOSIT_AMOUNT_CHANGED,
  payload: amount
});
export const tokenDepositAmountChanged = (amount) => ({
  type: types.TOKEN_DEPOSIT_AMOUNT_CHANGED,
  payload: amount
});
// Withdrawals
export const etherWithdrawAmountChanged = (amount) => ({
  type: types.ETHER_WITHDRAW_AMOUNT_CHANGED,
  payload: amount
});
export const tokenWithdrawAmountChanged = (amount) => ({
  type: types.TOKEN_WITHDRAW_AMOUNT_CHANGED,
  payload: amount
});
// Buy Orders
export const buyOrderAmountChanged = (amount) => ({
  type: types.BUY_ORDER_AMOUNT_CHANGED,
  payload: amount
});
export const buyOrderPriceChanged = (price) => ({
  type: types.BUY_ORDER_PRICE_CHANGED,
  payload: price
});
export const creatingBuyOrder = () => ({
  type: types.CREATING_BUY_ORDER
});
// Sell Orders
export const sellOrderAmountChanged = (amount) => ({
  type: types.SELL_ORDER_AMOUNT_CHANGED,
  payload: amount
});
export const sellOrderPriceChanged = (price) => ({
  type: types.SELL_ORDER_PRICE_CHANGED,
  payload: price
});
export const creatingSellOrder = () => ({
  type: types.CREATING_SELL_ORDER
});
// Generic Orders
export const orderCreated = (order) => ({
  type: types.ORDER_CREATED,
  payload: order
});
