var request = require('request');
var moment = require('moment');
var util = require('../util');

var url = 'http://ruokalistat.leijonacatering.fi/#/4fd75ded-e510-e511-892b-78e3b50298fc';

function getMenu() {
    return new Promise(function(resolve, reject) {
        getMenuUrl().
            then(getMenuItems).
            then(function(result) {
                resolve(result);
            });
    });
}
module.exports = {
    name : "Keltasirkku",
    url : url,
    getMenu : getMenu
};

var dayMap = {
    "Monday" : util.days[0],
    "Tuesday" : util.days[1],
    "Wednesday" : util.days[2],
    "Thursday" : util.days[3],
    "Friday" : util.days[4]
};

function getDay(name) {
    return dayMap[name];
}

function isCurrentDate(start, end) {
    var now = moment();
    return now.isAfter(start) && now.isBefore(end);
}

function getMenuItems(url) {
    return new Promise(function(resolve, reject) {
        request(url, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(error);
                return;
            }
            var json = JSON.parse(body);
            var result = {};
            json.Days.forEach(function(item) {
                var day = getDay(item.WeekDay);
                var menu = item.Meals.map(function(meal) {
                    return meal.Name;
                });
                result[day] = menu;
            });
            resolve(result);
        });
    });

}

function getMenuUrl() {
    return new Promise(function(resolve, reject) {
        var url = 'http://ruokalistat.leijonacatering.fi/AromiStorage/blob/main/AromiMenusJsonData';
        request(url, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(error);
                return;
            }
            var json = JSON.parse(body);
            // -> Restaurants -> Name == keltasirkku
            var keltasirkku = json.Restaurants.filter(function(value) {
                return value.Name.toLowerCase().indexOf('keltasirkku') !== -1
            });
            var menuItem = keltasirkku[0].JMenus.filter(function(value) {
                return isCurrentDate(value.Start, value.End);
            });
            resolve('http:' + menuItem[0].LinkUrl);
        });
    });
}
