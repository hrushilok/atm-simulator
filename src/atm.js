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
      var answer = choice["another transaction?"].toLowerCase();
      if ( answer === "yes" || answer === "y" ) {
        transactionMenu.call(this);
      }
      else {
        this.endSession();
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