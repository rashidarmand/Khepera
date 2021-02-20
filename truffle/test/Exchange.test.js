/* eslint-disable no-undef, no-unused-vars */
import { ether, ETHER_ADDRESS, EVM_REVERT, tokens } from '../../utils/smart-contract-helpers';

const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

require('chai').use(require('chai-as-promised')).should();

contract('Exchange', ([deployer, feeAccount, user1]) => {
  let exchange, token;
  const feePercent = 1;

  beforeEach(async () => {
    // Deploy token
    token = await Token.new();
    // Transfer some tokens to user1
    token.transfer(user1, tokens(100), { from: deployer });
    // Deploy exchange
    exchange = await Exchange.new(feeAccount, feePercent);
  });

  describe('deployment', () => {
    it('tracks the fee account', async () => {
      const result = await exchange.feeAccount();
      result.should.equal(feeAccount);
    });
    it('tracks the fee percent', async () => {
      const result = await exchange.feePercent();
      result.toString().should.equal(feePercent.toString());
    });
  });

  describe('fallback', () => {
    it('reverts when Ether is sent', async () => {
      await exchange.sendTransaction({ value: ether(1), from: user1 }).should.be.rejectedWith(EVM_REVERT);
    });
  });

  describe('depositing ether', () => {
    let result, amount;

    describe('success', () => {
      beforeEach(async () => {
        amount = ether(1);
        result = await exchange.depositEther({ from: user1, value: amount });
      });

      it('tracks the ether deposit', async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal(amount);
      });
      // TODO: create helper function that checks for events
      it('emits a Deposit event', async () => {
        const log = result.logs[0];
        const { event, args } = log;
        event.should.equal('Deposit');
        args.token.should.equal(ETHER_ADDRESS, 'token address is correct');
        args.user.should.equal(user1, 'user address is correct');
        args.amount.toString().should.equal(amount, 'amount is correct');
        args.balance.toString().should.equal(amount, 'balance is correct');
      });
    });

    // describe('failure', () => {});
  });

  describe('depositing tokens', () => {
    let result, amount;

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(10);
        await token.approve(exchange.address, amount, { from: user1 });
        result = await exchange.depositToken(token.address, amount, { from: user1 });
      });

      it('tracks the token deposit', async () => {
        let balance;
        // check the exchange's token balance on token smart contract
        balance = await token.balanceOf(exchange.address);
        balance.toString().should.equal(amount);
        // check token balances on the exchange
        balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal(amount);
      });
      // TODO: create helper function that checks for events
      it('emits a Deposit event', async () => {
        const log = result.logs[0];
        const { event, args } = log;
        event.should.equal('Deposit');
        args.token.should.equal(token.address, 'token address is correct');
        args.user.should.equal(user1, 'user address is correct');
        args.amount.toString().should.equal(amount, 'amount is correct');
        args.balance.toString().should.equal(amount, 'balance is correct');
      });
    });

    describe('failure', () => {
      it('rejects Ether deposits', async () => {
        await exchange.depositToken(ETHER_ADDRESS, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      });
      it('fails when no tokens are approved', async () => {
        // Don't approve any tokens before depositing
        await exchange.depositToken(token.address, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      });
    });
  });
});
