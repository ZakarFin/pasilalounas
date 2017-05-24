function parseAmicaJSON(jsonBody){
    var res = {};
    var json = JSON.parse(jsonBody);
    var menus = json.MenusForDays;

    var addToList = function(day, menu) {
        if(!res[day]) {
            res[day] = [];
        }
        res[day].push(menu);
    };

    var getDayMenus = function(dayMenu) {
        dayMenu.Components.forEach(function(menu){
            addToList(util.days[i], menu);
        });
    };

    for(var i=0;i<menus.length;i++) {
        var dayMenu = menus[i];
        var day = dayMenu.Date;

        dayMenu.SetMenus.forEach(getDayMenus);
    }

    return res;
}


module.exports = {
    parseAmicaJSON : parseAmicaJSON
};