var path = require('path');

var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

var lunch = require('./lib/lunch');
var util = require('./lib/util');

function renderHtml(req, res) {
    var day = util.getDay(req.params.day);
    lunch(day).then(function(result) {
        res.render('index', {
            title: 'Lounas@Pasila',
            options : util.days,
            day : day,
            places: result || []
        });
    });
}
// need to setup json before day-routes so it's triggered correctly
app.get('/lunch.json', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    lunch().then(function(result) {
        res.send(result);
    });
});

// index and day-routes
app.get('/', renderHtml);
app.get('/:day', renderHtml);


app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
