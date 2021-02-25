import Exchange from '@truffle/abis/Exchange.json';
import Token from '@truffle/abis/Token.json';
import { colorLog } from '@utils/helpers';
import Web3 from 'web3';

import { exchangeLoaded, tokenLoaded, web3AccountLoaded, web3Loaded } from './actions';

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
