import { get } from 'lodash';
// import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// const account = (state) => get(state, 'web3.account');
export const accountSelector = (state) => get(state, 'web3.account');

const tokenLoaded = (state) => get(state, 'token.loaded', false);
const exchangeLoaded = (state) => get(state, 'exchange.loaded', false);

export const contractsLoadedSelector = createSelector(tokenLoaded, exchangeLoaded, (tl, el) => tl && el);
