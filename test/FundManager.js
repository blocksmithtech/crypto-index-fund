const FundManager = artifacts.require('FundManager');

contract('FundManager', async (accounts) => {
  describe('#balanceOf', () => {
    it('returns balance of address', async () => {
      let instance = await FundManager.deployed();
      let response = await instance.balanceOf.call(accounts[1]);

      assert.equal(response.valueOf(), 0);
    });
  });

  describe('#withdraw', () => {
    it('fails to withdraw', async () => {
      let instance = await FundManager.deployed();
      let raised = '';

      try {
        await instance.withdraw.call(100);
      } catch (err) {
        raised = err.message
      }
      assert.include(raised, 'Not enough funds')
    });
  });

  describe('#deposit', () => {
    it('deposits', async () => {
      let instance = await FundManager.deployed();

      await instance.deposit(
        { value: 2000, from: accounts[1] }
      );

      let response = await instance.balanceOf.call(accounts[1]);
      assert.equal(response.valueOf(), 2000);
    });

    it('fails to deposit', async () => {
      let instance = await FundManager.deployed();
      let raised = '';

      try {
        await instance.deposit(
          { value: 200000000000000000000, from: accounts[1] }
        );
      } catch (err) {
        raised = err.message
      }
      assert.include(raised, 'doesn\'t have enough funds to send tx')
    });
  });

  describe('setPortfolio and setPortfolio', () => {
    it('set Portfolio', async () => {
      let instance = await FundManager.deployed();
      await instance.setPortfolio(
        [
          '0x0000000000000000000000000000000000000000',
          '0x04e3bb06dc39f2edcb073dad327fcc13ed40d280',
          '0x04e3bb06dc39f2edcb073dad327fcc13ed40d281'
        ],
        [50, 25, 25]
      );

      let response = await instance.getPortfolio.call();
      assert.equal(
        response[0][0].toLowerCase(),
        '0x0000000000000000000000000000000000000000',
      );
      assert.equal(
        response[0][1].toLowerCase(),
        '0x04e3bb06dc39f2edcb073dad327fcc13ed40d280',
      );
      assert.equal(
        response[0][2].toLowerCase(),
        '0x04e3bb06dc39f2edcb073dad327fcc13ed40d281'
      );

      assert.equal(response[1][0].valueOf(), 50);
      assert.equal(response[1][1].valueOf(), 25);
      assert.equal(response[1][2].valueOf(), 25);
    });
  });

});
