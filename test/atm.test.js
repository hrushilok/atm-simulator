/* eslint-disable no-undef */
const prompt = require('prompt');
const ATM = require('../src/atm.js');

describe("ATM", function() {
  describe('constructor', function() {
    const atm = new ATM();
    test("should initialize", function() {
      expect(atm.constructor.name).toBe("ATM");
    });
    test('should have accounts property', function() {
      const isArray = Array.isArray(atm.accounts);
      expect(atm).toHaveProperty("accounts")
      expect(isArray).toBeTruthy();
    });
  });
  describe("on", function(){
    const atm = new ATM();
    test("should listen for user to start session", function() {
      expect(atm.atmStatus).toBe("ON");
      atm.on();
      expect(atm.atmStatus).toBe("LISTENING");
    });
  });
  describe("startSession", function() {
    let inSession,
    atm = new ATM(),
    userNum = atm.newAccount(5000, '4242'),
    credentials = {"account number": userNum, "pin": "4242"};
    test("should be able to start new bank session", function () {
      inSession = atm.startSession(null, credentials);
      expect(inSession).toBe("session started");
    });
    test("should validate user", function() {
      const credentials = {"account number": userNum, "pin": "5000"};
      inSession = atm.startSession(null, credentials);
      expect(inSession).toBe("invalid credentials")
    });
  });
  describe("newAccount", function() {
    const atm = new ATM();
    test("should be able to create new account", function() {
      let userNum, user;
      userNum = atm.newAccount(5000, '4242');
      user = atm.accounts[userNum - 111112];
      expect(user.constructor.name).toBe("Account");
      expect(atm.accounts.length).toBe(1);
    });
  });
  describe("checkBalance", function() {
    const atm = new ATM(),
    userNum = atm.newAccount(5000, '4242'),
    credentials = {"account number": userNum, "pin": "4242"};
    atm.startSession(null, credentials);
    test("should be able to retrieve user's balance", function() {
      const balance = atm.checkBalance();
      expect(balance).toBe(5000);
    });
  });
  describe("withdrawFunds", function() {
    const atm = new ATM();
    const userNum = atm.newAccount(5000, '4242');
    const credentials = {"account number": userNum, "pin": "4242"};
    atm.startSession(null, credentials);
    test("should be able to withdraw from user account", function() {
      let balance = atm.checkBalance();
      expect(balance).toBe(5000);
      balance = atm.withdrawFunds(500);
      expect(balance).toBe(4500);
    });
    test("should not be able to withdraw more than current balance", function() {
      const error = atm.withdrawFunds(6000);
      expect(error).toBe("insufficient funds");
    });
  });
  describe("depositFunds", function() {
    const atm = new ATM();
    const userNum = atm.newAccount(5000, '4242');
    const credentials = {"account number": userNum, "pin": "4242"};
    atm.startSession(null, credentials);
    test("should be able to deposit funds", function() {
      let balance = atm.checkBalance();
      expect(balance).toBe(5000);
      balance = atm.depositFunds(1000);
      expect(balance).toBe(6000);
    });
  });
  describe("endSession", function() {
    const atm = new ATM();
    const userNum = atm.newAccount(5000, '4242');
    const credentials = {"account number": userNum, "pin": "4242"};
    prompt.logger.setMaxListeners(20);
    atm.startSession(null, credentials);
    test("should be able to end a user session", function() {
      //Can perform transactions while authenticated//
      let balance = atm.checkBalance();
      expect(balance).toBe(5000);
      //Out of session transactions result in errors//
      atm.endSession();
      const error = atm.checkBalance();
      expect(error).toBe("invalid session");
    });
  });
});