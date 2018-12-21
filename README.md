# Fund manager

Done during an hackathon.

## Requirements and Set up
  * Node.js 10+
  * Truffle 4.1
  * Ganache-cli 6.1
  * Yarn

## How to run the Truffle project
  * `$ ganache-cli`
  * `$ truffle test`

## Interacting with the contract

Open `$ truffle console`, compile and migrate if needed:

```
compile
migrate --reset
```

And type:

```
let accounts;
web3.eth.getAccounts((_,res) => accounts = res);

let instance;
FundManager.deployed().then((res) => instance = res);
```
