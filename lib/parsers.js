var util = require('./util');

function parseAmicaJSON(jsonBody){
    var res = {};
    try {
        var json = JSON.parse(jsonBody);
        var menus = json.MenusForDays;

        var addToList = function(day, menu) {
            if(!res[day]) {
                res[day] = [];
            }
            res[day].push(menu);
        };

        var getDayMenus = function(dayMenu, i) {

            // First add header
            if(dayMenu.Components.length > 0 && dayMenu.Name) {
                addToList(util.days[i], dayMenu.Name.toUpperCase());
            }

            dayMenu.Components.forEach(function(menu){
                addToList(util.days[i], menu);
            });
        };

        for(var i=0;i<menus.length;i++) {
            var dayMenu = menus[i];
            var day = dayMenu.Date;

            dayMenu.SetMenus.forEach(function(menu) {
                getDayMenus(menu, i);
            });
        }
    } catch(e) {
        console.log('Error parsing Amica menu');
    }
    return res;
}


module.exports = {
    parseAmicaJSON : parseAmicaJSON
};
