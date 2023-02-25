const ethers = window.ethers;
const provider = new ethers.providers.Web3Provider(window.ethereum);

const contractAddress = '0x951ADbeEC9a84273949Bd5A1822beb69992f291A';
const contractABI = [{"inputs":[{"internalType":"address payable","name":"_beneficiary","type":"address"},{"internalType":"uint256","name":"_withdrawalInterval","type":"uint256"},{"internalType":"uint256","name":"_withdrawalAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Royalty","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"ROYALTY_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"autoWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"creator","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentWithdrawalAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastWithdrawalTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setWithdrawalAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"interval","type":"uint256"}],"name":"setWithdrawalInterval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawalAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawalInterval","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];

// Contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Connect wallet function
const connectWallet = async () => {
  try {
    // Prompt user to connect to Metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
      
    // Subscribe to Metamask accounts change event
    window.ethereum.on('accountsChanged', (accounts) => {
      // Reload the page to reflect the updated account
      window.location.reload();
    });

  } catch (error) {
    console.log(error);
  }
};

// Deposit function
const deposit = async () => {
  const depositAmount = document.getElementById('deposit-amount').value;
  const depositResponse = document.getElementById('depositResponse');
  try {
    const signer = provider.getSigner();
    const connectedContract = contract.connect(signer);
    const tx = await connectedContract.deposit({ value: depositAmount });
    await tx.wait();
    depositResponse.innerText = 'Deposit successful';
  } catch (error) {
    console.log(error);
    depositResponse.innerText = 'Deposit failed';
  }
};

// Withdraw function
const withdraw = async () => {
  const withdrawResponse = document.getElementById('withdrawResponse');
  try {
    const signer = provider.getSigner();
    const connectedContract = contract.connect(signer);
    const tx = await connectedContract.withdraw();
    await tx.wait();
    withdrawResponse.innerText = 'Withdraw successful';
  } catch (error) {
    console.log(error);
    withdrawResponse.innerText = 'Withdraw failed';
  }
};

// Event listeners
window.addEventListener('load', async () => {
  // If MetaMask is installed, connect wallet automatically
  if (typeof window.ethereum !== 'undefined') {
    await connectWallet();
  }

  // Add event listeners to buttons
  document.getElementById('connect-btn').addEventListener('click', connectWallet);
  document.getElementById('deposit-btn').addEventListener('click', deposit);
  document.getElementById('withdraw-btn').addEventListener('click', withdraw);
});