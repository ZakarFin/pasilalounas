'use strict'

const fs = require('fs');
const util = require('../util');
const rafla = require('./ninan-keittio');
const expect = require('chai').expect;
console.log('moi')

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
    
    it('should return a menu', (done) => {
        result.then(function(menu) {
            util.days.forEach(function(day) {
                expect(menu[day].length).to.be.above(0);
            });
            done();
        }).catch(function(err) {
            console.log('Error getting menu from ' + rafla.name, err);
        });
      });
      
  });
  describe('"parse"', () => {
    it('should return a menu', () => {

        var contents = fs.readFileSync(__dirname + '/ninan-keittio.html').toString();
        var result = rafla.parse(contents);
        
        console.log(result);
      });
  });
});
