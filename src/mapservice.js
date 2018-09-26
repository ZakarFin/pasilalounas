import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiemFrYXJmaW4iLCJhIjoiY2psZHAxMnN1MGRrZTNrbnVqdDZuYzFzeSJ9.TC3uT3hhzh7VTEI_i7vw3A';

import * as turf from '@turf/turf';
import {getFeatureCollection, createPoint} from './geohelper';
import getPopupContent from './domhelper';


export default function createMap (mapId = 'map', 
                                   coords = [24.9293905, 60.1978281], 
                                   menuService) {

    const map = new mapboxgl.Map({
        container: mapId,
        style: 'mapbox://styles/zakarfin/cjm6mxk0q45a22rp9qvxfpl55',
        center: coords,
        zoom: 14.0
    });
    
    map.on('load', () => {
        map.loadImage('/food2.png', (error, image) => {
            if (error) { 
                throw error;
            }
            map.addImage('lunch', image);
            addRestaurantsLayer(map);
            setupHoverPopups(map, menuService);
        });

        var locateEl = document.getElementById('locateme');
        document.getElementById('map').appendChild(locateEl);
        locateEl.style = '';
        locateEl.querySelector('a').addEventListener('click', function() {
            showUserAsMarker(map);
        });
    });
    
    map.on('click', function (e) {
        console.log('Clicked in [' + e.lngLat.lng + ', ' + e.lngLat.lat + ']');
    });
    
  
    return {
        map,
        setRestaurants
    };
};

function addRestaurantsLayer(map) {
    // register source that will hold the restaurants
    map.addSource("restaurants", {
        type: "geojson",
        data: null,
        cluster: true
    });

    // layer for individual restaurants
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

    // layer for showing restaurant clusters 
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
}

function setupHoverPopups(map, menuService) {

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
        var content = getPopupContent(props, menuService);

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
}

function setRestaurants(map, places) {
    var features = getFeatureCollection(places);
    map.getSource('restaurants').setData(features);
    zoomToContent(map);
}

function zoomToContent(map, buffer = 0.1) {
    var features = map.getSource('restaurants')._data;
    // zoom to content extent
    var buffered = turf.buffer(features, buffer);
    var bbox = turf.bbox(buffered);
    map.fitBounds(bbox);
}

function showUserAsMarker(map) {
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
        
        // FIXME: very hacky
        var features = map.getSource('restaurants')._data;
        features.features.push(createPoint('user', userLocation, 'User'));
        zoomToContent(map, 0.5);
    }, function(err) {
        console.error(err);
    });
}
