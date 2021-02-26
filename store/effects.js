import Exchange from '@truffle/abis/Exchange.json';
import Token from '@truffle/abis/Token.json';
import Web3 from 'web3';

import {
  allOrdersLoaded,
  cancelledOrdersLoaded,
  exchangeLoaded,
  filledOrdersLoaded,
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
