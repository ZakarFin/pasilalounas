
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

// server responds without linebreaks can be passed through this 
// if the parser assumes formatted response
// https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
    var formatted = '', indent= '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length-3);
}

module.exports = {
    days,
    getDay,
    startsWithDay,
    extractDay,
    formatXml
};
