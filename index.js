var path = require('path');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

var lunch = require('./lib/lunch');
var util = require('./lib/util');

function renderHtml(req, res, useWS) {
    var day = util.getDay(req.params.day);
    if(useWS) {
        res.render('ws', {
            title: 'Lounas@Pasila',
            options : util.days,
            day : day,
            places: lunch.places()
        });
        return;
    }
    lunch.all(day).then(function(result) {
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
    lunch.all().then(function(result) {
        res.send(result);
    });
});

// index and day-routes
app.get('/', function(req, res) {
    renderHtml(req, res, true);
});
app.get('/map', function(req, res) {
    renderHtml(req, res);
});
app.get('/:day', function(req, res) {
    renderHtml(req, res);
});

io.on('connection', function(socket){
    console.log('a user connected');
    var places = lunch.places();
    socket.emit('places', places);

    places.forEach(function(place) {
        lunch.getMenu(place.id)
            .then(function(menu) {
                socket.emit('menu', {
                    id : place.id,
                    name : place.name,
                    url : place.url,
                    menu : menu
                });
            })
            .catch(function(err) {
                console.log('Error getting menu');
                socket.emit('menu', {
                    id : place.id,
                    name : place.name,
                    url : place.url
                });
            });
    });
});
var server = http.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
