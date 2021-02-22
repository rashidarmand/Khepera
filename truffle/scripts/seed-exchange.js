/* eslint-disable no-undef */
const { ether, tokens, ETHER_ADDRESS } = require('../../utils/smart-contract-helpers');
const { colorLog, wait } = require('../../utils/helpers');

// Contracts
const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

module.exports = async function (callback) {
  try {
    colorLog('script running....');

    // Fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts();

    // Fetch deployed token
    const token = await Token.deployed();
    colorLog('Token Fetched:: ', token.address);

    // Fetch deployed exchange
    const exchange = await Exchange.deployed();
    colorLog('Exchange Fetched:: ', exchange.address);

    // Give tokens to second account
    const [sender, receiver] = accounts;
    let amount = web3.utils.toWei('10000', 'ether'); // 10,000 tokens
    await token.transfer(receiver, amount, { from: sender });
    colorLog(`Transferred ${amount} tokens from ${sender} to ${receiver}`);

    // Set up exchange users
    const [user1, user2] = accounts;

    // User 1 deposits Ether
    amount = 1;
    await exchange.depositEther({ from: user1, value: ether(amount) });
    colorLog(`Deposited ${amount} Ether from ${user1}`);

    // User 2 approves tokens
    amount = 10000;
    await token.approve(exchange.address, tokens(amount), { from: user2 });
    colorLog(`Approved ${amount} tokens from ${user2}`);

    // User 2 deposits tokens
    await exchange.depositToken(token.address, tokens(amount), { from: user2 });
    colorLog(`Deposited ${amount} tokens from ${user2}`);

    // ==============================================================
    //* Seed a cancelled order

    // User 1 makes order to get tokens
    let result;
    let orderId;
    result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
    colorLog(`Made order from ${user1}`);

    // User 1 cancels the order
    orderId = result.logs[0].args.id;
    await exchange.cancelOrder(orderId, { from: user1 });
    colorLog(`Cancelled order from ${user1}`);

    // ==============================================================
    //* Seed filled orders

    // User 1 makes order
    result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
    colorLog(`Made order from ${user1}`);

    // User2 fills order
    orderId = result.logs[0].args.id;
    await exchange.fillOrder(orderId, { from: user2 });
    colorLog(`Filled order from ${user1}`);

    // Wait 1 second
    await wait(1);

    // User 1 makes another order
    result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.01), { from: user1 });
    colorLog(`Made order from ${user1}`);

    // User2 fills another order
    orderId = result.logs[0].args.id;
    await exchange.fillOrder(orderId, { from: user2 });
    colorLog(`Filled order from ${user1}`);

    // Wait 1 second
    await wait(1);

    // User 1 makes final order
    result = await exchange.makeOrder(token.address, tokens(250), ETHER_ADDRESS, ether(0.2), { from: user1 });
    colorLog(`Made order from ${user1}`);

    // User2 fills final order
    orderId = result.logs[0].args.id;
    await exchange.fillOrder(orderId, { from: user2 });
    colorLog(`Filled order from ${user1}`);

    // Wait 1 second
    await wait(1);

    // ==============================================================
    //* Seed open orders

    // User 1 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(token.address, tokens(10 * i), ETHER_ADDRESS, ether(0.01), { from: user1 });
      colorLog(`Made order from ${user1}`);
      // Wait 1 second
      await wait(1);
    }

    // User 2 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(10 * i), { from: user2 });
      colorLog(`Made order from ${user2}`);
      // Wait 1 second
      await wait(1);
    }

    colorLog('script complete.');
  } catch (error) {
    console.error(error);
  }
  callback();
};
