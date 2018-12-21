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

  describe('setPortfolio and getPortfolio', () => {
    it('set Portfolio', async () => {
      let instance = await FundManager.deployed();
      await instance.setPortfolio(
        [
          '0x0000000000000000000000000000000000000000',
          '0x04e3bb06dc39f2edcb073dad327fcc13ed40d280',
          '0x04e3bb06dc39f2edcb073dad327fcc13ed40d281'
        ],
        [50, 35, 15]
      );

      let response = await instance.getPortfolio.call();
      assert.equal(
        response[0][0],
        '0x0000000000000000000000000000000000000000',
      );
      assert.equal(
        response[0][1],
        '0x04e3bb06DC39f2edCB073DAD327fCc13ed40d280',
      );
      assert.equal(
        response[0][2],
        '0x04E3bB06DC39F2EDcB073daD327FCC13ED40D281'
      );

      assert.equal(response[1][0].valueOf(), 50);
      assert.equal(response[1][1].valueOf(), 35);
      assert.equal(response[1][2].valueOf(), 15);
    });

    it('appends portfolio', async () => {
      let instance = await FundManager.deployed();
      await instance.setPortfolio(
        [
          '0x0000000000000000000000000000000000000000',
          '0x04e3BB06DC39F2eDCb073DaD327FCC13ED40D282',
          '0x04e3bb06dc39f2edcb073dad327fcc13ed40d283'
        ],
        [25, 35, 40]
      );

      let response = await instance.getPortfolio.call();
      assert.equal(
        response[0][0],
        '0x0000000000000000000000000000000000000000',
      );
      assert.equal(
        response[0][1],
        '0x04e3bb06DC39f2edCB073DAD327fCc13ed40d280',
      );
      assert.equal(
        response[0][2],
        '0x04E3bB06DC39F2EDcB073daD327FCC13ED40D281'
      );
      assert.equal(
        response[0][3],
        '0x0000000000000000000000000000000000000000',
      );
      assert.equal(
        response[0][4],
        '0x04e3BB06DC39F2eDCb073DaD327FCC13ED40D282'
      );
      assert.equal(
        response[0][5],
        '0x04e3Bb06dc39F2edCB073daD327fCC13eD40D283'
      );

      assert.equal(response[1][0].valueOf(), 0);
      assert.equal(response[1][1].valueOf(), 0);
      assert.equal(response[1][2].valueOf(), 0);
      assert.equal(response[1][3].valueOf(), 25);
      assert.equal(response[1][4].valueOf(), 35);
      assert.equal(response[1][5].valueOf(), 40);
    });

  });


  describe('fails setPortfolio', () => {
    it('fails to setPortfolio with less than 100 percent', async () => {
      let instance = await FundManager.deployed();
      let raised = '';
      try {
        await instance.setPortfolio(
          [
            '0x0000000000000000000000000000000000000000',
            '0x04e3bb06dc39f2edcb073dad327fcc13ed40d280',
            '0x04e3bb06dc39f2edcb073dad327fcc13ed40d281'
          ],
          [50, 35, 10]
        );
      } catch (err) {
        raised = err.message
      }
      assert.include(raised, 'Total percentage should add to 100');
    });

    it('fails to setPortfolio with more than 100 percent', async () => {
      let instance = await FundManager.deployed();
      let raised = '';
      try {
        await instance.setPortfolio(
          [
            '0x0000000000000000000000000000000000000000',
            '0x04e3bb06dc39f2edcb073dad327fcc13ed40d280',
            '0x04e3bb06dc39f2edcb073dad327fcc13ed40d281'
          ],
          [50, 55, 10]
        );
      } catch (err) {
        raised = err.message
      }
      assert.include(raised, 'Total percentage should add to 100');
    });
  });
});
