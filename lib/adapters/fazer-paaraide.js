var request = require('request');
var Promise = require('bluebird');
var moment = require('moment');
var parsers = require('../parsers');
var cheerio = require('cheerio');

var url = 'https://www.fazerfoodco.fi/ravintolat/Ravintolat-kaupungeittain/helsinki/opetustalo---paaraide/';
var now = moment();
var jsonUrl = 'https://www.fazerfoodco.fi/api/restaurant/menu/week?language=fi&restaurantPageId=177431&weekDate=' + now.startOf('isoweek').format('YYYY-M-D');
/*
https://www.fazerfoodco.fi/api/restaurant/menu/week?language=fi&restaurantPageId=177431&weekDate=2018-8-20
language: fi
restaurantPageId: 177431
weekDate: 2018-8-20
*/
function getMenu() {
    console.log(jsonUrl);
    return new Promise(function(resolve, reject) {
        request(jsonUrl, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(error)
                console.log(response)
                reject(error);
                return;
            }

            try {
                resolve(parsers.parseFazerJSON(body));
            } catch(e) {
                reject(e);
            }
        });
    });
}


module.exports = {
    name : "Opetustalo - Pääraide",
    url : url,
    getMenu : getMenu
//    coords: [24.936900592903555, 60.19766398402382]
};
