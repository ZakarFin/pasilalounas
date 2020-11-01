var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://thetower.fi';

function parse(body) {
    $ = cheerio.load(body);
    // div id="lounas" div class="gst-row"
    var content = $('#lounas div.gst-row').text();
    content = content || '';
    content = content.split('\n');

    var result = {};
    var day;
    var parseComplete = false;
    content.forEach(row => {
      if (parseComplete) {
        return;
      }
      row = row.trim();
        if (row === '') {
            return;
        }
        if (row.startsWith('Tarjoilemme lounasta arkisin')) {
          // stop parsing at this point
            parseComplete = true;
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

    // Send user agent definition to mimic a browser
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
    name : "The Tower",
    url : url,
    parse : parse,
    getMenu : getMenu
};
