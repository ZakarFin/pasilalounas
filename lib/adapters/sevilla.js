var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'https://www.raflaamo.fi/fi/helsinki/sevilla-pasila/menu';

function parse(body) {
    body = body.split('<br />').join('\n');
    $ = cheerio.load(body);
    var content = $('.menu-detail__content');

    var days = content.find('h2');
    var lists = content.find('.menu-detail__dish-list');

    var res = {};

    for(var i=0;i<days.length;i++) {
        var day = $(days[i]).text().toLowerCase();
        res[day] = [];

        var list = $(lists[i]);

        // First li is lunch info, not necessary
        list.find('li').first().remove();
        var food =  list.find('li');

        for(var j=0;j<food.length;j++) {
            res[day].push($(food[j]).find('.menu-detail__dish-name').text());
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
    name : "Sevilla",
    url : url,
    parse : parse,
    getMenu : getMenu
};
