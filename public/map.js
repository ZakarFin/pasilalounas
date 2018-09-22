
mapboxgl.accessToken = 'pk.eyJ1IjoiemFrYXJmaW4iLCJhIjoiY2psZHAxMnN1MGRrZTNrbnVqdDZuYzFzeSJ9.TC3uT3hhzh7VTEI_i7vw3A';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/zakarfin/cjm6mxk0q45a22rp9qvxfpl55',
  center: [24.9293905, 60.1978281],
  zoom: 14.0
});

var counter = 9999;
var places = [];
var socket = io();
var menus = {};

socket.on('places', function(msg) {
    console.log('places', msg);
    places = msg;
    counter = msg.length;
    addPlaces(places);
});

function createListItem(value, insertBreaks) {
    var li = document.createElement("li");
    var t = document.createTextNode(value);
    li.appendChild(t);
    if(insertBreaks) {
        li.appendChild(document.createElement("br"));
        li.appendChild(document.createElement("br"));
    }
    return li;
}
function createLinkItem(href, text) {
    var li = document.createElement("li");
    var link = document.createElement("a");
    link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    var t = document.createTextNode(text);
    link.appendChild(t);
    li.appendChild(link);
    return li;
}

socket.on('menu', function(msg) {
    if(!msg.menu || !msg.menu[currentDay]) {
        menus[msg.id] = createListItem('Listaa ei saatu ladattua.', true) +
            createLinkItem(msg.url,'Katso ravintolan sivuilta >>');
        receivedmenu();
        return;
    }
    var list = document.createElement("ul");
    // currentDay is inlined as global in HTML
    msg.menu[currentDay].forEach(function(menuItem) {
        if(menuItem && menuItem.trim()) {
            list.appendChild(createListItem(menuItem));
        }
    });
    menus[msg.id] = list;
    console.log('menu for ' + msg.name, msg);
    receivedmenu();
});

function receivedmenu() {
    counter--;
    if(counter === 0) {
        // got all the menus -> disconnect
        socket.close();
        console.log('Close socket');
    }
}

setTimeout(function() {
    if(counter !== 0) {
        socket.close();
        console.log('Closing socket after a minute of waiting for menus. ' + counter + ' menus didnt load.');
    }
}, 60000);
map.on('click', function (e) {
    console.log('Clicked in [' + e.lngLat.lng + ', ' + e.lngLat.lat + ']');
});

function pointOnCircle(id, coords, title) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": coords
        },
        "properties": {
            "id": id,
            "title": title || 'Rafla',
            "menu": ""
        }
    }
}

function getPlaces(places) {
    var obj = {
        "type": "FeatureCollection",
        "features": []
    };
    places.forEach(function (element) {
        if(element.coords) {
            obj.features.push(pointOnCircle(element.id, element.coords, element.name));
        }
    });
    return obj;
}
function addPlaces(places) {
    var features = getPlaces(places);
    map.on('load', function () {
        map.loadImage('/food2.png', function(error, image) {
            if (error) { throw error; }
            map.addImage('lunch', image);

            map.addSource("restaurants", {
                type: "geojson",
                data: features,
                cluster: true
            });
            map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": "restaurants",
                "layout": {
                    "icon-image": "lunch",
                    "text-field": "{title}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [2, 0.6],
                    "text-size": 12,
                    "text-anchor": "top"
                },
                'paint': {
                    "text-color": "#FFFFFF",
                    "icon-color": "#FFFFFF",
                    "text-halo-color": "#FF0000"
                }
            });

            map.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "restaurants",
                filter: ["has", "point_count"],
                layout: {
                    "icon-image": "lunch",
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-size": 18
                },
                'paint': {
                    "text-color": "#FFFFFF",
                    "icon-color": "#FFFFFF",
                    "text-halo-color": "#FF0000"
                }
            });
        
            var buffered = turf.buffer(features, 0.1);
            var bbox = turf.bbox(buffered);
            map.fitBounds(bbox);

            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.on('mouseenter', 'points', function(e) {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                var coordinates = e.features[0].geometry.coordinates.slice();
                var props = e.features[0].properties;
                var content = '<h4>' + props.title + '</h4>';
                if (menus[props.id]) {
                    content = content + menus[props.id].innerHTML;
                }

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates)
                    .setHTML(content)
                    .addTo(map);
            });

            map.on('mouseleave', 'points', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        });
    });
}

function showUserAsMarker() {
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
}
