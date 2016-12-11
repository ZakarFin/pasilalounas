var Promise = require("bluebird");

var places = [
    require('./adapters/blancco'), 
    require('./adapters/antell'),
    require('./adapters/ravintola911')
];

module.exports = function(day) {
  return new Promise(function(resolve, reject) {
    Promise.join(places[0].getMenu(), places[1].getMenu(), places[2].getMenu(), function() {
        var menus = arguments;
        var result = [];
        places.forEach(function(place, index) {
            result.push({
                name : places[index].name,
                url : places[index].url,
                menu : menus[index][day] || []
            });
            //console.log(places[index].name);
            //console.log(menus[index][day]);
        });
        resolve(result);
    });

  });


    return places;
}
/*
Promise.join(places[0].getMenu(), places[1].getMenu(), places[2].getMenu(), function() {
    var menus = arguments;
    var day = "maanantai";
    places.forEach(function(place, index) {
        console.log(places[index].name);
        console.log(menus[index][day]);
    });
});
*/
//testMenu(rav911, "rav911");

function testMenu(provider, name) {
    provider().then(function(menu) {
        var keys = Object.keys(menu);

        console.log('Menu for ' + name);
        keys.forEach(function(day) {
            console.log('\nDay: ' + day + '\n--------------------');
            console.log(menu[day].join('\n'));
        });

    }).catch(function(err) {
        console.log('Error getting menu from ' + name, err);
    });
}
