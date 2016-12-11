var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");

var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');

function getMenu(callback) {

  return new Promise(function(resolve, reject) {
        request('http://www.ravintola911.fi/kumpulantien-lounaslista/', function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(error);
                //callback(error);
                return;
            }
            $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            var dayTables = $('#inner-content p');
            var result = [];
            var inHeading = true;
            var dayChange = -1;
            dayTables.each(function(index, elem) {
                var txt = $(elem).text().trim();
                if(txt.indexOf('————') === 0) {
                    inHeading = false
                    return;
                }
                if(inHeading) {
                    return;
                }
                if(txt.indexOf('……') === 0) {
                    dayChange = index;
                    return;
                }
                if((dayChange === -1 || dayChange === index -1) && startsWithDay(txt)) {
                    result.push(txt);
                } else {
                    result[result.length -1] = result[result.length -1] + '\n' + txt;
                }
            });
            // the last one is some extra stuff
            //result.pop();

            var res = {};
            result.forEach(function(day) {
                var menu = day.split('\n');
                var day = menu.shift().toLowerCase();
                var curDay = extractDay(day);
                var dessert = day.split(' ');
                dessert.shift();
                dessert.shift();
                // add to front
                menu.unshift(dessert.join(' '));
                res[curDay] = menu;
            });
            resolve(res);
            //callback(null, res); 
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
function extractDay(txt) {
    var currentDay;
    days.forEach(function(day) {
        if(currentDay) {
            return;
        }
        if(txt.toLowerCase().indexOf(day) === 0) {
            currentDay = day;
        }
    })
    return currentDay;
}
module.exports = getMenu;
