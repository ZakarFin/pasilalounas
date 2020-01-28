var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://www.signorsmith.fi/lounas';

function parse(body) {
    $ = cheerio.load(body);
    var content = $('#PAGES_CONTAINERinlineContent').text().split('Koko buffet 10,70€')[1].split('\n'); //.toArray();
    
    var result = {};
    var day;
    content.forEach(row => {
        if (row.trim() === '') {
            return;
        }
        var possibleDay = util.extractDay(row);
        if(possibleDay) {
            day = possibleDay;
            result[day] = [];
        } else if (result[day]) {
            result[day].push(row);
        }
    });
    return result;
}

function getMenu() {
  return new Promise (function(resolve, reject) {

    // Dylan Böle needs user agent defination, default not work
    var options = {
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
      }
    };
    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            reject(error);
            return;
        }
        resolve(parse(body));
    });
  });
}

module.exports = {
    name : "Signor Smith",
    url : url,
    parse : parse,
    getMenu : getMenu
};
