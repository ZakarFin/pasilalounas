var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.lounaspaikat.com/web/menu.html';

function getMenu() {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            reject(error);
            return;
        }
        $ = cheerio.load(body);
        var content = $('#mainsub');
        var txt = content.text();

        var result = txt.split('\n').filter(hasValue);
        var res = {};
        var latestDay;
        result.forEach(function(item) {
            var txt = item.trim();
            if(txt.toLowerCase().indexOf('klo') === 0) {
                latestDay = null;
            }
            var day = extractDay(txt);
            if(day) {
                res[day] = [];
                latestDay = day;
                return;
            }
            if(!latestDay) {
                return;
            }
            if(txt.indexOf('²') === 0) {
                txt = txt.substring(1).trim();
            }
            res[latestDay].push(txt);
        });
        resolve(res);
    });
  });
}

function extractDay(txt) {
    var currentDay;
    util.days.forEach(function(day) {
        if(currentDay) {
            return;
        }
        if(txt.toLowerCase().indexOf(day) === 0) {
            currentDay = day;
        }
    })
    return currentDay;
}

function hasValue(value) {
  return value.length > 1;
}
module.exports = {
    name : "Ratakivi",
    url : url,
    getMenu : getMenu
};
