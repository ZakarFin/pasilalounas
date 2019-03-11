var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://www.antell.fi/akavatalo';

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

function parse(body) {

    $ = cheerio.load(body, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    var dayTables = $('.lunch-menu-days .reveal-slideup-delay-0');
    var result = [];
    var res = {};
    dayTables.each(function(index, elem) {
        var day = util.extractDay($(elem).find('h3').text());
        var menu =[];
        $(elem).find('li').each(function(index, item) {
            var row = $(item).text().trim();
            if(row.indexOf("&euro;") === -1) {
                menu.push(row);
            }
        });
        res[day] = menu;
    });
    return res;
}

function hasValue(value) {
  return value.length > 1;
}

module.exports = {
    name : "Antell",
    url : url,
    parse: parse,
    getMenu : getMenu,
    coords: [24.937206764498086, 60.20077783201927]
};
