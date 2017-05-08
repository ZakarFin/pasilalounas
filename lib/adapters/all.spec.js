'use strict'

const util = require('../util');
const expect = require('chai').expect;

const fs = require('fs');
fs.readdir(__dirname, (err, files) => {
  files.forEach(file => {
      if(isAdapter(file)) {
          checkExports(file, require('./' + file));
      }
  });
})
function isAdapter(file) {
   return !file.endsWith('.spec.js') && file.endsWith('.js');
}
function checkExports(file, rafla) {
    describe('Check adapter for ' + rafla.name, () => {
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
    });
}
