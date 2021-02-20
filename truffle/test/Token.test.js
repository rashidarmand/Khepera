/* eslint-disable no-undef, no-unused-vars */
import { EVM_REVERT, tokens } from '../../utils/smart-contract-helpers';

const Token = artifacts.require('Token');

require('chai').use(require('chai-as-promised')).should();

contract('Token', ([deployer, receiver, exchange]) => {
  let token;
  const name = 'Khepera';
  const symbol = 'KHEP';
  const decimals = '18';
  const totalSupply = tokens(1000000);

  beforeEach(async () => {
    token = await Token.new();
  });

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await token.name();
      result.should.equal(name);
    });

    it('tracks the symbol', async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });

    it('tracks the decimals', async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    });

    it('tracks the total supply', async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply);
    });

    it('assigns the total supply of tokens to the deployer', async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply);
    });
  });

  describe('sending tokens', () => {
    let amount, result;

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(100);
        result = await token.transfer(receiver, amount, { from: deployer });
      });

      it('transfers token balances', async () => {
        let balanceOf;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999900));
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokens(100));
      });

      it('emits a Transfer event', () => {
        const log = result.logs[0];
        const { event, args } = log;
        event.should.equal('Transfer');
        args.from.should.equal(deployer, 'from is correct');
        args.to.should.equal(receiver, 'to is correct');
        args.value.toString().should.equal(amount, 'value is correct');
      });
    });

    describe('failure', () => {
      it('rejects insufficient balances', async () => {
        let invalidAmount;
        invalidAmount = tokens(100000000); // 100 million - greater than total supply
        await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

        // Attempt to transfer tokens when you have none
        invalidAmount = tokens(10); // recipient has no tokens
        await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
      });

      it('rejects invalid recipients', async () => {
        await token.transfer(0x0, amount, { from: deployer }).should.be.rejected;
      });
    });
  });

  describe('approving tokens', () => {
    let amount, result;

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(100);
        result = await token.approve(exchange, amount, { from: deployer });
      });

      it('allocates an allowance for delegated token spending', async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal(amount);
      });

      it('emits an Approval event', () => {
        const log = result.logs[0];
        const { event, args } = log;
        event.should.equal('Approval');
        args.owner.should.equal(deployer, 'owner is correct');
        args.spender.should.equal(exchange, 'spender is correct');
        args.value.toString().should.equal(amount, 'value is correct');
      });
    });

    describe('failure', () => {
      it('rejects invalid spenders', async () => {
        await token.approve(0x0, amount, { from: deployer }).should.be.rejected;
      });
    });
  });

  describe('delegated token transfers', () => {
    let amount, result;

    beforeEach(async () => {
      amount = tokens(100);
      await token.approve(exchange, amount, { from: deployer });
    });

    describe('success', () => {
      beforeEach(async () => {
        result = await token.transferFrom(deployer, receiver, amount, { from: exchange });
      });

      it('transfers token balances', async () => {
        let balanceOf;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999900));
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokens(100));
      });

      it('resets the allowance', async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal('0');
      });

      it('emits a Transfer event', () => {
        const log = result.logs[0];
        const { event, args } = log;
        event.should.equal('Transfer');
        args.from.should.equal(deployer, 'from is correct');
        args.to.should.equal(receiver, 'to is correct');
        args.value.toString().should.equal(amount, 'value is correct');
      });
    });

    describe('failure', () => {
      it('rejects insufficient amounts', async () => {
        // Attempt to transfer too many tokens
        const invalidAmount = tokens(100000000);
        await token
          .transferFrom(deployer, receiver, invalidAmount, { from: exchange })
          .should.be.rejectedWith(EVM_REVERT);
      });
      it('rejects invalid recipients', async () => {
        await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected;
      });
    });
  });
});
