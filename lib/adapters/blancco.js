var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.ravintolablancco.com/lounas-ravintolat/pasila/';

function parse(body) {
    var $ = cheerio.load(body);
    var pTags = $('.page-content p');
    var result = [];
    pTags.each(function(index, elem) {
        var txt = $(elem).text();
        var dayMenu = txt.split('\n').filter(function(item) {
            return item !== '';
        });
        result.push(dayMenu);
    });
    // Shift out "Lounashinnat"
    result.shift();
    var res = {};
    util.days.forEach(function(day, index) {
        res[day] = result[index];
    });
    return res;
}

function getMenu() {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            reject(error);
            return;
        }
        resolve(parse(body));
    });
  });
}
module.exports = {
    name : "Blancco",
    url : url,
    parse: parse,
    coords: [24.939546534972152, 60.19907358380755],
    getMenu : getMenu
};
