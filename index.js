var blancco = require('./blancco');
var antell = require('./antell');
var Promise = require("bluebird");
var rav911 = require('./ravintola911');


Promise.join(blancco(), antell(), rav911(), function(bl, ant, rav911) {

    var day = "maanantai";
    console.log("Blancco");
    console.log(bl[day]);

    console.log("\nAntell");
    console.log(ant[day]);

    console.log("\nRavintola 911");
    console.log(rav911[day]);
});

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
