/* eslint-disable no-undef, no-unused-vars */
import { ether, ETHER_ADDRESS, EVM_REVERT, tokens } from '../../utils/smart-contract-helpers';

const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

require('chai').use(require('chai-as-promised')).should();

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
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
      it('emits a Deposit event', () => {
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

  describe('withdrawing ether', () => {
    let result, amount;

    beforeEach(async () => {
      amount = ether(1);
      result = await exchange.depositEther({ from: user1, value: amount });
    });

    describe('success', () => {
      beforeEach(async () => {
        result = await exchange.withdrawEther(amount, { from: user1 });
      });

      it('withdraws Ether funds', async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal('0');
      });
      it('emits a Withdraw event', () => {
        const log = result.logs[0];
        const { event, args } = log;
        event.should.equal('Withdraw');
        args.token.should.equal(ETHER_ADDRESS, 'token address is correct');
        args.user.should.equal(user1, 'user address is correct');
        args.amount.toString().should.equal(amount, 'amount is correct');
        args.balance.toString().should.equal('0', 'balance is correct');
      });
    });

    describe('failure', () => {
      it('rejects withdraws for insufficient balances', async () => {
        await exchange.withdrawEther(ether(100), { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      });
    });
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
      it('emits a Deposit event', () => {
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

  describe('withdrawing tokens', () => {
    let result, amount;

    describe('success', () => {
      beforeEach(async () => {
        // Deposit tokens first
        amount = tokens(10);
        await token.approve(exchange.address, amount, { from: user1 });
        await exchange.depositToken(token.address, amount, { from: user1 });

        // Withdraw tokens
        result = await exchange.withdrawToken(token.address, amount, { from: user1 });
      });

      it('withdraws token funds', async () => {
        const balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal('0');
      });
      it('emits a Withdraw event', () => {
        const log = result.logs[0];
        const { event, args } = log;
        event.should.equal('Withdraw');
        args.token.should.equal(token.address, 'token address is correct');
        args.user.should.equal(user1, 'user address is correct');
        args.amount.toString().should.equal(amount, 'amount is correct');
        args.balance.toString().should.equal('0', 'balance is correct');
      });
    });

    describe('failure', () => {
      it('rejects withdraws for Ether', async () => {
        await exchange.withdrawToken(ETHER_ADDRESS, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      });
      it('rejects withdraws for insufficient balances', async () => {
        await exchange.withdrawToken(token.address, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe('checking balances', () => {
    let amount;

    beforeEach(() => {
      amount = ether(1);
      exchange.depositEther({ from: user1, value: amount });
    });

    it('returns user balance', async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1);
      result.toString().should.be.equal(amount);
    });
  });

  describe('making orders', () => {
    let result, amountGet, amountGive;

    beforeEach(async () => {
      amountGet = tokens(1);
      amountGive = ether(1);
      result = await exchange.makeOrder(token.address, amountGet, ETHER_ADDRESS, amountGive, { from: user1 });
    });

    it('tracks the newly created order', async () => {
      const orderCount = await exchange.orderCount();
      orderCount.toString().should.equal('1');
      const order = await exchange.orders('1');
      order.id.toString().should.equal('1', 'id is correct');
      order.user.should.equal(user1, 'user is correct');
      order.tokenGet.should.equal(token.address, 'tokenGet is correct');
      order.amountGet.toString().should.equal(amountGet, 'amountGet is correct');
      order.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct');
      order.amountGive.toString().should.equal(amountGive, 'amountGive is correct');
      order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
    });

    it('emits an Order event', () => {
      const log = result.logs[0];
      const { event, args } = log;
      event.should.equal('Order');
      args.id.toString().should.equal('1', 'id is correct');
      args.user.should.equal(user1, 'user is correct');
      args.tokenGet.should.equal(token.address, 'tokenGet is correct');
      args.amountGet.toString().should.equal(amountGet, 'amountGet is correct');
      args.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct');
      args.amountGive.toString().should.equal(amountGive, 'amountGive is correct');
      args.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
    });
  });

  describe('order actions', () => {
    let amountGet, amountGive;

    beforeEach(async () => {
      amountGet = tokens(1);
      amountGive = ether(1);
      // user1 deposits ether only
      await exchange.depositEther({ from: user1, value: amountGive });
      // give tokens to user2
      await token.transfer(user2, tokens(100), { from: deployer });
      // user2 deposits tokens only
      await token.approve(exchange.address, tokens(2), { from: user2 });
      await exchange.depositToken(token.address, tokens(2), { from: user2 });
      // user1 makes an order to buy tokens with Ether
      await exchange.makeOrder(token.address, amountGet, ETHER_ADDRESS, amountGive, { from: user1 });
    });

    describe('filling orders', () => {
      let result;

      describe('success', () => {
        beforeEach(async () => {
          // user2 fills order
          result = await exchange.fillOrder('1', { from: user2 });
        });

        it('executes the trade & charges fees', async () => {
          let balance;
          balance = await exchange.balanceOf(token.address, user1);
          balance.toString().should.equal(amountGet, 'user1 received tokens');
          balance = await exchange.balanceOf(ETHER_ADDRESS, user2);
          balance.toString().should.equal(amountGive, 'user2 received Ether');
          balance = await exchange.balanceOf(ETHER_ADDRESS, user1);
          balance.toString().should.equal('0', 'user1 Ether deducted');
          balance = await exchange.balanceOf(token.address, user2);
          balance.toString().should.equal(tokens(0.99), 'user2 tokens deducted with fee applied');
          const feeAccount = await exchange.feeAccount();
          balance = await exchange.balanceOf(token.address, feeAccount);
          balance.toString().should.equal(tokens(0.01), 'feeAccount received fee');
        });

        it('updates filled orders', async () => {
          const filledOrder = await exchange.filledOrders(1);
          filledOrder.should.equal(true);
        });

        it('emits a Trade event', () => {
          const log = result.logs[0];
          const { event, args } = log;
          event.should.equal('Trade');
          args.id.toString().should.equal('1', 'id is correct');
          args.user.should.equal(user1, 'user is correct');
          args.tokenGet.should.equal(token.address, 'tokenGet is correct');
          args.amountGet.toString().should.equal(amountGet, 'amountGet is correct');
          args.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct');
          args.amountGive.toString().should.equal(amountGive, 'amountGive is correct');
          args.userFill.should.equal(user2, 'userFill is correct');
          args.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
        });
      });

      describe('failure', () => {
        it('rejects invalid order ids', async () => {
          const invalidOrderId = 99999;
          await exchange.fillOrder(invalidOrderId, { from: user2 }).should.be.rejectedWith(EVM_REVERT);
        });
        it('rejects already filled orders', async () => {
          // Fill the order
          await exchange.fillOrder('1', { from: user2 }).should.be.fulfilled;
          // Try to fill it again
          await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT);
        });
        it('rejects cancelled orders', async () => {
          // Cancel the order
          await exchange.cancelOrder('1', { from: user1 }).should.be.fulfilled;
          // Try to fill it
          await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT);
        });
      });
    });

    describe('cancelling orders', () => {
      let result;

      describe('success', () => {
        beforeEach(async () => {
          result = await exchange.cancelOrder('1', { from: user1 });
        });

        it('updates cancelled orders', async () => {
          const cancelledOrder = await exchange.cancelledOrders(1);
          cancelledOrder.should.equal(true);
        });

        it('emits a Cancel event', () => {
          const log = result.logs[0];
          const { event, args } = log;
          event.should.equal('Cancel');
          args.id.toString().should.equal('1', 'id is correct');
          args.user.should.equal(user1, 'user is correct');
          args.tokenGet.should.equal(token.address, 'tokenGet is correct');
          args.amountGet.toString().should.equal(amountGet, 'amountGet is correct');
          args.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct');
          args.amountGive.toString().should.equal(amountGive, 'amountGive is correct');
          args.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
        });
      });

      describe('failure', () => {
        it('rejects invalid order ids', async () => {
          const invalidOrderId = 99999;
          await exchange.cancelOrder(invalidOrderId, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
        });
        it('rejects unauthorized cancelations', async () => {
          // Trying to cancel another user's order
          await exchange.cancelOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT);
        });
      });
    });
  });
});
