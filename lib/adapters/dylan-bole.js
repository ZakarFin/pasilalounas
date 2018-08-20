var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://www.dylan.fi/bole/';

function parse(body) {
    body = body.split('<br />').join('\n');
    $ = cheerio.load(body);
    var content = $('div.sqs-block-content');
    var lists = content.find('p.text-align-center');

    var res = {};

    var days = 0;
    var day = null;

    var isEmpty = function(el){
        if(el.text().replace(/\s|&nbsp;/g, '').length == 0) {
            return true;
        }
        if(el.text().replace(/\s| /g, '').length == 0) {
            return true;
        }
        return false;
    };

    for(var i=5;i<lists.length;i++) {
        var list = $(lists[i]);

        if(list.find('strong').length > 0 && isEmpty(list.find('strong'))) {
            continue;
        }

        // if list include strong element then it's day name
        if(list.find('strong').length > 0) {
            day = util.days[days];
            res[day] = [];
            days++;
        }
        // other are menu items, handling monday - thursday
        else if (res[day] && days < 5){
            res[day].push(list.text());
        }
        // friday needs special parsing
        else if (res[day]) {
            res[day].push(list.text());
            // check next p tag if its empty then breaks parsing
            if(list.next('p').length > 0 && isEmpty(list.next('p'))) {
                break;
            }
        }

    }
    return res;
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
    name : "Dylan Böle",
    url : url,
    parse : parse,
    getMenu : getMenu
};
