'use strict'

const fs = require('fs');
const util = require('../util');
const rafla = require('./merohimal');
const expect = require('chai').expect;

describe(rafla.name, () => {
  describe('"parse"', () => {
    it('should return a menu', () => {

        var contents = fs.readFileSync(__dirname + '/merohimal.html').toString();
        var result = rafla.parse(contents);
        console.log(result);
      });
  });
});
