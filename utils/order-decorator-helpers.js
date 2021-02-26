import { ether, ETHER_ADDRESS, tokens } from '@utils/helpers';
import dayjs from 'dayjs';
import { groupBy, maxBy, minBy } from 'lodash';

//  TODO: convert to typescript enums
export const ORDER_DECORATION_TYPE = {
  FILLED: 'FILLED',
  CANCELLED: 'CANCELLED',
  ORDER_BOOK: 'ORDER_BOOK',
  USER_FILLED: 'USER_FILLED',
  USER_OPEN: 'USER_OPEN',
  ALL: 'ALL'
};

export const TOKEN_PRICE_COLORS = {
  GREEN: 'green',
  RED: 'red'
};

export const decorateOrders = (orders, orderType = null, ...rest) => {
  let previousOrder; // track previous order to compare history

  const decoratedOrders = orders.map((order) => {
    order = decorateOrder(order);
    if (orderType === ORDER_DECORATION_TYPE.FILLED) {
      order = decorateFilledOrder(order, previousOrder);
      previousOrder = order; // update the previous order once it's decorated
    }
    if (orderType === ORDER_DECORATION_TYPE.ORDER_BOOK) {
      order = decorateOrderBookOrder(order);
    }
    if (orderType === ORDER_DECORATION_TYPE.USER_FILLED) {
      const account = rest.account;
      order = decorateCurrentUserFilledOrder(order, account);
    }
    if (orderType === ORDER_DECORATION_TYPE.USER_OPEN) {
      order = decorateCurrentUserOpenOrder(order);
    }
    return order;
  });

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

const decorateOrderBookOrder = (order) => {
  const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
  return {
    ...order,
    orderType,
    orderTypeColor: orderType === 'buy' ? TOKEN_PRICE_COLORS.GREEN : TOKEN_PRICE_COLORS.RED,
    orderFillClass: orderType === 'buy' ? 'sell' : 'buy'
  };
};

const decorateCurrentUserFilledOrder = (order, account) => {
  const currentUserOrder = order.user === account;
  let orderType;

  if (currentUserOrder) {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
  } else {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy';
  }

  return {
    ...order,
    orderType,
    orderTypeColor: orderType === 'buy' ? TOKEN_PRICE_COLORS.GREEN : TOKEN_PRICE_COLORS.RED,
    orderSign: orderType === 'buy' ? '+' : '-'
  };
};

const decorateCurrentUserOpenOrder = (order) => {
  const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
  return {
    ...order,
    orderType,
    orderTypeColor: orderType === 'buy' ? TOKEN_PRICE_COLORS.GREEN : TOKEN_PRICE_COLORS.RED
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

// TODO: more chart views than hourly
export const buildGraphData = (orders) => {
  // Group the orders by hour for the graph
  orders = groupBy(orders, (o) => dayjs.unix(o.timestamp).startOf('hour').format());
  // Get each hour where data exists
  const hours = Object.keys(orders);
  // Build the graph series
  const graphData = hours.map((hour) => {
    // Fetch all the orders from current hour
    const group = orders[hour];
    // Calculate open, high, low, close price values
    const open = group[0]; // first order
    const high = maxBy(group, 'tokenPrice'); // high price
    const low = minBy(group, 'tokenPrice'); // low price
    const close = group[group.length - 1]; // last order
    return {
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
    };
  });
  return graphData;
};
