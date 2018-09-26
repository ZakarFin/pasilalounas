
export function createPoint(id, coords, title='Rafla', url) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": coords
        },
        "properties": {
            "id": id,
            "title": title,
            "url": url
        }
    }
}

export function getFeatureCollection(places=[]) {
    var obj = {
        "type": "FeatureCollection",
        "features": []
    };
    places.forEach(function (element) {
        if(element.coords) {
            obj.features.push(createPoint(element.id, element.coords, element.name, element.url));
        }
    });
    return obj;
}