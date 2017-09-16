var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.lounaspaikat.com/beta/menu/';
function parse(body) {

    $ = cheerio.load(body);
    var dayContents = $('.et_section_regular');

    var res = {};
    var latestDay;
    dayContents.each(function(index, elem) {
        var txt = $(elem).text().trim();
        var result = txt.split('\n').filter(hasValue);
        result.forEach(function(item) {
            var row = item.trim();
            var day = extractDay(row);
            if(day) {
                res[day] = [];
                latestDay = day;
                return;
            }
            if(!latestDay) {
                return;
            }
            res[latestDay].push(row);
        });
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

function extractDay(txt) {
    var currentDay;
    util.days.forEach(function(day) {
        if(currentDay) {
            return;
        }
        var rowContent = txt.toLowerCase();
        if(rowContent.indexOf(day) === 0) {
            currentDay = day;
        }
        if(!currentDay && txt.length > 5) {
            // keskiviikko == keskiviiko in sample html
            if(rowContent.substring(0,5).indexOf(day.substring(0,5)) === 0) {
                currentDay = day;
            }
        }
    })
    return currentDay;
}

function hasValue(value) {
  return value.trim().length > 1;
}
module.exports = {
    name : "Ratakivi",
    url : url,
    parse : parse,
    getMenu : getMenu
};
