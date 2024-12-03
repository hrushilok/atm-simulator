var Account = (function() {
    function Account(initDeposit, initPin, bank, name) {
      const userPin = initPin;
      this.userBalance = initDeposit;
      const bankID = bank;
      const userName = name;

      //Public Methods

      this.changeBalance = function(newBalance) {
        this.userBalance = newBalance;
      };

      this.validate = function(pin, bank) {
        if (pin === userPin && bank === bankID) {
          return true;
        }
        return false;
      };

      this.getUserName = function() {
          return userName;
      };

      this.retrieveBalance = function(pin, bank) {
        if ( this.validate(pin, bank) ) {
          return this.userBalance;
        }
        return "invalid credentials";
      };

      this.editBalance = function(pin, bank, newBalance) {
        if ( this.validate(pin, bank) ) {
          this.changeBalance(newBalance);
          return this.userBalance;
        }
        return "invalid credentials";
      };

    }
    return Account;
  })();

module.exports = Account;