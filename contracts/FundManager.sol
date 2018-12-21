pragma solidity ^0.5.0;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address private _owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor () internal {
      _owner = msg.sender;
      emit OwnershipTransferred(address(0), _owner);
  }

  /**
   * @return the address of the owner.
   */
  function owner() public view returns (address) {
      return _owner;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
      require(isOwner());
      _;
  }

  /**
   * @return true if `msg.sender` is the owner of the contract.
   */
  function isOwner() public view returns (bool) {
      return msg.sender == _owner;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
      emit OwnershipTransferred(_owner, address(0));
      _owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
      _transferOwnership(newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address newOwner) internal {
      require(newOwner != address(0));
      emit OwnershipTransferred(_owner, newOwner);
      _owner = newOwner;
  }
}

contract SafeMath {
  function safeMul(uint a, uint b) internal pure returns (uint) {
    uint c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function safeSub(uint a, uint b) internal pure returns (uint) {
    assert(b <= a);
    return a - b;
  }

  function safeAdd(uint a, uint b) internal pure returns (uint) {
    uint c = a + b;
    assert(c>=a && c>=b);
    return c;
  }
}

contract FundManager is Ownable, SafeMath {

  address public exchangeAddress; // address to EtherDelta, etc
  // stores the portfolios for each wallet
  // example:
  // {
  //   0xabc-address => {
  //     0xabc-ETH => 50,
  //     0xabc-BAT => 25,
  //     0xabc-TRX => 25
  //   }, ...
  // }
  mapping (address => mapping (address => uint8)) public portfolios;
  mapping (address => uint256) balances;

  event Deposit(address sender, uint amount, uint balance);
  event Withdraw(address sender, uint amount, uint balance);

  constructor () public {}

  function balanceOf(address _owner)
  public
  view
  returns (uint256 balance) {
    return balances[_owner];
  }

  // deposit ether
  function deposit() public payable {
    balances[msg.sender] = safeAdd(balances[msg.sender], msg.value);
    emit Deposit(msg.sender, msg.value, balances[msg.sender]);
  }

  // withdraw ether
  function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount, 'Not enough funds');
    balances[msg.sender] = safeSub(balances[msg.sender], amount);
    assert(msg.sender.send(amount));
    emit Withdraw(msg.sender, amount, balances[msg.sender]);
  }

  // Sets the percentage of a token on the portfolio
  // if perc is zero, it gets removed
  // function setPortfolioEntry (address token, uint8 perc) public {
  // }

  // // rebalances this portfolio
  // function rebalance () public {
  //   // sell if needed

  //   // buy if needed
  // }

}
