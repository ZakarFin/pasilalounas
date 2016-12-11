//var Promise = require("bluebird");

var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'pug');

var lunch = require('./lunch');

var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');
function getDay(requested) {
    if(days.includes(requested)) {
        return requested;
    }
    var day = new Date().getDay();
    if(day === 0) {
        return days[0];
    }
    if(day > 5) {
        return days[days.length - 1];
    }
    return days[day];
}
function renderHtml(req, res) {
    var day = getDay(req.params.day);
    lunch(day).then(function(result) {
        res.render('index', { 
            title: 'Lounas@Pasila', 
            options : days,
            day : day,
            places: result || []
        });
    });
}
app.get('/', renderHtml);
app.get('/:day', renderHtml);

app.get('/lunch.json', function (req, res) {

    lunch(getDay()).then(function(result) {
        res.send(result);
    });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
