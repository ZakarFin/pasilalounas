
var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');

function getDay(requested) {
    if(days.indexOf(requested) !== -1) {
        return requested;
    }
    var day = new Date().getDay();
    if(day === 0) {
        return days[0];
    }
    if(day > 5) {
        return days[days.length - 1];
    }
    return days[day - 1];
}

function startsWithDay(txt) {
    var isDay = false;
    days.forEach(function(day) {
        if(isDay) {
            return;
        }
        isDay = (txt.toLowerCase().indexOf(day) === 0);
    });
    return isDay;
}

function extractDay(txt) {
    var currentDay;
    days.forEach(function(day) {
        if(currentDay) {
            return;
        }
        if(txt.toLowerCase().indexOf(day) >= 0) {
            currentDay = day;
        }
    })
    return currentDay;
}

module.exports = {
    days,
    getDay,
    startsWithDay,
    extractDay
};
