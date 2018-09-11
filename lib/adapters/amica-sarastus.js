var request = require('request');
var Promise = require('bluebird');
var moment = require('moment');
var parsers = require('../parsers');

var now = moment();
var url = 'https://www.fazerfoodco.fi/ravintolat/Ravintolat-kaupungeittain/helsinki/sarastus/';
//var jsonUrl = 'http://www.amica.fi/modules/json/json/Index?costNumber=224970&language=fi';
var jsonUrl = 'https://www.fazerfoodco.fi/api/restaurant/menu/week?language=fi&restaurantPageId=224970&weekDate=' + now.startOf('isoweek').format('YYYY-M-D');
//jsonUrl += '&firstDay=' + now.startOf('isoweek').format('YYYY-MM-DD');

function getMenu() {
    return new Promise(function(resolve, reject) {
        request(jsonUrl, function (error, response, body) {         
            if (error || response.statusCode !== 200) {
                reject(error);
                return;
            }

            resolve(parsers.parseFazerJSON(body));
        });
    });
}

module.exports = {
    name : "Sarastus",
    url : url,
    getMenu : getMenu
};
