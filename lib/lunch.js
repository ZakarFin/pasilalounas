var Promise = require("bluebird");
var cache = require("./cache");

var places = [
    require('./adapters/antell'),
    require('./adapters/keltasirkku'),
    require('./adapters/ratakivi'),
    require('./adapters/merohimal'),
    require('./adapters/blancco'),
    require('./adapters/ravintola911'),
    require('./adapters/factory'),
    require('./adapters/ravintolavaunu'),
    //require('./adapters/amica-maistraatti'),
    require('./adapters/sevilla'),
    require('./adapters/amica-insinoorit-ja-ekonomit'),
    require('./adapters/amica-viherlatva'),
    require('./adapters/amica-sarastus'),
    require('./adapters/dhaulagiri'),
    require('./adapters/ninan-keittio')
];

module.exports = {
    all : function(day) {
        return new Promise(function(resolve, reject) {
            var cached = cache.get('all_menus');
            if(cached) {
                resolve(filterDay(cached, day));
                return;
            }
            var params = [];
            places.forEach(function(place) {
                params.push(
                    place.getMenu()
                        .then(function(menu){
                            return menu;
                        })
                        .catch(function(err) {
                            return {};
                        })
                );

            });
            params.push(function() {
                var menus = arguments;
                cache.set('all_menus', menus);
                resolve(filterDay(menus, day));
            });
            Promise.join.apply(Promise, params);
        });
    },
    places : function() {
        var result = [];
        places.forEach(function(place, index) {
            result.push({
                id : index,
                name : place.name,
                url : place.url
            });
        });
        return result;
    },
    getMenu : function(placeId, day) {
        return new Promise(function(resolve, reject) {
            var cached = cache.get('place_' + placeId);
            if(cached) {
                resolve(cached);
                return;
            }
            if(!places[placeId]) {
                reject('No such place');
                return;
            }
            places[placeId].getMenu()
                .then(function(menu) {
                    cache.set('place_' + placeId, menu);
                    resolve(menu);
                })
                .catch(function(err) {
                    reject('Error getting menu');
                });
        });
    }
};

function filterDay(menus, day) {
    var result = [];
    places.forEach(function(place, index) {
        var item = {
            name : places[index].name,
            url : places[index].url
        };
        if(day) {
            item.menu = menus[index][day] || [];
        } else {
            item.menu = menus[index] || {};
        }
        result.push(item);
    });
    return result;
}

//testMenu(places[places.length -1]);

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
