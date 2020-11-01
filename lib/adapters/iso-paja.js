var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://www.hhravintolat.fi/iso-paja-lounaslista';

function parse(body) {
    $ = cheerio.load(body);
    
    var content = $('div[data-testid="mesh-container-content"]').text();
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
        if (Object.keys(result).length && row.startsWith('Ravintola Iso Paja')) {
        // stop parsing at this point
            parseComplete = true;
            return;
        }
        var possibleDay = util.extractDay(row);
        if(possibleDay) {
            day = possibleDay;
            result[day] = [];
        } else if (result[day]) {
            result[day].push(row.trim());
        }
    });
    return result;
}

function parseOld(body) {
    body = body.split('<br />').join('\n');
    $ = cheerio.load(body);
    var content = $('.mc1inlineContent');
    var lists = content.find('.font_8');

    // lunch is monday- friday
    // every day has 4 different menus

    var res = {};

    var count = 0;
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

    for(var i=1;i<lists.length;i++) {
        var list = $(lists[i]);
        if(days === 5 && res[day].length === 4) {
            break;
        }
        if(!isEmpty(list)) {
            var text = list.text();
            switch(count) {
                // when 0 then its weekday
                case 0:
                    day = util.days[days];
                    res[day] = [];
                    count++;
                    days++;
                    break;
                // or default it's lunch
                default:
                    if(count < 5) {
                        res[day].push(text);
                    }

                    if(res[day].length === 4) {
                        count = 0;
                    } else {
                        count++;
                    }

            }

        }

    }
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

module.exports = {
    name : "Iso Paja",
    url : url,
    parse : parse,
    getMenu : getMenu
};
