import Exchange from '@truffle/abis/Exchange.json';
import Token from '@truffle/abis/Token.json';
import { ETHER_ADDRESS } from '@utils/helpers';
import Web3 from 'web3';

import {
  allOrdersLoaded,
  balancesLoaded,
  cancelledOrdersLoaded,
  cancellingOrder,
  creatingBuyOrder,
  creatingSellOrder,
  etherBalanceLoaded,
  exchangeEtherBalanceLoaded,
  exchangeLoaded,
  exchangeTokenBalanceLoaded,
  filledOrdersLoaded,
  fillingOrder,
  loadingBalances,
  orderCancelled,
  orderCreated,
  orderFilled,
  tokenBalanceLoaded,
  tokenLoaded,
  web3AccountLoaded,
  web3Loaded
} from './actions';

export const loadWeb3 = async (dispatch) => {
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    dispatch(web3Loaded(web3));
    await window.ethereum.enable();
    return web3;
  } else {
    window.alert('Please install MetaMask');
    window.location.assign('https://metamask.io/');
  }
};

export const loadWeb3Account = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const [account] = accounts;
  if (typeof account !== 'undefined') {
    dispatch(web3AccountLoaded(account));
    return account;
  } else {
    alert('Please login with MetaMask');
    return null;
  }
};

export const loadToken = (web3, networkId, dispatch) => {
  const token = new web3.eth.Contract(Token.abi, Token?.networks[networkId]?.address);
  if (!token._address) {
    console.error('Token contract not deployed to the current network. Please select another network with Metamask.');
    return null;
  }
  dispatch(tokenLoaded(token));
  return token;
};

export const loadExchange = async (web3, networkId, dispatch) => {
  const exchange = new web3.eth.Contract(Exchange.abi, Exchange?.networks[networkId]?.address);
  if (!exchange._address) {
    console.error(
      'Exchange contract not deployed to the current network. Please select another network with Metamask.'
    );
    return null;
  }
  dispatch(exchangeLoaded(exchange));
  return exchange;
};

// TODO: create helper function to only get needed data and remove 0-6 keys on individual orders
export const loadAllOrders = async (exchange, dispatch) => {
  // Fetch cancelled orders with the "Cancel" event stream, format them, & add them to the redux store
  const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' });
  const cancelledOrders = cancelStream.map((event) => event.returnValues);
  dispatch(cancelledOrdersLoaded(cancelledOrders));

  // Fetch filled orders with the "Trade" event stream, format them, & add them to the redux store
  const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' });
  const filledOrders = tradeStream.map((event) => event.returnValues);
  dispatch(filledOrdersLoaded(filledOrders));

  // Fetch all orders with the "Order" event stream, format them, & add them to the redux store
  const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' });
  const allOrders = orderStream.map((event) => event.returnValues);
  dispatch(allOrdersLoaded(allOrders));
};

export const subscribeToEvents = async (exchange, dispatch) => {
  const { Cancel, Trade, Deposit, Withdraw, Order } = exchange.events;
  Cancel()
    .on('data', (event) => {
      dispatch(orderCancelled(event.returnValues));
    })
    .on('error', console.error);

  Trade()
    .on('data', (event) => {
      dispatch(orderFilled(event.returnValues));
    })
    .on('error', console.error);

  Deposit().on('data', () => dispatch(balancesLoaded()));
  Withdraw().on('data', () => dispatch(balancesLoaded()));
  Order().on('data', (event) => dispatch(orderCreated(event.returnValues)));
};

export const cancelOrder = (exchange, order, account, dispatch) => {
  exchange.methods
    .cancelOrder(order.id)
    .send({ from: account })
    .on('transactionHash', () => {
      dispatch(cancellingOrder());
    })
    .on('error', (error) => {
      console.error('Cancel Order Failure:: ', error);
      alert('there was an error!');
    });
};

export const fillOrder = (exchange, order, account, dispatch) => {
  exchange.methods
    .fillOrder(order.id)
    .send({ from: account })
    .on('transactionHash', () => {
      dispatch(fillingOrder());
    })
    .on('error', (error) => {
      console.error('Fill Order Failure:: ', error);
      alert('there was an error!');
    });
};

export const loadBalances = async (web3, exchange, token, account, dispatch) => {
  if (typeof account !== 'undefined') {
    // Ether balance in wallet
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance));

    // Token balance in wallet
    const tokenBalance = await token.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(tokenBalance));

    // Ether balance in exchange
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance));

    // Token balance in exchange
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call();
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance));

    // Trigger all balances loaded
    dispatch(balancesLoaded());
  } else {
    alert('Please login with MetaMask');
  }
};

export const depositEther = (amount, exchange, web3, account, dispatch) => {
  amount = web3.utils.toWei(amount, 'ether');
  exchange.methods
    .depositEther()
    .send({ from: account, value: amount })
    .on('transactionHash', () => {
      dispatch(loadingBalances());
    })
    .on('error', (error) => {
      console.error(error);
      alert('There was an error!');
    });
};

export const withdrawEther = (amount, exchange, web3, account, dispatch) => {
  amount = web3.utils.toWei(amount, 'ether');
  exchange.methods
    .withdrawEther(amount)
    .send({ from: account })
    .on('transactionHash', () => {
      dispatch(loadingBalances());
    })
    .on('error', (error) => {
      console.error(error);
      alert('There was an error!');
    });
};

export const depositToken = (amount, exchange, token, web3, account, dispatch) => {
  amount = web3.utils.toWei(amount, 'ether');
  token.methods
    .approve(exchange.options.address, amount)
    .send({ from: account })
    .on('transactionHash', () => {
      exchange.methods
        .depositToken(token.options.address, amount)
        .send({ from: account })
        .on('transactionHash', () => {
          dispatch(loadingBalances());
        })
        .on('error', (error) => {
          console.error(error);
          alert('There was an error!');
        });
    });
};

export const withdrawToken = (amount, exchange, token, web3, account, dispatch) => {
  amount = web3.utils.toWei(amount, 'ether');
  exchange.methods
    .withdrawToken(token.options.address, amount)
    .send({ from: account })
    .on('transactionHash', () => {
      dispatch(loadingBalances());
    })
    .on('error', (error) => {
      console.error(error);
      alert('There was an error!');
    });
};

export const createBuyOrder = (exchange, token, web3, order, account, dispatch) => {
  const tokenGet = token.options.address;
  const amountGet = web3.utils.toWei(order.amount, 'ether');
  const tokenGive = ETHER_ADDRESS;
  const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether');

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on('transactionHash', () => {
      dispatch(creatingBuyOrder());
    })
    .on('error', (error) => {
      console.error(error);
      alert('There was an error!');
    });
};

export const createSellOrder = (exchange, token, web3, order, account, dispatch) => {
  const tokenGet = ETHER_ADDRESS;
  const amountGet = web3.utils.toWei((order.amount * order.price).toString(), 'ether');
  const tokenGive = token.options.address;
  const amountGive = web3.utils.toWei(order.amount, 'ether');

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on('transactionHash', () => {
      dispatch(creatingSellOrder());
    })
    .on('error', (error) => {
      console.error(error);
      alert('There was an error!');
    });
};
