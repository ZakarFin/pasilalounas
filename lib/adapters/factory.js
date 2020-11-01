var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

var url = 'http://www.ravintolafactory.com/lounasravintolat/ravintolat/helsinki-vallila/';

function parse(body) {
    $ = cheerio.load(body);
    
    var content = $('div.list').text();
    content = content || '';
    // console.log(content);
    content = content.split('\n');

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
            result[day].push(row.trim());
        }
    });
    return result;
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
    name : "Factory",
    url : url,
    coords: [24.941944305230066, 60.196515213365984],
    getMenu : getMenu,
    parse: parse
};
