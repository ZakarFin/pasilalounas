import menuService from './menuservice';
import mapService from './mapservice';
import initMenus from './coms';

initMenus(menuService);

var {map, setRestaurants} = mapService('map', undefined, menuService);

setTimeout(() => {
    setRestaurants(map, menuService.getPlaces());
}, 10000);