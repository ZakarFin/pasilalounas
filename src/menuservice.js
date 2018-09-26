
class MenuService {
    constructor() {
        this._menus = {};
    }
    setPlaces(places) {
        this._places = places;
    }
    getPlaces() {
        return this._places;
    }
    addMenu(placeId, menu) {
        if(!menu) {
            this._menus[placeId] = [];
            return;
        }
        this._menus[placeId] = menu;
    }
    getMenu(placeId, day) {
        return this._menus[placeId][day];
    }
    hasMenusForAllPlaces() {
        return this._places.length === Object.keys(this._menus).length;
    }
}
const service = new MenuService();


export default service;