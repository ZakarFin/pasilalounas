var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://www.dylan.fi/bole/';

function parse(body) {
    $ = cheerio.load(body);
    var content = $('div[role="grid"]');
    if (content.length < 2) {
      console.log('Couldnt find lunch list');
      return {};
    }
    content = $(content[0]).text();
    content = content || '';
    content = content.split('\n');
    var result = {};
    var day = null;
    content.forEach(row => {
        row = row.trim();
        // there's a special character that we want to get rid of
        // it isn't shown in the IDE but parsing doesn't work without this
        row = row.split('​').join('');
        if (row === '') {
            return;
        }
        if(util.startsWithDay(row)) {
            day = util.extractDay(row);
            result[day] = [];
        } else if (result[day]) {
            result[day].push(row);
        }
    });
    return result;
}

function getMenu() {
  return new Promise (function(resolve, reject) {

    // Dylan Böle needs user agent definition, default not work
    var options = {
      url: url,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Host': 'www.dylan.fi',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
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
    name : "Dylan Böle",
    url : url,
    parse : parse,
    getMenu : getMenu
};
