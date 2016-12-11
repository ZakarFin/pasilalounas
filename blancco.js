var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");

var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');

function getMenu(callback) {
  return new Promise(function(resolve, reject) {
    request('http://www.ravintolablancco.com/louna-viikko/pasila-2/', function (error, response, body) {
        if (error || response.statusCode !== 200) {
            reject(error);
            //callback(error);
            return;
        }
        $ = cheerio.load(body);
        var pTags = $('#site-main .entry-content p');
        var result = [];
        //var wasHeading = false;
        pTags.each(function(index, elem) {
            var txt = $(elem).text();
            if(startsWithDay(txt)) {
                result.push(txt);
            } else {
                result[result.length -1] = result[result.length -1] + '\n' + txt;
            }
        });
        var res = {};
        result.forEach(function(day) {
            var menu = day.split('\n');
            var day = menu.shift().toLowerCase();
            res[day] = menu;
        });
        resolve(res);
        //callback(null, res); 
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
module.exports = getMenu;
