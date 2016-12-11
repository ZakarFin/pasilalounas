var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");

var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');
var url = 'http://www.antell.fi/lounaslistat/lounaslista.html?owner=268';

function getMenu() {
    return new Promise(function(resolve, reject) {
        request(url, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(error);
                return;
            }
            $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            var dayTables = $('#lunch-content-table table.show');
            var result = [];
            dayTables.each(function(index, elem) {
                if($(elem).find('tr').length < 5) {
                    // usually not a menu table
                    return;
                }
                var txt = $(elem).text().trim();
                if(startsWithDay(txt)) {
                    result.push(txt);
                } else {
                    result[result.length -1] = result[result.length -1] + '\n' + txt;
                }
            });
            var res = {};
            result.forEach(function(day) {
                var menu = day.split('   ');
                var day = menu.shift().toLowerCase();

                menu = menu.filter(hasValue);
                res[day] = menu;
            });
            resolve(res);
        });
    });
}

function hasValue(value) {
  return value.length > 1;
}

function startsWithDay(txt) {
    var isDay = false;
    days.forEach(function(day) {
        if(isDay) {
            return;
        }
        isDay = (txt.toLowerCase().indexOf(day) === 0);
    })
    return isDay;
}

module.exports = {
    name : "Antell",
    url : url,
    getMenu : getMenu
};