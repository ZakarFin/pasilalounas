var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://www.delicatessen.fi/lounaslistat/lime-park';

function parse(body) {
    //console.log(body);
    $ = cheerio.load(util.formatXml(body));
    
    var panels = $('div.bodytext.shortDescription').find('ul').toArray();
    var res = {};
    panels.forEach(function(day, index) {
        var dayPanel = $(day);
        var list = [];
        res[util.days[index]] = list;

        var menu = dayPanel.text();
        //console.log(menu)
        menu = menu.split('\n');
        menu.forEach(function(item) {
            item = item.trim();
            if (util.startsWithDay(item)) {
                // skipping day
                return;
            }
            if(item.length > 1) {
                list.push(item);
            }
        });
    });
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
    name : "Lime Park",
    url : url,
    parse: parse,
//    coords: [24.93793305412467, 60.19978240395383],
    getMenu : getMenu
};
