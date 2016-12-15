var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");

var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');
var url = 'http://www.jk-kitchen.fi/index.php/lounaslistavaunu';

function getMenu() {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            reject(error);
            return;
        }
        body = body.split('<br />').join('\n');
        $ = cheerio.load(body);
        var content = $('.items-leading');
        var txt = content.text();
        console.log(content.html());
        var result = txt.split('\n').filter(hasValue);
        var res = {};
        var latestDay;
        result.forEach(function(item) {
            var txt = item.trim();
            if(txt.indexOf('MA ') === 0) {
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
            
            res[latestDay].push(txt);
        });
        resolve(res);
    });
  });
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

function hasValue(value) {
  return value.length > 1;
}
module.exports = {
    name : "Ravintola vaunu",
    url : url,
    getMenu : getMenu
};
