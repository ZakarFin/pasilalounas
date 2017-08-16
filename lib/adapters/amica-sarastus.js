var request = require('request');
var Promise = require('bluebird');
var moment = require('moment');
var parsers = require('../parsers');

var url = 'http://www.amica.fi/sarastus';
var jsonUrl = 'http://www.amica.fi/modules/json/json/Index?costNumber=3593&language=fi';
var now = moment();
jsonUrl += '&firstDay=' + now.startOf('isoweek').format('YYYY-MM-DD');

function getMenu() {
    return new Promise(function(resolve, reject) {
        request(jsonUrl, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(error);
                return;
            }

            resolve(parsers.parseAmicaJSON(body));
        });
    });
}

module.exports = {
    name : "Sarastus",
    url : url,
    getMenu : getMenu
};
