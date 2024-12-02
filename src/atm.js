var Account, prompt, promptSchemas, colors, ATM;
Account = require('./account.js');
promptSchemas = require('./prompt_schemas.js');
prompt = require('prompt');
colors = require('colors');

ATM = (function() {
  function ATM() {
    var bankID, session, sessionPin, defaultScreenCallback,userRegistrationCallback, transactionMenu,
      transactionMenuCallback, promptAnotherTransaction, anotherTransactionCallback,
       withdrawFundsCallback, depositFundsCallback, clearScreen;
    bankID = Math.floor(Math.random() * 1000000000000000).toString(10);

    prompt.start();
    prompt.message = "";
    prompt.delimiter = " ";
    this.atmStatus = "ON";
    this.accounts = [];

    clearScreen = function() {
      process.stdout.write('\u001B[2J\u001B[0;0f');
    };


    defaultScreenCallback = function(err, choice) {
      clearScreen();
      if (err) { return; }
      if (choice["default screen"] === "1") {
        prompt.get( promptSchemas.loginSchema, this.startSession.bind(this) );
      }
      else{
        prompt.get( promptSchemas.userRegistration, userRegistrationCallback.bind(this) );
      }
    };

    userRegistrationCallback = function(err, credentials) {
      clearScreen();
      if (err) { return; }
      if ( credentials["secure pin"] !== credentials["verify pin"] ) {
        console.error("pin verification did not match".red);
        return prompt.get( promptSchemas.userRegistration, userRegistrationCallback.bind(this) );
      }
      var initDeposit = parseFloat( credentials["initial deposit"] ),
      initPin = credentials["secure pin"],
      username = credentials["user name"]
      accountNumber = this.newAccount(initDeposit, initPin, username),
      accountNumberString = accountNumber.toString(10).red;
      console.log( "\n\n\n\n\n\n\n\n\n\n\n","Hi ".blue + username.blue );
      console.log( "\n\n\n\n\n\n\n\n\n\n\n","WRITE THIS DOWN: your account number is ".blue + accountNumberString );
      this.startSession( err, {"account number": accountNumber, "pin": initPin}, true );
    };

    promptAnotherTransaction = function(){
      console.log("\n\n\n\n");
      prompt.get( promptSchemas.anotherTransaction, anotherTransactionCallback.bind(this) );
    };

    anotherTransactionCallback = function(err, choice) {
      if (err) { return; }
      const answer = choice["another transaction?"].toLowerCase();
      if ( answer === "yes" || answer === "y" ) {
        transactionMenu.call(this);
      }
      else {
        this.endSession();
      }
    };

    transactionMenu = function() {
      clearScreen();
      console.log(promptSchemas["transactionMenu"]["properties"]["transaction menu"]["menu"]);
      prompt.get( promptSchemas.transactionMenu, transactionMenuCallback.bind(this) );
    };

    withdrawFundsCallback = function (err, amount) {
      if (err) { return; }
      console.log("\n\n\n\n\n\n");
      var withdrawalAmount = parseInt(amount["withdraw funds"], 10),
      balance = this.withdrawFunds(withdrawalAmount),
      balanceString = "$" + balance.toString(10).red;
     
      if (balance === "insufficient funds") {
        console.error("insufficient funds for requested transaction".red);
        return promptAnotherTransaction.call(this);
      }
      console.log( "\n\n\n\n\n\n\n\n\n\n\n","Hi ".blue + session.getUserName().blue );
      console.log("success! your new balance is: ".blue, balanceString);
      promptAnotherTransaction.call(this);
    };

    depositFundsCallback = function (err, amount) {
      if (err) { return; }
      console.log("\n\n\n\n\n\n");
      var depositAmount =  parseFloat( amount["deposit funds"] ),
      balance = this.depositFunds(depositAmount),
      balanceString = "$" + balance.toString(10).red;
      console.log( "\n\n\n\n\n\n\n\n\n\n\n","Hi ".blue + session.getUserName().blue );
      console.log("success! your new balance is: ".blue, balanceString);
      promptAnotherTransaction.call(this);
    };

    transferFundsCallback = function (err, amount) {
      if (err) { return; }
      console.log("\n\n\n\n\n\n");
      var trnasferAmount =  parseFloat( amount["transfer funds"] ),
      destAccount =  parseInt( amount["destination account"] ),
      balance = this.transferFunds(trnasferAmount, destAccount),
      balanceString = "$" + balance.toString(10).red;
      if (balance === "invalid account") {
        console.error("invalid destination account for requested transaction".red);
        return promptAnotherTransaction.call(this);
      }
      console.log( "\n\n\n\n\n\n\n\n\n\n\n","Hi ".blue + session.getUserName().blue );
      console.log(`success! your new balance is: `.blue, balanceString);
      promptAnotherTransaction.call(this);
    };


    transactionMenuCallback = function(err, choice) {
      if (err) { return; }
      var promptTimeOut = setTimeout(promptAnotherTransaction.bind(this), 1500);
      console.log("\n\n");
      switch (choice["transaction menu"]) {
      case "1":
        //Check Balance 
        var balance = "your balance is:  $" + this.checkBalance();
        console.log(balance.blue);
        break;
      case "2":
        //Withdraw Funds
        clearTimeout(promptTimeOut);
        console.log(promptSchemas["withdrawFunds"]["properties"]["withdraw funds"]["menu"]);
        prompt.get( promptSchemas.withdrawFunds, withdrawFundsCallback.bind(this) );
        break;
      case "3":
        //Deposit Funds
        clearTimeout(promptTimeOut);
        console.log(promptSchemas["depositFunds"]["properties"]["deposit funds"]["menu"]);
        prompt.get( promptSchemas.depositFunds, depositFundsCallback.bind(this) );
        break;
      case "4":
        //Transfer Funds
        clearTimeout(promptTimeOut);
        prompt.get( promptSchemas.transferFunds, transferFundsCallback.bind(this) );
        break;
      case "5":
        //Transfer Funds
        clearTimeout(promptTimeOut);
        this.endSession()
        break;
      }
    };

    // Create new account
    this.newAccount = function(initDeposit, initPin, name) {
      var newAccount = new Account(initDeposit, initPin, bankID, name);
      this.accounts.push(newAccount);
      newAccount.accountNumber = this.accounts.length + 195341;
      return newAccount.accountNumber;
    };
   
    this.on = function() {
      clearScreen();
      session = null;
      sessionPin = null;
      prompt.get( promptSchemas.defaultSchema, defaultScreenCallback.bind(this) );
      this.atmStatus = "LISTENING";
    };
    this.startSession = function(err, credentials, newUser) {
      if (err) {
        return; 
      }
      var accountNumber = credentials["account number"];
      if ( this.accounts[accountNumber - 195342] instanceof Account) {
        var verified,
        pin = credentials["pin"];
        verified = this.accounts[accountNumber - 195342].validate(pin, bankID);
        if (verified) {
          session = this.accounts[accountNumber - 195342];
          sessionPin = pin;
          this.atmStatus = "IN SESSION";
          if (!newUser) {
            transactionMenu.call(this);
          }
          else{
            promptAnotherTransaction.call(this);
          }
          return "session started";
        }
       
        setTimeout(this.on.bind(this), 2000);
        console.error("bad credentials".red);
        return "invalid credentials";
      }
      
      setTimeout(this.on.bind(this), 2000);
      console.error("invalid account number".red);
      return "invalid account";
    };

    this.checkBalance = function() {
      if (session) {
        var balance = session.retrieveBalance(sessionPin, bankID);
        return balance;
      }
      return "invalid session";
    };

    this.withdrawFunds = function(amount) {
      if (session) {
        var newBalance,
        balance = this.checkBalance();
        if (balance >= amount) {
          newBalance = balance - amount;
          balance = session.editBalance(sessionPin, bankID, newBalance);
          return balance;
        }
        return "insufficient funds";
      }
      return "invalid session";
    };

    this.depositFunds = function(amount) {
      if (session) {
        var newBalance,
        balance = this.checkBalance();
        newBalance = balance + amount;
        balance = session.editBalance(sessionPin, bankID, newBalance);
        return balance;
      }
      return "invalid session";
    };

    this.transferFunds = function(amount, accountNumber) {
      if (session) {
        var newBalance,
        balance = this.checkBalance();
        if (this.accounts[accountNumber - 195342] instanceof Account) {
          if (balance >= amount) {
            var newBalance = balance - amount;
            balance = session.editBalance(sessionPin, bankID, newBalance);
            var destAccount = this.accounts.find(account => account.accountNumber === accountNumber)
            var destBalance = destAccount.userBalance
            destAccount.changeBalance(destBalance + amount)
            return balance;
          }
          return "insufficient funds";
        }
        console.error("invalid account number".red);
        return "invalid account";
      }
      return "invalid session";
    };

    this.endSession = function () {
      if (session) {
        session = null;
        sessionPin = null;
        this.on();
      }
    };
  }
  return ATM;
})();

module.exports = ATM;