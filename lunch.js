var Promise = require("bluebird");

var places = [
    require('./adapters/antell'),
    require('./adapters/blancco'), 
    require('./adapters/ravintola911'),
    require('./adapters/keltasirkku'),
    require('./adapters/factory')
];

var cachedResult = {};
// 30mins
var expiry = 30*60*1000;
function hasExpired() {
    return cachedResult.ts < new Date().getTime() - expiry;
}

module.exports = function(day) {
    return new Promise(function(resolve, reject) {
        if(cachedResult.res && !hasExpired()) {
            resolve(filterDay(cachedResult.res, day));
            return;
        }
        var params = [];
        places.forEach(function(place) {
            params.push(place.getMenu());
        });
        params.push(function() {
            var menus = arguments;
            cachedResult = {
                res : menus,
                ts : new Date().getTime()
            };
            resolve(filterDay(menus, day));
        });
        Promise.join.apply(Promise, params);
    });
    return places;
}

function filterDay(menus, day) {
    var result = [];
    places.forEach(function(place, index) {
        result.push({
            name : places[index].name,
            url : places[index].url,
            menu : menus[index][day] || []
        });
    });
    return result;
}
/*
var latest = places[places.length -1];
testMenu(latest);
*/
function testMenu(provider) {
    provider.getMenu().then(function(menu) {
        var keys = Object.keys(menu);

        console.log('Menu for ' + provider.name);
        keys.forEach(function(day) {
            console.log('\nDay: ' + day + '\n--------------------');
            console.log(menu[day].join('\n'));
        });

    }).catch(function(err) {
        console.log('Error getting menu from ' + name, err);
    });
}
