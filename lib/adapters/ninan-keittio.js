var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.ninankeittio.fi/pasila';

function parse(body) {
    $ = cheerio.load(body,{ decodeEntities: false });
    var menus = $('.menu').find('.menu-food p').toArray();

    var res = {};
    menus.forEach(function(day, index) {
        var dayMenu = $(day);
        var list = [];
        res[util.days[index]] = list;

        var menu = dayMenu.html().split('<br>');
        menu.forEach(function(item) {
            item = item.trim();
            item = item.replace('\\r', '');
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
    name : "Ninan keittiö",
    url : url,
    parse: parse,
    getMenu : getMenu
};
