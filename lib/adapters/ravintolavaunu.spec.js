'use strict'

var fs = require('fs');

const rafla = require('./ravintolavaunu');
const expect = require('chai').expect;

describe(rafla.name, () => {
  describe('"getMenu"', () => {
    it('should export a function', () => {
      expect(rafla.getMenu).to.be.a('function');
    });
    var result;
    it('should return a Promise', () => {
      result = rafla.getMenu();
      expect(result.then).to.be.a('Function');
      expect(result.catch).to.be.a('Function');
    });
  });

    describe('"parse"', () => {
      it('should return a menu', () => {

          var contents = fs.readFileSync(__dirname + '/ravintolavaunu.html').toString();
          var result = rafla.parse(contents);
          //console.log(result);
        });
    });
});
