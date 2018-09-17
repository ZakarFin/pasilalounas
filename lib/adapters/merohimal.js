var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.merohimal.fi/lounas';

function parse(body) {
    //console.log(body);
    $ = cheerio.load(body);
    var panels = $('.panels').find('.panel').toArray();
    //var panels = $('.tabPanel_maanantai\-0');
    //console.log(panels.text());
    var res = {};
    panels.forEach(function(day, index) {
        var dayPanel = $(day);
        var list = [];
        res[util.days[index]] = list;

        var menu = dayPanel.text().split('\n');
        menu.forEach(function(item) {
            item = item.trim();
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
    name : "Mero-Himal",
    url : url,
    parse: parse,
    coords: [24.93793305412467, 60.19978240395383],
    getMenu : getMenu
};
