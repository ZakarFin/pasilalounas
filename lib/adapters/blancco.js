var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.ravintolablancco.com/lounas-ravintolat/pasila/';

function parse(body) {
    $ = cheerio.load(body);
    var pTags = $('.page-content p');
    //console.log(pTags.text());
    var result = [];
    pTags.each(function(index, elem) {
        var txt = $(elem).text();
            result.push(txt);
    });
    var res = {};

    util.days.forEach(function(day, index) {
        var menu = result[index].split('\n').filter(function(item) {
            return item !== '';
        });
        res[day] = menu;
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
    getMenu : getMenu
};
