/* eslint-disable no-undef */
const Account = require('../src/account.js');

describe("Account", function() {
  const bankID = '12345678912345'
  describe("constructor", function() {
    const user = new Account(2000, '4385', bankID, 'bob');
    test("should initialize", function() {
      expect(user.constructor.name).toBe("Account");
    });
    test("should accept initial deposit,pin,bankID", function() {
      expect((Account).length).toBe(4);
    });
  });
  describe("validate", function() {
    const user = new Account(2000, '4385', bankID);
    test("should accurately validate provided pin", function() {
      let valid = user.validate("5000", bankID);
      expect(valid).toBeFalsy();
      valid = user.validate("4385", bankID);
      expect(valid).toBeTruthy();
    });
  });
  describe("retrieveBalance", function() {
    const user = new Account(2000, '4385', bankID);
    test("should be able to retrieve current Balance", function() {
      const balance = user.retrieveBalance('4385', bankID);
      expect(balance).toBe(2000);
    });
    test("should log error if pin is invalid", function() {
      const balance = user.retrieveBalance('5000', bankID);
      expect(balance).toBe('invalid credentials');
    });
  });
  describe("editBalance", function() {
    test("should be able to change user's balance", function() {
      //Confirm expected balance
      const user = new Account(2000, '4385', bankID);
      let balance = user.retrieveBalance('4385', bankID);
      expect(balance).toBe(2000);
      //Change balance and rerun assertion
      user.editBalance('4385', bankID, 5000);
      balance = user.retrieveBalance('4385', bankID);
      expect(balance).toBe(5000);
    });
  });
});