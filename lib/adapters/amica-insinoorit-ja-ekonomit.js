var request = require('request');
var Promise = require('bluebird');
var moment = require('moment');
var parsers = require('../parsers');
var cheerio = require('cheerio');

var url = 'https://www.fazerfoodco.fi/ravintolat/Ravintolat-kaupungeittain/helsinki/insinoorit--ekonomit--talo/';
var now = moment();
//http://www.amica.fi/api/restaurant/menu/week?language=fi&restaurantPageId=8241&weekDate=2018-3-6 
var jsonUrl = 'https://www.fazerfoodco.fi/api/restaurant/menu/week?language=fi&restaurantPageId=221043&weekDate=' + now.startOf('isoweek').format('YYYY-M-D');
/*
https://www.fazerfoodco.fi/api/restaurant/menu/week?language=fi&restaurantPageId=221043&weekDate=2018-8-20
language: fi
restaurantPageId: 221043
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
                var json = JSON.parse(body);
                resolve(parse(json));
            } catch(e) {
                con
                reject(e);
            }
        });
    });
}

function parse(json) {
    /*
    "LunchMenus": [
      {
        "DayOfWeek": "Maanantai",
        "Date": "5.3.2018",
        "SetMenus": [],
        "Html": "<p>Blini,siianmätiä,sipulia ja smetanaa tai porkkana – ja punajuurihumusta tai savulohitahnalla 11,90€</p>\n<p>Buffet 10,40€</p>\n<p>Kasviskiusausta (A, G, L)<br />Savujuusto-juuressosekeittoa (A, G, VL)<br />Maustettua broilerinseläkettä ( G,L,M ) Barbequekastiketta (G, L, M) Pastaa ( L,M ) Parmesanjuustoa (A, G, L)<br />Sitruunakuorrutettua seitifileetä (*, A, L,G,M) Jogurtti-yrttikastiketta (A, G, L) Keitettyjä perunoita (*, G, L, M, Veg)<br />Ruusunmarjarahkaa (A, G, L)<br />Mozzarellasalaatti (A, G, VL)</p>"
      },... ]} */
      var res = {};
      json.LunchMenus.forEach(function(dayItem) {
        var $ = cheerio.load(dayItem.Html.split('<br />').join('\n'));
        res[dayItem.DayOfWeek.toLowerCase()] = $.text().split('\n');
      })
      return res;
}



module.exports = {
    name : "Insinöörit & Ekonomit",
    url : url,
    getMenu : getMenu,
    coords: [24.936900592903555, 60.19766398402382],
    parse: parse
};
