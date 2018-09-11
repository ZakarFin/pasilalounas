'use strict'

let fs = require('fs');
let util = require('../util');
let rafla = require('./amica-sarastus');
var parsers = require('../parsers');
let expect = require('chai').expect;

describe(rafla.name, () => {
  describe('"parse"', () => {
    it('should return a menu', (done) => {
      /*
      rafla.getMenu()
        .then(function(data) {
          console.log(data);
          done();
        })
        .catch(function(e) {
          console.log('e', e); 
          done();
        });
        */
        var contents = fs.readFileSync(__dirname + '/amica-sarastus.json').toString();
        var result = parsers.parseFazerJSON(contents);
        console.log(result);
        done();
      });
  });
  /*
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
  });*/
});
