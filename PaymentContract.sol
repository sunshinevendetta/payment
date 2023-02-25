// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    address payable public creator;
    address payable public beneficiary;
    uint256 public withdrawalAmount;
    uint256 public lastWithdrawalTimestamp;
    uint256 public withdrawalInterval;
    uint256 public constant ROYALTY_RATE = 5; 
    mapping(address => uint256) public balances;

    event PaymentReceived(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);
    event Royalty(address indexed to, uint256 amount);

    constructor(address payable _beneficiary, uint256 _withdrawalInterval, uint256 _withdrawalAmount) {
        beneficiary = _beneficiary;
        creator = payable(msg.sender);
        withdrawalInterval = _withdrawalInterval;
        withdrawalAmount = _withdrawalAmount;
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit PaymentReceived(msg.sender, msg.value);
    }

    function withdraw() public {
        require(msg.sender == beneficiary, "Only beneficiary can withdraw");
        require(block.timestamp >= lastWithdrawalTimestamp + withdrawalInterval, "Withdrawal not yet available");
        require(address(this).balance >= withdrawalAmount, "Insufficient balance");
        uint256 royaltyAmount = (withdrawalAmount * ROYALTY_RATE) / 100;
        creator.transfer(royaltyAmount);
        beneficiary.transfer(withdrawalAmount - royaltyAmount);
        lastWithdrawalTimestamp = block.timestamp;
        emit Withdrawal(beneficiary, withdrawalAmount - royaltyAmount);
        emit Royalty(creator, royaltyAmount);
    }

    function setWithdrawalAmount(uint256 amount) public {
        require(msg.sender == creator, "Only creator can set withdrawal amount");
        require(amount > 0, "Amount must be greater than 0");
        withdrawalAmount = amount;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function getCurrentWithdrawalAmount() public view returns (uint256) {
        if (block.timestamp >= lastWithdrawalTimestamp + withdrawalInterval) {
            return address(this).balance;
        } else {
            return withdrawalAmount;
        }
    }

    function setWithdrawalInterval(uint256 interval) public {
        require(msg.sender == creator, "Only creator can set withdrawal interval");
        require(interval > 0, "Interval must be greater than 0");
        withdrawalInterval = interval;
    }

    function autoWithdraw() public {
        require(msg.sender == creator, "Only creator can initiate automatic withdrawal");
        require(block.timestamp >= lastWithdrawalTimestamp + withdrawalInterval, "Withdrawal not yet available");
        require(address(this).balance >= withdrawalAmount, "Insufficient balance");
        uint256 royaltyAmount = (withdrawalAmount * ROYALTY_RATE) / 100;
        creator.transfer(royaltyAmount);
        beneficiary.transfer(withdrawalAmount - royaltyAmount);
        lastWithdrawalTimestamp = block.timestamp;
        emit Withdrawal(beneficiary, withdrawalAmount - royaltyAmount);
        emit Royalty(creator, royaltyAmount);
    }
}
