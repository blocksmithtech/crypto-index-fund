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

});
