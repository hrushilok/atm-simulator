
const colors = require('colors');

const promptSchemas = {

  defaultSchema: {
    properties: {
      "default screen": {
        description: "welcome to the ATM!\nchoose 1 for login or 2 to open a new account..".green,
        pattern: /^[12]$/,
        message: "please choose 1 for login or 2 for new account",
        required: true
      }
    }
  },

  loginSchema: {
    properties: {
      "account number": {
        description: "account number".green,
        pattern: /^[0-9]+$/,
        message: "account number must contain only numbers..".red,
        required: true
      },
      "pin": {
        description: "pin".green,
        pattern: /^[0-9][0-9][0-9][0-9]$/,
        message: "pin must be 4 digit number..".red,
        required: true,
        hidden: true
      }
    }
  },

  userRegistration: {
    properties: {
      "initial deposit": {
        description: "initial deposit: format: 00.00:".green,
        pattern: /^[0-9]+\.[0-9][0-9]$/,
        message: "format two decimals: 1500.00".red,
        required: true
      },
      "user name": {
        description: "Enter your name".green,
        pattern: /^[a-z]+$/,
        message: "Your name".red,
        required: true
      },
      "secure pin": {
        description: "secure pin: 4 digit number:".green,
        pattern: /^[0-9][0-9][0-9][0-9]$/,
        message: "must be a 4 digit number..".red,
        required: true,
        hidden: true
      },
      "verify pin": {
        description: "verify pin:".green,
        pattern: /^[0-9][0-9][0-9][0-9]$/,
        message: "must be a 4 digit number..".red,
        required: true,
        hidden: true
      }
    }
  },

  anotherTransaction: {
    properties: {
      "another transaction?": {
        description: "another transaction?".green,
        pattern: /y(es)?|n[o]?/i,
        message: "must answer yes or no..".red,
        required: true
      }
    }
  },

  transactionMenu: {
    properties: {
      "transaction menu": {
        menu: "Transaction Menu:\n".blue +
              "enter 1 for balance inquery\n".blue +
              "enter 2 to withdraw funds\n".blue +
              "enter 3 to deposit funds\n".blue +
              "enter 4 to transfer funds\n".blue +
              "enter 5 to log out\n".blue,
        description: "enter choice 1-5".green,
        pattern: /^[1-6]$/,
        required: true
      }
    }
  },

  newPin: {
    properties: {
      "new pin": {
        description: "new pin".green,
        pattern: /^[0-9][0-9][0-9][0-9]$/,
        message: "must be a 4 digit number..".red,
        required: true,
        hidden: true
      }
    }
  },

  withdrawFunds: {
    properties: {
      "withdraw funds": {
        menu: "how much would you like to withdraw?\n".blue +
              "  amount must be despensable in $20 bills..".blue,
        description: "withdraw:".green,
        pattern: /^[0-9]*[02468]0(\.00)?$/,
        message: "must be divisible by 20..".red,
        required: true
      }
    }
  },

  transferFunds: {
    properties: {
      "transfer funds": {
        menu: "how much would you like to transfer?\n".blue +
              "  amount must be despensable in $20 bills..".blue,
        description: "transfer:".green,
        pattern: /^[0-9]*[02468]0(\.00)?$/,
        message: "must be divisible by 20..".red,
        required: true
      },
      "destination account": {
        menu: "please enter destination account number to transfer?\n".blue,
        description: "account number:".green,
        pattern: /^[0-9]+$/,
        required: true
      }
    }
  },

  depositFunds: {
    properties: {
      "deposit funds": {
        menu: "how much would you like to deposit today?\n".blue +
              "  I accept $20 bills and personal checks of all amounts..".blue,
        description: "deposit funds: format 00.00:".green,
        pattern: /^[0-9]+\.[0-9][0-9]$/,
        message: "include to two decimal places".red,
        required: true
      }
    }
  }
};

module.exports = promptSchemas;