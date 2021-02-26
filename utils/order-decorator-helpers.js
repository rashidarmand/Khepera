import { ether, ETHER_ADDRESS, tokens } from '@utils/helpers';
import dayjs from 'dayjs';

//  TODO: convert to typescript enums
export const ORDER_TYPES = {
  FILLED: 'FILLED',
  CANCELLED: 'CANCELLED',
  ALL: 'ALL'
};

export const TOKEN_PRICE_COLORS = {
  GREEN: 'green',
  RED: 'red'
};

export const decorateOrders = (orders, orderType = null) => {
  let previousOrder; // track previous order to compare history

  const decoratedOrders = orders.map((order) => {
    order = decorateOrder(order);
    if (orderType === ORDER_TYPES.FILLED) {
      order = decorateFilledOrder(order, previousOrder);
      previousOrder = order; // update the previous order once it's decorated
    }
    return order;
  });

  // Sort orders by date descending for display
  decoratedOrders.sort((a, b) => b.timestamp - a.timestamp);

  return decoratedOrders;
};

const decorateOrder = (order) => {
  const { etherAmount, tokenAmount } = calculateEtherAndTokenAmount(order);
  const tokenPrice = calculateTokenPrice(etherAmount, tokenAmount);
  const formattedTimestamp = dayjs.unix(order.timestamp).format('h:mm:ss a M/D');

  return {
    ...order,
    tokenPrice,
    etherAmount,
    tokenAmount,
    formattedTimestamp
  };
};

const decorateFilledOrder = (order, previousOrder) => {
  return {
    ...order,
    tokenPriceClass: calculateTokenPriceClass(order.tokenPrice, previousOrder)
  };
};

const calculateTokenPriceClass = (tokenPrice, previousOrder) => {
  // Show green if only one order exists
  if (!previousOrder) return TOKEN_PRICE_COLORS.GREEN;
  // Show green price if order price higher than previous order
  // Show red price if order price lower than previous order
  if (previousOrder?.tokenPrice <= tokenPrice) {
    return TOKEN_PRICE_COLORS.GREEN;
  } else {
    return TOKEN_PRICE_COLORS.RED;
  }
};

const calculateEtherAndTokenAmount = (order) => {
  let etherAmount, tokenAmount;

  if (order.tokenGive === ETHER_ADDRESS) {
    etherAmount = order.amountGive;
    tokenAmount = order.amountGet;
  } else {
    etherAmount = order.amountGet;
    tokenAmount = order.amountGive;
  }

  return {
    etherAmount: ether(etherAmount),
    tokenAmount: tokens(tokenAmount)
  };
};

const calculateTokenPrice = (etherAmount, tokenAmount) => {
  // calculate token price to 5 decimal places
  const precision = 100000;
  let tokenPrice = etherAmount / tokenAmount;
  tokenPrice = Math.round(tokenPrice * precision) / precision;
  return tokenPrice;
};
