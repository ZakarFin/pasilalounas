var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.ravintolablancco.com/louna-viikko/pasila-2/';

function parse(body) {
    $ = cheerio.load(body);
    var pTags = $('#site-main .entry-content p');
    var result = [];
    pTags.each(function(index, elem) {
        var txt = $(elem).text();
        if(util.startsWithDay(txt)) {
            result.push(txt);
        } else {
            result[result.length -1] = result[result.length -1] + '\n' + txt;
        }
    });
    var res = {};
    result.forEach(function(day) {
        var menu = day.split('\n');
        var day = menu.shift().toLowerCase();
        // just take the day, remove the possible date after it
        day = day.split(" ")[0];
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
