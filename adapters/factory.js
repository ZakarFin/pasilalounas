var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");

var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');
var url = 'http://www.ravintolafactory.com/lounasravintolat/ravintolat/helsinki-vallila/';

function getMenu() {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            reject(error);
            return;
        }
        $ = cheerio.load(body);
        var content = $('section.post_content div.nopadding');
        var result = [];
        content.children().each(function(index, elem) {
            var dom = $(elem);
            // remove footer
            dom.find('div#blueimp-gallery').remove();
            
            var txt = dom.text().trim();
            //h3 -> päivä
            //seuraava p -> sisältö
            if(dom.is('h3')) {
                if(startsWithDay(txt)) {
                    result.push({
                        name : txt,
                        desc : ''
                    });
                }
            } else if(dom.is('p') && result.length) {
                var curRes = result[result.length -1];
                curRes.desc = curRes.desc + '\n' + txt;
            }
        });
        var res = {};
        result.forEach(function(item) {
            var day = extractDay(item.name);
            var menu = item.desc.split('\n');
            res[day] = menu;
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
module.exports = {
    name : "Factory",
    url : url,
    getMenu : getMenu
};
