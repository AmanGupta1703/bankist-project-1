'use strict';

/////////////////////////////////////////////////
// https://bankist-project-1.netlify.app/
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${movement}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// Creating a username property on all objects
function createUsername(accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .split(' ')
      .map(owner => owner[0].toLowerCase())
      .join('');
  });
}
createUsername(accounts);

function clearLoginInputField() {
  inputLoginUsername.value = ``;
  inputLoginPin.value = ``;
  inputLoginPin.blur();
}

// Calculate and display balance
function calcDislayBalance(account) {
  const balance = account.movements.reduce(
    (total, movement) => total + movement,
    0
  );
  labelBalance.textContent = `${balance}€`;
}

// Calculate Summary
function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((total, dep) => total + dep, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((total, dep) => total + dep, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

function updateUI(currentAccount) {
  displayMovements(currentAccount.movements);
  calcDisplaySummary(currentAccount);
  calcDislayBalance(currentAccount);
}

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  currentAccount = accounts.find(account => account.username === username);

  if (!currentAccount) {
    labelWelcome.textContent = `Account with username: ${username} not found`;
    clearLoginInputField();
    return;
  }

  if (currentAccount?.username && currentAccount.pin) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    updateUI(currentAccount);
  }

  clearLoginInputField();
});

// Transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  let inputTransferToValue = inputTransferTo.value;
  let inputTransferAmountValue = Number(inputTransferAmount.value);

  let receiverAcc = accounts.find(
    account => account.username === inputTransferToValue
  );

  if (
    receiverAcc &&
    receiverAcc !== currentAccount &&
    inputTransferAmountValue > 0 &&
    receiverAcc?.username === inputTransferToValue
  ) {
    receiverAcc.movements.push(inputTransferAmountValue);
    currentAccount.movements.push(-inputTransferAmountValue);
    updateUI(currentAccount);
  }

  inputTransferTo.value = ``;
  inputTransferAmount.value = ``;
  inputTransferAmount.blur();
});
// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = ``;
  inputLoanAmount.blur();
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const inputCloseUsernameValue = inputCloseUsername.value;
  const inputClosePinValue = Number(inputClosePin.value);

  if (
    inputCloseUsernameValue === currentAccount.username &&
    inputClosePinValue === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === inputCloseUsernameValue
    );
    accounts.splice(index, 1);

    updateUI(currentAccount);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = ``;
});


let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});