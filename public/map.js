
mapboxgl.accessToken = 'pk.eyJ1IjoiemFrYXJmaW4iLCJhIjoiY2psZHAxMnN1MGRrZTNrbnVqdDZuYzFzeSJ9.TC3uT3hhzh7VTEI_i7vw3A';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/zakarfin/cjm6mxk0q45a22rp9qvxfpl55',
  center: [24.9293905, 60.1978281],
  zoom: 14.0
});

var places = [];
var socket = io();

socket.on('places', function(msg) {
    console.log('places', msg);
    places = msg;
    addPlaces(places);
});

map.on('click', function (e) {
    console.log('Clicked in [' + e.lngLat.lng + ', ' + e.lngLat.lat + ']');
});

function pointOnCircle(coords, title) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": coords
        },
        "properties": {
            "title": title || 'Rafla'
        }
    }
}

function getPlaces(places) {
    var obj = {
        "type": "FeatureCollection",
        "features": []
    };
    places.forEach(element => {
        if(element.coords) {
            obj.features.push(pointOnCircle(element.coords, element.name));
        }
    });
    return obj;
}
function addPlaces(places) {
    map.on('load', function () {
        map.loadImage('/food2.png', function(error, image) {
            if (error) { throw error; }
            map.addImage('lunch', image);
            var features = getPlaces(places);
            map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": features
                },
                "layout": {
                    //"icon-size": 0.1,
                    "icon-image": "lunch",
                    "text-field": "{title}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [2, 0.6],
                    "text-size": 14,
                    "text-anchor": "top"
                },
                'paint': {
                    "text-color": "#FFFFFF",
                    "icon-color": "#FFFFFF",
                    "icon-halo-color": "#FFFFFF",
                    "text-halo-color": "#FF0000"
                }
            });

            var buffered = turf.buffer(features, 0.1);
            var bbox = turf.bbox(buffered);
            map.fitBounds(bbox);

            navigator.geolocation.getCurrentPosition(function (pos) {
                var crd = pos.coords;
              
                var userLocation = [crd.longitude, crd.latitude];
                var from = turf.point(userLocation);
                
                var center = map.getCenter()
                var to = turf.point([center.lng, center.lat]);
                var distance = turf.distance(from, to);
                
                console.log('The user is at:', pos, 'That is ' +  distance + 'km away.');
                var marker = new mapboxgl.Marker();
                marker.setLngLat(userLocation).addTo(map);
                console.log(marker)
                features.features.push(pointOnCircle(userLocation, 'User'));
                var buffered = turf.buffer(features, 0.5);
                var bbox = turf.bbox(buffered);
                map.fitBounds(bbox);
            }, function(err) {
                console.error(err);
            });
        });
    });

}